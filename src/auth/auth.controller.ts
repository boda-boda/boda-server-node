import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  GoneException,
  Header,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CareCenterService } from 'src/care-center/care-center.service';
import LoginRequestDTO from 'src/care-center/dto/login-request.dto';
import { timer } from 'src/common/lib/time';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import ChangePasswordRequest from './dto/change-password-request';
import UpdatePasswordFromEmailRequest from './dto/update-password-from-email-request';
import { getConnection } from 'typeorm';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly careCenterService: CareCenterService,
  ) {}

  @Post('login')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @Header('Access-Control-Allow-Credentials', 'true')
  public async login(@Body() { name, password }: LoginRequestDTO, @Res() response: Response) {
    const careCenter = await this.careCenterService.getCareCenterByName(name);

    // 계정 연동이 되지 않은 경우
    if (!careCenter) {
      throw new NotFoundException('해당 이름의 회원이 존재하지 않습니다.');
    }

    const isPasswordCorrect = await this.authService.checkPassword(careCenter, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 계정 연동이 된 경우
    const refreshToken = this.authService.createRefreshToken(careCenter);
    const accessToken = this.authService.createAccessToken(careCenter);

    await timer(0.25);

    // https://stackoverflow.com/questions/18492576/share-cookie-between-subdomain-and-domain
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 24 * 30 * 1000),
    });

    response.json({
      accessToken,
      expiresIn: 60,
      careCenter: new CareCenterResponse(careCenter),
    });
  }

  @Post('logout')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @Header('Access-Control-Allow-Credentials', 'true')
  public async logout(@Res() response: Response) {
    response.clearCookie('refreshToken');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.send(null);
  }

  @Post('refresh')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @Header('Access-Control-Allow-Credentials', 'true')
  public async refreshAccessToken(@Req() request: Request, @Res() response: Response) {
    if (!request.cookies.refreshToken) {
      response.json({
        statusCode: 400, // Bad Request
      });
      return;
    }

    const refreshToken = request.cookies.refreshToken;

    let careCenter = null;
    try {
      const { data }: any = jwt.verify(refreshToken, process.env.JWT_ACCESSTOKEN_SECRET);
      careCenter = await this.careCenterService.getCareCenterById(data.id);
      if (!careCenter) throw new UnauthorizedException('');
    } catch (e) {
      response.clearCookie('refreshToken');
      response.json({
        statusCode: 401, // Unauthorized
      });
      return;
    }

    const accessToken = this.authService.createAccessToken(careCenter);

    await timer(0.25); // 브루트포스 방지를 위한 로그인 지연 설정

    // 우선 RefreshToken 자체는 업데이트하지 않을 계획. 1달에 1번씩 다시 로그인 시도는 해야 그래도 사용자 정보 보안 유지에 도움이 될 것

    response.json({
      statusCode: 201, // CREATED
      accessToken,
      expiresIn: 60,
      careCenter: new CareCenterResponse(careCenter),
    });
  }

  @Post('create')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @Header('Access-Control-Allow-Credentials', 'true')
  @UseGuards(OnlyAdminGuard)
  public async create(@Res() response: Response, @Body() { name, password }: LoginRequestDTO) {
    const duplicateCareCenter = await this.careCenterService.getCareCenterByName(name);

    if (duplicateCareCenter) {
      throw new ConflictException('이미 존재하는 계정입니다.');
    }

    const result = await this.careCenterService.createCareCenter({ name, password });

    if (!result) {
      throw new InternalServerErrorException('사용자 생성 안됨 오류');
    }

    const accessToken = this.authService.createAccessToken(result);
    const refreshToken = this.authService.createRefreshToken(result);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 24 * 30 * 1000),
    });

    response.json({
      accessToken,
      expiresIn: 60,
      careCenter: new CareCenterResponse(result),
    });
  }

  @Post('reset-password/email')
  public async sendChangeCareCenterPasswordEmail(@Body() { email }: ChangePasswordRequest) {
    const targetCareCenter = await this.careCenterService.findCareCenterByEmail(email);
    if (!targetCareCenter) {
      throw new NotFoundException('해당 이메일로 등록된 센터가 존재하지 않습니다.');
    }

    const entity = await this.authService.createPasswordVerificationKey(targetCareCenter);

    await this.authService.sendResetPasswordEmail(entity.id, entity.email, entity.key);
  }

  @Post('reset-password/email/challenge')
  public async updateCareCenterPasswordFromEmail(
    @Body() { id, password, key }: UpdatePasswordFromEmailRequest,
  ) {
    const verifyEmailEntity = await this.authService.validateResetPasswordEmail(id, key);
    if (!verifyEmailEntity) {
      throw new UnauthorizedException('인증되지 않은 요청입니다.');
    }

    // 중복 요청 검증
    if (!verifyEmailEntity.isKeyActive) {
      throw new ForbiddenException('인증 키가 만료되었습니다.');
    }

    // 만료 기한 검증
    if (new Date(verifyEmailEntity.deadline).getTime() < Date.now()) {
      await this.authService.setVerifyEmailEntityExpired(verifyEmailEntity);
      throw new GoneException('인증 제한 시간이 초과되었습니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    // TODO: 비밀번호 복잡도가 낮을 시 오류 반환하게 하기

    try {
      // 비밀번호 변경하기
      await this.careCenterService.updatePassword(password, verifyEmailEntity.careCenterId);
      // 비밀번호 변경이 성공하였으면 해당 인증번호가 만료되게끔 세팅하기
      await this.authService.setVerifyEmailEntityExpired(verifyEmailEntity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    await queryRunner.release();
  }
}

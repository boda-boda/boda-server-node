import {
  Body,
  ConflictException,
  Controller,
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
      domain: process.env.DOMAIN,
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
      domain: process.env.DOMAIN,
    });

    response.json({
      accessToken,
      expiresIn: 60,
      careCenter: new CareCenterResponse(result),
    });
  }

  @Post('reset-password')
  public async sendChangePasswordEmail(@Body() { email }: ChangePasswordRequest) {
    this.authService.sendResetPasswordEmail(email);
  }
}

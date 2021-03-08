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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CareCenterService } from 'src/care-center/care-center.service';
import LoginRequestDTO from 'src/care-center/dto/login-request.dto';
import { timer } from 'src/common/lib/time';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import CreateCareCenterRequest from 'src/care-center/dto/create-care-center-request.dto';

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
    const associatedCareCenter = await this.careCenterService.getCareCenterByName(name);

    // 계정 연동이 되지 않은 경우
    if (!associatedCareCenter) {
      throw new NotFoundException('해당 이름의 회원이 존재하지 않습니다.');
    }

    const isPasswordCorrect = await this.authService.checkPassword(associatedCareCenter, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 계정 연동이 된 경우
    const refreshToken = this.authService.createRefreshToken(associatedCareCenter);
    const accessToken = this.authService.createAccessToken(associatedCareCenter);

    await timer(0.25);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    response.json({
      accessToken,
      expiresIn: 3600,
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
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    const refreshToken = request.cookies.refreshToken;

    let careCenter = null;
    try {
      const { data }: any = jwt.verify(refreshToken, process.env.JWT_ACCESSTOKEN_SECRET);
      careCenter = await this.careCenterService.getCareCenterById(data.id);
      if (!careCenter) throw new UnauthorizedException('');
    } catch (e) {
      response.clearCookie('refreshToken');
      throw new UnauthorizedException('');
    }

    // 우선 RefreshToken 자체는 업데이트하지 않을 계획. 1달에 1번씩 다시 로그인 시도는 해야 그래도 사용자 정보 보안 유지에 도움이 될 것
    // const newRefreshToken = this.authService.createRefreshToken(careCenter);
    const accessToken = this.authService.createAccessToken(careCenter);

    await timer(0.25);

    // 우선 RefreshToken 자체는 업데이트하지 않을 계획. 1달에 1번씩 다시 로그인 시도는 해야 그래도 사용자 정보 보안 유지에 도움이 될 것
    // response.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    // });

    response.json({
      accessToken,
      expiresIn: 3600,
    });
  }

  @Post('create')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @Header('Access-Control-Allow-Credentials', 'true')
  public async create(
    @Res() response: Response,
    @Body() { name, password }: CreateCareCenterRequest,
  ) {
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

    response.cookie('refreshToken', refreshToken);
    response.json({
      accessToken,
      expiresIn: 3600,
    });
  }
}

import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Header,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CareWorkerService } from 'src/care-worker/care-worker.service';
import CareWorkerResponse from 'src/care-worker/dto/care-worker-response';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import CreateCareCenterRequest from './dto/create-care-center-request.dto';
import LoginRequestDTO from './dto/login-request.dto';
import { CareCenterService } from './care-center.service';
import { timer } from 'src/common/lib/time';
import * as jwt from 'jsonwebtoken';

@Controller('care-center')
export class CareCenterController {
  public constructor(
    private readonly careCenterService: CareCenterService,
    private readonly careWorkerService: CareWorkerService,
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

    const isPasswordCorrect = await this.careCenterService.checkPassword(
      associatedCareCenter,
      password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 계정 연동이 된 경우
    const refreshToken = this.careCenterService.createRefreshToken(associatedCareCenter);
    const accessToken = this.careCenterService.createAccessToken(associatedCareCenter);

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
    // const newRefreshToken = this.careCenterService.createRefreshToken(careCenter);
    const accessToken = this.careCenterService.createAccessToken(careCenter);

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

    const accessToken = this.careCenterService.createAccessToken(result);
    const refreshToken = this.careCenterService.createRefreshToken(result);

    response.cookie('refreshToken', refreshToken);
    response.json({
      accessToken,
      expiresIn: 3600,
    });
  }

  @Get('/:careCenterId/care-worker')
  @UseGuards(OnlyAdminGuard)
  public async getCareWorkersByCareCenterId(
    @Param('careCenterId', ValidateIdPipe) careCenterId: string,
  ) {
    const careWorkers = await this.careWorkerService.getCareWorkersByCareCenterId(careCenterId);

    return careWorkers.map((c) => new CareWorkerResponse(c));
  }
}

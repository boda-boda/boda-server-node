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
import { OnlyGuestGuard } from 'src/common/guard/only-guest.guard';
import { OnlyUserGuard } from 'src/common/guard/only-user.guard';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import CreateUserRequest from './dto/create-user-request.dto';
import LoginRequestDTO from './dto/login-request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly careWorkerService: CareWorkerService,
  ) {}

  @Post('login')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyGuestGuard)
  public async login(@Body() { name, password }: LoginRequestDTO, @Res() response: Response) {
    const associatedUser = await this.userService.getUserByName(name);

    // 계정 연동이 되지 않은 경우
    if (!associatedUser) {
      throw new NotFoundException('해당 이름의 회원이 존재하지 않습니다.');
    }

    const isPasswordCorrect = await this.userService.checkPassword(associatedUser, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 계정 연동이 된 경우

    const accessToken = this.userService.createAccessToken(associatedUser);

    response.cookie('accessToken', accessToken);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Cache-Control', ['no-cache', 'no-store', 'must-revalidate']);
    response.json({ result: true });
  }

  @Post('logout')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  public async logout(@Res() response: Response) {
    response.clearCookie('accessToken');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.json({ result: true });
  }

  @Post('create')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  public async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() { name, password }: CreateUserRequest,
  ) {
    const duplicateUser = await this.userService.getUserByName(name);

    if (duplicateUser) {
      throw new ConflictException('이미 존재하는 계정입니다.');
    }

    const result = await this.userService.createUser({ name, password });

    if (!result) {
      throw new InternalServerErrorException('사용자 생성 안됨 오류');
    }

    const accessToken = this.userService.createAccessToken(result);

    response.clearCookie('signup');
    response.cookie('accessToken', accessToken);
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    response.json({ result: true });
  }

  @Get('/:userId/care-worker')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyAdminGuard)
  public async getCareWorkersByUserId(@Param('userId', ValidateIdPipe) userId: number) {
    const careWorkers = await this.careWorkerService.getCareWorkersByUserId(userId);

    return careWorkers.map((c) => new CareWorkerResponse(c));
  }
}

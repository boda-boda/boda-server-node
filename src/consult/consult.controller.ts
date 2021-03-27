import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { SentryInterceptor } from 'src/common/interceptor/sentry.interceptor';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { ConsultService } from './consult.service';
import CreateConsultRequest from './dto/create-consult-request';

@Controller('consult')
@UseInterceptors(SentryInterceptor)
export class ConsultController {
  public constructor(private readonly consultService: ConsultService) {}

  @Get('/')
  @UseGuards(OnlyAdminGuard)
  public async getAllConsults() {
    return await this.consultService.getAllConsults();
  }

  @Post()
  public async createConsult(@Body() createConsultRequest: CreateConsultRequest) {
    return await this.consultService.createConsult(createConsultRequest);
  }

  @Patch('/:id')
  public async finishConsult(@Param('id', ValidateIdPipe) id: number) {
    return await this.consultService.finishConsultById(id);
  }
}

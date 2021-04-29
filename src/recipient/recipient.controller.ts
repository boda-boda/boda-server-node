import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { getConnection } from 'typeorm';
import UpsertRecipientRequest from './dto/upsert-recipient-request.dto';
import { RecipientService } from './recipient.service';

@Controller('recipient')
export class RecipientController {
  public constructor(private readonly recipientService: RecipientService) {}

  @Get('/')
  @UseGuards(OnlyCareCenterGuard)
  public async getAllRecepientOfCareCenter(@Req() request: Request) {
    return await this.recipientService.getAllRecepientOfCareCenter(request.careCenter.id);
  }

  @Get('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async getRecipientById(@Req() request: Request, @Param('id') id: string) {
    return await this.recipientService.getRecipientById(request.careCenter.id, id);
  }

  @Post()
  @UseGuards(OnlyCareCenterGuard)
  public async createRecipient(
    @Req() request: Request,
    @Body() recipientRequest: UpsertRecipientRequest,
  ) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.recipientService.createRecipient(request.careCenter.id, recipientRequest);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    await queryRunner.release();
  }

  @Put('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async updateRecipient(
    @Req() request: Request,
    @Body() recipientRequest: UpsertRecipientRequest,
    @Param('id') id: string,
  ) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.recipientService.updateRecipient(request.careCenter.id, recipientRequest, id);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    await queryRunner.release();
  }

  @Delete('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async deleteRecipientById(@Req() request: Request, @Param('id') id: string) {
    await this.recipientService.deleteRecipientById(request.careCenter.id, id);
  }
}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CareWorkerService } from 'src/care-worker/care-worker.service';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { RecipientService } from 'src/recipient/recipient.service';
import { SmsService } from 'src/sms/sms.service';
import CreateMatchingProposalRequest from './dto/create-matching-proposal-request.dto';
import { MatchingProposalService } from './matching-proposal.service';

@Controller('matching-proposal')
export class MatchingProposalController {
  public constructor(
    private readonly matchingProposalService: MatchingProposalService,
    private readonly careWorkerService: CareWorkerService,
    private readonly recipientService: RecipientService,
    private readonly smsService: SmsService,
  ) {}

  @Get('/')
  @UseGuards(OnlyCareCenterGuard)
  public async getMatchingProposalsOfCareCenter(@Req() request: Request) {
    return await this.matchingProposalService.getMatchingProposalsOfCareCenter(
      request.careCenter.id,
    );
  }

  @Get('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async getMatchingProposalById(@Req() request: Request, @Param('id') id: string) {
    return await this.matchingProposalService.getMatchingProposalById(request.careCenter.id, id);
  }

  @Post('/')
  @UseGuards(OnlyCareCenterGuard)
  public async createMatchingProposal(
    @Req() request: Request,
    @Body() createMatchingProposalRequest: CreateMatchingProposalRequest,
  ) {
    const isValidCareWorker = await this.careWorkerService.checkCareCenterValid(
      createMatchingProposalRequest.careWorkerId,
      request.careCenter.id,
    );

    if (!isValidCareWorker) throw new NotFoundException('요청하신 요양보호사가 존재하지 않습니디.');

    const recipient = await this.recipientService.checkRecipientValid(
      createMatchingProposalRequest.recipientId,
      request.careCenter.id,
    );

    if (!recipient) throw new NotFoundException('요청하신 수급자가 존재하지 않습니디.');

    this.smsService.sendMessage(recipient.phoneNumber);

    return await this.matchingProposalService.createMatchingProposal(
      createMatchingProposalRequest,
      request.careCenter.id,
    );
  }
}

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
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { OuterCareWorkerService } from 'src/outer-care-worker/service/outer-care-worker.service';
import { RecipientService } from 'src/recipient/recipient.service';
import { SmsService } from 'src/sms/sms.service';
import CreateMatchingProposalRequest from './dto/create-matching-proposal-request.dto';
import MatchingProposalResponse from './dto/matching-proposal-response.dto';
import { MatchingProposalService } from './matching-proposal.service';

@Controller('matching-proposal')
export class MatchingProposalController {
  public constructor(
    private readonly matchingProposalService: MatchingProposalService,
    private readonly outerCareWorkerService: OuterCareWorkerService,
    private readonly recipientService: RecipientService,
    private readonly smsService: SmsService,
  ) {}

  @Get('/')
  @UseGuards(OnlyCareCenterGuard)
  public async getMatchingProposalsOfCareCenter(@Req() request: Request) {
    const matchingProposals = await this.matchingProposalService.getMatchingProposalsOfCareCenter(
      request.careCenter.id,
    );

    return matchingProposals.map((m) => new MatchingProposalResponse(m));
  }

  @Get('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async getMatchingProposalById(@Req() request: Request, @Param('id') id: string) {
    const matchingProposal = await this.matchingProposalService.getMatchingProposalById(
      request.careCenter.id,
      id,
    );

    return new MatchingProposalResponse(matchingProposal);
  }

  @Post('/')
  @UseGuards(OnlyCareCenterGuard)
  public async createMatchingProposal(
    @Req() request: Request,
    @Body() createMatchingProposalRequest: CreateMatchingProposalRequest,
  ) {
    const isValidCareWorker = await this.outerCareWorkerService.getOuterCareWorkerById(
      createMatchingProposalRequest.outerCareWorkerId,
    );

    if (!isValidCareWorker) throw new NotFoundException('요청하신 요양보호사가 존재하지 않습니디.');

    const recipient = await this.recipientService.checkRecipientValid(
      request.careCenter.id,
      createMatchingProposalRequest.recipientId,
    );

    if (!recipient) throw new NotFoundException('요청하신 수급자가 존재하지 않습니디.');

    this.smsService.sendMessage(recipient.phoneNumber);

    return await this.matchingProposalService.createMatchingProposal(
      createMatchingProposalRequest,
      request.careCenter.id,
    );
  }
}

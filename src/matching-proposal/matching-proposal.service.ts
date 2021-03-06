import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { getConnection, Repository } from 'typeorm';
import CreateMatchingProposalRequest from './dto/create-matching-proposal-request.dto';
import { MatchingProposalEntity } from './matching-proposal.entity';
import * as crypto from 'crypto';
import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { RecipientMetaEntity } from 'src/recipient/entity/recipient-meta.entity';
import { MatchingProposalStatus } from 'src/constant';

@Injectable()
export class MatchingProposalService {
  public constructor(
    @InjectRepository(MatchingProposalEntity)
    private readonly matchingProposalRespository: Repository<MatchingProposalEntity>,
    @InjectRepository(OuterCareWorkerEntity)
    private readonly outerCareWorkerRepository: Repository<OuterCareWorkerEntity>,
    @InjectRepository(RecipientEntity)
    private readonly recipientRepository: Repository<RecipientEntity>,
    @InjectRepository(RecipientMetaEntity)
    private readonly recipientMetaRepository: Repository<RecipientMetaEntity>,
  ) {}

  public getMatchingProposalById(careCenterId: string, id: string) {
    return this.matchingProposalRespository.findOne({
      relations: ['outerCareWorker', 'recipient'],
      where: { id, careCenterId },
    });
  }

  public getMatchingProposalByMatchingProposalId(id: string) {
    return this.matchingProposalRespository.findOne({
      relations: ['recipient'],
      where: { id },
    });
  }

  public getMatchingProposalsOfCareCenter(careCenterId: string) {
    return this.matchingProposalRespository.find({
      relations: ['outerCareWorker', 'recipient'],
      where: { careCenterId, isDeleted: false },
    });
  }
  private createXNcpApigwSignatureV2(timeStamp: string) {
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const uri = process.env.NCLOUD_SMS_SERVICE_ID;
    const accessKey = process.env.NCLOUD_DOLBOM_ACCESS_KEY;
    const secretKey = process.env.NCLOUD_DOLBOM_SECRET_KEY;
    const url2 = `/sms/v2/services/${uri}/messages`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(method)
      .update(space)
      .update(url2)
      .update(newLine)
      .update(timeStamp)
      .update(newLine)
      .update(accessKey)
      .digest('base64');
    return signature.toString();
  }
  public async createMatchingProposal(
    createMatchingProposalRequest: CreateMatchingProposalRequest,
    careCenterId: string,
  ) {
    const randomSecurityCode = Math.floor(Math.random() * 10000);
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const newMatchingProposal = this.matchingProposalRespository.create(
        createMatchingProposalRequest,
      );
      newMatchingProposal.careCenterId = careCenterId;
      newMatchingProposal.securityCode = randomSecurityCode;
      await queryRunner.manager.save(newMatchingProposal);

      const outerCareWorker = await this.outerCareWorkerRepository.findOne({
        where: {
          id: newMatchingProposal.outerCareWorkerId,
          isDeleted: false,
        },
      });

      const recipient = await this.recipientRepository.findOne({
        relations: ['recipientMetas'],
        where: {
          careCenterId: careCenterId,
          id: newMatchingProposal.recipientId,
          isDeleted: false,
        },
      });
      const link = `https://dol-bom.com/matching-proposal-receive/${newMatchingProposal.id}`;
      const message = {
        type: 'LMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.NCLOUD_DOLBOM_SMS_PHONE_NUMBER,
        content: '??????',
        messages: [
          {
            to: `${outerCareWorker.phoneNumber}`,
            subject: '[??????]',
            content: `${recipient.isFemale ? '???' : '???'}/${recipient.grade}??????/${
              recipient.age
            }???\n??????: ${recipient.schedule}\n??????: ${recipient.address}\n??????: ${
              newMatchingProposal.hourlyWage
            }???\n????????? ?????? [????????????: ${randomSecurityCode}]\n${link}/`,
          },
        ],
      };

      const timestamp = Date.now().toString();

      const signature = this.createXNcpApigwSignatureV2(timestamp);

      const response = await axios.post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NCLOUD_SMS_SERVICE_ID}/messages`,
        message,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': process.env.NCLOUD_DOLBOM_ACCESS_KEY,
            'x-ncp-apigw-signature-v2': signature,
          },
        },
      );
      queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  public async updateMatchingProposal(id: string, status: MatchingProposalStatus) {
    const targetMatchingProposal = await this.matchingProposalRespository.findOne({
      where: {
        id: id,
      },
    });

    const updatedTargetMatchingProposal = {
      ...targetMatchingProposal,
      status: status,
    };

    const mergedTargetMatchingProposal = this.matchingProposalRespository.merge(
      targetMatchingProposal,
      updatedTargetMatchingProposal,
    );
    await this.matchingProposalRespository.save(mergedTargetMatchingProposal);
    return mergedTargetMatchingProposal;
  }

  public async deleteMatchingProposalById(careCenterId: string, id: string) {
    const targetMatchingProposal = await this.matchingProposalRespository.findOne({
      where: {
        careCenterId,
        id,
        isDeleted: false,
      },
    });

    targetMatchingProposal.isDeleted = true;
    await this.matchingProposalRespository.save(targetMatchingProposal);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { getConnection, Repository } from 'typeorm';
import { ConsultEntity } from './consult.entity';
import CreateConsultRequest from './dto/create-consult-request';
import * as crypto from 'crypto';

@Injectable()
export class ConsultService {
  public constructor(
    @InjectRepository(ConsultEntity)
    private readonly consultRepository: Repository<ConsultEntity>,
  ) {}

  public async createConsult(createConsultRequest: CreateConsultRequest) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const newConsult = this.consultRepository.create(createConsultRequest);
      newConsult.isFinished = false;
      await queryRunner.manager.save(newConsult);

      const message = {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.NCLOUD_DOLBOM_SMS_PHONE_NUMBER,
        content: '돌봄',
        messages: [
          {
            to: `01020270767`,
            subject: '[돌봄]',
            content: `[${newConsult.contact}]에서 상담 요청이 왔습니다.`,
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

  public async getAllConsults() {
    return await this.consultRepository.find();
  }

  public async finishConsultById(consultId: number) {
    const targetConsult = await this.consultRepository.findOne({
      where: {
        id: consultId,
      },
    });

    targetConsult.isFinished = true;
    return this.consultRepository.save(targetConsult);
  }
}

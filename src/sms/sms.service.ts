import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
@Injectable()
export class SmsService {
  private hmac: crypto.Hmac;

  // https://sens.apigw.ntruss.com/apigw/swagger-ui?productId=plv61henn8&apiId=j5tgfxp2ba&stageId=a0y11xe7vi&region=KR#/v2
  public async sendMessage(phoneNumber: string) {
    const message = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: process.env.NCLOUD_DOLBOM_SMS_PHONE_NUMBER,
      content: '안녕하세요 돌봄입니다.',
      messages: [
        {
          to: phoneNumber,
          subject: '돌봄',
          content: '안녕하세요 돌봄입니다.',
        },
      ],
    };

    const timestamp = Date.now().toString();

    const signature = this.createXNcpApigwSignatureV2(timestamp);

    try {
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
      return response;
    } catch (e) {
      return e.response.data;
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
}

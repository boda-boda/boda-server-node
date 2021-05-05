import { Injectable } from '@nestjs/common';
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
      from: '01020140794',
      messages: [
        {
          to: phoneNumber,
          content: '위의 content와 별도로 해당 번호로만 보내는 내용(optional)',
        },
      ],
    };

    const timestamp = Date.now();
    const signature = this.createXNcpApigwSignatureV2(timestamp);

    try {
      const response = await axios.post(
        `${process.env.NCLOUD_SMS_API_URL}/services/${process.env.NCLOUD_SMS_SERVICE_ID}/messages`,
        message,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': process.env.NCLOUD_RIVERANDEYE_KEY,
            'x-ncp-apigw-signature-v2': signature,
          },
        },
      );
    } catch (e) {
      console.log(e.request);
      console.log(e.response);
    }
  }

  private createXNcpApigwSignatureV2(timestamp: number) {
    const message = `POST /sms/v2/services/${process.env.NCLOUD_SMS_SERVICE_ID}/messages\n${timestamp}\n${process.env.NCLOUD_RIVERANDEYE_KEY}`;
    console.log(message);

    const signature = crypto
      .createHmac('sha256', process.env.NCLOUD_RIVERANDEYE_SECRET_KEY)
      .update(JSON.stringify(message))
      .digest('base64');

    return signature;
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  public constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_GMAIL,
        pass: process.env.AUTH_GMAIL_PASSWORD,
      },
    });
  }

  public async sendResetPasswordEmail(email: string) {
    const info = await this.transporter.sendMail({
      from: '"돌봄 고객센터" <help@dol-bom.com>',
      to: email,
      subject: '[돌봄] 새로운 비밀번호를 설정해주세요',
      html: `<div style="padding: 26px 18px;">
              <img style="width: 150px" src="https://dolbom.s3.amazonaws.com/newFiles/f291e097-b8de-4be8-bfa9-73fbded4ab54_logo.png"/>
              <h1 style="margin-top: 23px; margin-bottom: 9px; color: #222222; font-size: 19px; line-height: 25px; letter-spacing: -0.27px;">새 비밀번호 설정</h1>
              <p style="margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0; line-height: 1.47; letter-spacing: -0.22px; font-size: 15px; margin: 8px 0 0;">안녕하세요, 돌봄입니다.</p>
              <p style="margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0; line-height: 1.47; letter-spacing: -0.22px; font-size: 15px; margin: 8px 0 0;">아래 버튼을 눌러 새 비밀번호를 설정해주세요.</p>
              <a style="text-decoration: none; color: white; display: inline-block; font-size: 15px; font-weight: 500; font-stretch: normal; font-style: normal; line-: normal; letter-spacing: normal; border-radius: 2px; background-color: #141517; margin: 24px 0 19px; padding: 11px 6px;" href="https://www.dol-bom.com">비밀번호 변경하기</a>
              <br/>
              <p style="margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0; line-height: 1.47; letter-spacing: -0.22px; font-size: 15px; margin: 8px 0 0;">감사합니다.<br/>돌봄 팀 드림</p>
            </div>`,
    });

    console.log('Message sent: %s', info.messageId);
  }
}

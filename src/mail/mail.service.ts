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

  // TODO : 메일 수신 에러 핸들링
  public async sendResetPasswordEmail(email: string, key: string) {
    const info = await this.transporter.sendMail({
      from: '"돌봄 고객센터" <help@dol-bom.com>',
      to: email,
      subject: '[돌봄] 새로운 비밀번호를 설정해주세요',
      html: `<div style="padding: 26px 18px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
                <td>
                  <img
                    src="https://user-images.githubusercontent.com/52532871/112148942-cf9e4e80-8c21-11eb-84e1-dbd59a5c6d23.png"
                    width="100%"
                  />
                  <div style="width: 100%; height: 2px; background-color: #683b93"></div>
                </td>
              </tr>
              <tr>
                <td style="padding: 50px 30px">
                  <h3>새 비밀번호 설정</h3>
                  <p>
                    안녕하세요, 돌봄입니다.<br />
                    아래 버튼을 눌러 새 비밀번호를 설정해주세요.
                  </p>
                  <div style="margin: 30px 0">
                    <a
                      href="${process.env.PASSWORD_RESET_URL}/reset-password?email=${email}&key=${key}"
                      style="background-color: #683b93; color: white; text-decoration: none; padding: 10px 15px; border-radius: 3px"
                      >비밀번호 변경하기</a
                    >
                  </div>
                  <p>
                    감사합니다.<br />
                    돌봄 팀 드림.
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="width: 100%; height: 2px; background-color: #683b93"></div>
                  <div style="padding: 10px 30px; font-size: 12px; color: #555; background-color: #eee">
                    <p>
                      BoDa | 대표이사 : 김예지 | 개인정보관리책임자 : 백종근<br />사업자번호 : 252-63-00514 | 통신판매업 신고 번호 :
                      제 2017-서울강남-00000호
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </div>`,
    });
  }
}

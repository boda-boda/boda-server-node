import { NestMiddleware, Injectable, BadRequestException } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import CareCenterResponse from '../../care-center/dto/care-center-response.dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      careCenter?: CareCenterResponse;
    }
  }
}

@Injectable()
export class DeserializeCareCenterMiddleWare implements NestMiddleware {
  public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return next();
    }

    if (!bearerToken.startsWith('Bearer ') || bearerToken.split(' ').length !== 2) {
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');
    }

    const accessToken = bearerToken.split(' ')[1];

    try {
      const { data }: any = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRET);

      if (data) {
        request.careCenter = data;
      }

      return next();
    } catch (e) {
      throw new BadRequestException('토근이 만료되었거나 올바르지 않습니다.');
    }
  }
}

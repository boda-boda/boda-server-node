import { NestMiddleware, Injectable } from '@nestjs/common';
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
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      return next();
    }

    try {
      const { data }: any = jwt.verify(accessToken, process.env.JWT_SECRET);

      if (data) {
        request.careCenter = data;
      }
    } catch (e) {
      response.clearCookie('accessToken');
    }

    return next();
  }
}

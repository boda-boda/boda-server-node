import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiVersion(): string {
    return 'dolbom api: version 0.1.0';
  }
}

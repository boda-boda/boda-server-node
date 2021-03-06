import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  public transform(Id: string) {
    if (!this.isNumber(Id)) {
      throw new BadRequestException('숫자로 입력바람');
    }

    return Number(Id);
  }

  private isNumber(Id: string) {
    return Id.match(/[1-9]\d*$/);
  }
}

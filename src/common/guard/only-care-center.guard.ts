import { ExecutionContext, CanActivate, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OnlyCareCenterGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.careCenter) {
      throw new BadRequestException('Only allowed to a member');
    }

    return true;
  }
}

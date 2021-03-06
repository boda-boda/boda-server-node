import { ExecutionContext, CanActivate, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user || request.user?.name !== 'admin') {
      throw new BadRequestException('Only allowed to admin');
    }

    return true;
  }
}



import { ExecutionContext, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
  private readonly authService:AuthService
  ) { super(); }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No authorization header');
    const token = authHeader.replace('Bearer ', '');
    const valid = (await super.canActivate(context)) as boolean;
    if (!valid) return false;

    if (await this.authService.isBlackListedToken(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return true;
  }
}
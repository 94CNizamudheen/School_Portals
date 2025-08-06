

import { ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from './entities/blacklist.schema';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistedModel: Model<BlacklistedToken>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    const isBlacklisted = await this.blacklistedModel.exists({ token });
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser = Express.User>(
    err: unknown,
    user: TUser,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

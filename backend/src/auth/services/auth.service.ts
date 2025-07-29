

import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger, Inject, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto } from '../dtos/register.dtos';
import { SignInDto } from '../dtos/signin.dto';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from '../dtos/password.dtos';
import { User } from '../entities/user.schema';
import { JwtPayload } from 'jwt-decode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @Inject('IAuthRepository') private readonly repo: AuthRepository,
    private config:ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async register(dto: RegisterDto): Promise<{ access_token: string, user: User }> {
    this.logger.log(`DTO received: ${JSON.stringify(dto)}`);
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const user = await this.repo.createUser(dto.name, dto.email, dto.password, dto.role);

    this.logger.log(`User registered successfully: ${user.email} (ID: ${user._id}) `);
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string; refresh_token: string; userId: string, user: User }> {
    const user = await this.repo.findUserByEmail(dto.email);
    this.logger.log(`user ${user}`)
    if (!user || !(await this.repo.comparePasswords(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'), // e.g., "7d"
    })

    return { access_token: this.jwtService.sign(payload),refresh_token, userId: user.id, user };
  };
  async refreshToken(refresh_token:string):Promise<{access_token:string}>{
    try {
      const payload= this.jwtService.verify(refresh_token,{secret:this.config.get('JWT_SECRET')});
      const newAccessToken= this.jwtService.sign(
        {sub:payload.sub,email:payload.email,role:payload.role},
        {expiresIn:this.config.get('JWT_EXPIRES_IN')}
      );
      return {access_token:newAccessToken}
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
  }

  async logout(token: string): Promise<void> {
    const decoded: any = this.jwtService.decode(token) as JwtPayload | null;
    if (!decoded || !decoded.exp) throw new BadRequestException("Invalid token")
    const expiredAt = new Date(decoded.exp * 1000);
    await this.repo.createBlacklist(token, expiredAt)
  }

  async sendOtp(email: string): Promise<void> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const code = await this.repo.createOtp(email);
    this.logger.log(`OTP sent to ${email}: ${code}`);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    const otp = await this.repo.findOtp(dto.email, dto.code);
    if (!otp || otp.expireAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.repo.deleteOtp(dto.email);
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    await this.repo.deleteOtp(email);
    await this.sendOtp(email);
  }

  async forgetPassword(dto: ForgotPasswordDto): Promise<void> {
    await this.sendOtp(dto.email);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    this.logger.log(`new password is ${dto.password}`)
    await this.repo.updatePassword(dto.email, dto.password);
  }
  async fetchUser(id: string) {
    const user = await this.repo.findUserById(id);
    if (!user) throw new NotFoundException('User not found')
    return user
  }
  async handleGoogleLogin(body: { name: string, email: string, role: string }) {
    let user = await this.repo.findUserByEmail(body.email);
    if (!user) {
      user = await this.repo.createUser(body.name, body.email, 'google-oauth', body.role);
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
      user
    }
  }

}

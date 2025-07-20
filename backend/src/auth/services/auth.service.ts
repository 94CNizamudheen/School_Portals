

import {Injectable,  UnauthorizedException, BadRequestException, NotFoundException, Logger, Inject,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository'; 
import { RegisterDto } from '../dtos/register.dtos';
import { SignInDto } from '../dtos/signin.dto';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from '../dtos/password.dtos';

@Injectable()
export class AuthService {
  private readonly logger= new Logger(AuthService.name)
  constructor(
    @Inject('IAuthRepository') private readonly repo: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    this.logger.log(`DTO received: ${JSON.stringify(dto)}`);
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const user = await this.repo.createUser(dto.name, dto.email, dto.password, dto.role);

    this.logger.log(`User registered successfully: ${user.email} (ID: ${user._id}) `);
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string; userId: string }> {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user || !(await this.repo.comparePasswords(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), userId: user.id };
  }

  async sendOtp(email: string): Promise<void> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const code = await this.repo.createOtp(email);
    console.log(`OTP sent to ${email}: ${code}`);
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

    const valid = await this.verifyOtp({ email: dto.email, code: dto.otp });
    if (!valid) throw new BadRequestException('Invalid OTP');

    await this.repo.updatePassword(dto.email, dto.newPassword);
  }
  async fetchUser(id:string){
    const user= await this.repo.findUserById(id);
    if(!user) throw new NotFoundException('User not found')
    return user
  }

}

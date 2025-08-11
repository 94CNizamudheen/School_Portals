

import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger, Inject, ForbiddenException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dtos/register.dtos';
import { SignInDto } from '../dtos/signin.dto';
import { ForgotPasswordDto, ResetPasswordDto, StudentGenarteOtpDto, VerifyOtpDto } from '../dtos/password.dtos';
import { User } from '../../user/entities/user.schema';
import { JwtPayload } from 'jwt-decode';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { IUserRepository } from 'src/user/repositories/interfaces/user.repositoriy.interface';
import { IAuthRepository } from '../repositories/interfaces/auth-repository.interface';
import { IStudentRepository } from 'src/student/repositories/interfaces/student-repositories.interface';
import { IParentRepository } from 'src/parent/repositories/interfaces/parent.repository.interface';
import { studentOtpTemplate } from 'src/mailer/utils/templates/studentPasswordChangeOtp';

import { MailService } from 'src/mailer/services/mail.service';
import { studentForgotTemplate } from 'src/mailer/utils/templates/student.forgot.password.template';
import * as bcrypt from 'bcrypt'
import { generateRandomPassword } from 'src/utils/generate.random.password';
import { userOtpTemplate } from 'src/mailer/utils/templates/userOtpTemplate ';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @Inject('IAuthRepository') private readonly repo: IAuthRepository,
    @Inject("IUserRepository") private readonly userRepo: IUserRepository,
    @Inject('IStudentRepository') private readonly studentRepo: IStudentRepository,
    @Inject("IParentRepository") private readonly parentRepo: IParentRepository,
    private readonly mailService: MailService,
    private config: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async register(dto: RegisterDto): Promise<{ access_token: string, user: User }> {
    this.logger.log(`DTO received: ${JSON.stringify(dto)}`);
    const existing = await this.userRepo.findUserByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const createUserDto: CreateUserDto = { name: dto.name, email: dto.email, password: dto.password, role: dto.role };
    const user = await this.userRepo.createUser(createUserDto);

    this.logger.log(`User registered successfully: ${user.email} (ID: ${user._id}) `);
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string; refresh_token: string; userId: string, user: User }> {
    let user;
    this.logger.debug(dto.studentIdentity)
    if (dto.studentIdentity) {
      user = await this.studentRepo.findByIdentity(dto.studentIdentity)
    } else if (dto.email) {
      user = await this.userRepo.findUserByEmail(dto.email);
    } else {
      this.logger.debug('No identifier provided')
      throw new BadRequestException("Invalid Credentials")
    }

    if (!user) {
      this.logger.warn(`No user found for identifier: ${dto.studentIdentity || dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug("student password", user.password)
    this.logger.debug(`User found: ${user?.email || user?.studentIdentity}`)
    const passwordMatch = await this.repo.comparePasswords(dto.password, user.password);
    if (!passwordMatch) {
      this.logger.warn(`Password mismatch for user: ${user.email || user.studentIdentity}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    })

    return { access_token, refresh_token, userId: user.id.toString(), user };
  };
  async refreshToken(refresh_token: string): Promise<{ access_token: string, refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refresh_token, { secret: this.config.get('JWT_SECRET') });
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { expiresIn: this.config.get('JWT_EXPIRES_IN') }
      );
      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') }
      );
      const decoded: any = this.jwtService.decode(refresh_token) as JwtPayload | null;
      if (decoded && decoded.exp) {
        const expiredAt = new Date(decoded.exp * 1000);
        await this.repo.createBlacklist(refresh_token, expiredAt);
      }
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });
      const decoded: any = this.jwtService.decode(token) as JwtPayload | null;
      if (!decoded || !decoded.exp) throw new BadRequestException("Invalid token");
      const expiredAt = new Date(decoded.exp * 1000);
      await this.repo.createBlacklist(token, expiredAt);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async sendOtp(email: string): Promise<void> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const code = await this.repo.createOtp(email);
    this.logger.log(`OTP sent to ${email}: ${code}`);

    const subject = "Otp for change password";
    const text = `Dear ${user.name} `;
    const html = userOtpTemplate(user.name, code)
    try {
      await this.mailService.sendMail({ to: user.email, subject, text, html })
    } catch (error) {
      this.logger.error(`Failed to send  email to ${user.email}`)
      error.stack || error.messag
    }
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
    this.logger.debug("invoked reset password")
    if (dto.email) {
      const user = await this.userRepo.findUserByEmail(dto.email);
      if (!user) throw new NotFoundException('User not found');
      return await this.repo.updatePassword(dto.email, dto.password);
    } else if (dto.identity) {
      const student = await this.studentRepo.findByIdentity(dto.identity);
      this.logger.debug(student)
      if (!student) throw new NotFoundException('Student not found');
      return await this.studentRepo.updatePassword(dto.identity, dto.password)
    } else {
      throw new ForbiddenException('failed to reset')
    }
  }

  async handleGoogleLogin(body: { name: string, email: string, role: string }) {
    let user = await this.userRepo.findUserByEmail(body.email);
    if (!user) {
      const createUserDto: CreateUserDto = { name: body.name, email: body.email, password: 'google-oauth', role: body.role };
      user = await this.userRepo.createUser(createUserDto);
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
      user
    }
  };
  async generateStudentOtp(dto: StudentGenarteOtpDto) {
    const parent = await this.parentRepo.findByEmail(dto.email);
    if (!parent) throw new NotFoundException("Parent not found");
    const student = await this.studentRepo.findByIdentity(dto.identity);
    if (!student) throw new NotFoundException('Student Not found');
    const otp = await this.repo.createOtp(dto.email)
    const subject = "Otp for change Student password";
    const text = `Dear ${parent.name} `;
    const html = studentOtpTemplate(student.firstName, otp)
    try {
      await this.mailService.sendMail({ to: dto.email, subject, text, html })
    } catch (error) {
      this.logger.error(`Failed to send  email to ${dto.email}`)
      error.stack || error.messag
    }
    return { message: "Otp shared successfully" }
  }
  async sendStudentPassword(dto: StudentGenarteOtpDto) {
    const parent = await this.parentRepo.findByEmail(dto.email);
    if (!parent) throw new NotFoundException("Parent not found");
    const student = await this.studentRepo.findByIdentity(dto.identity);
    if (!student) throw new NotFoundException('Student Not found');
    const tempPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    student.password = hashedPassword
    await this.studentRepo.saveStudent(student)
    const subject = "Student forgot password";
    const text = `Dear ${parent.name} `;
    const html = studentForgotTemplate(student.identity, student.firstName, tempPassword)
    await this.mailService.sendMail({ to: dto.email, subject, text, html })

    return { message: "Temporary password sent to parent's email." };
  }
}

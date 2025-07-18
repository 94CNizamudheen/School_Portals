import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../repositories/interfaces/auth-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository
  ) {}

  async register(email: string, password: string, role: string) {
    return this.authRepository.createUser(email, password, role);
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) return null;

    const match = await this.authRepository.comparePasswords(password, user.password);
    return match ? user : null;
  }

  async generateOtp(email: string) {
    return this.authRepository.createOtp(email);
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.authRepository.findOtp(email, code);
    return !!otp;
  }

  async resetPassword(email: string, newPassword: string) {
    await this.authRepository.updatePassword(email, newPassword);
  }
}

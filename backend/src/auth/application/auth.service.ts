import { Injectable,UnauthorizedException,BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { User } from "../domain/user.schema"; 
import { Otp } from "../domain/otp.schema";
import { RegisterDto, SignInDto, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto, } from '../infrastrucure/dto/auth.dto';

@Injectable()
export class  AuthService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Otp.name) private otpModel: Model<Otp>,
        private jwtService: JwtService
    ){}
    async register(dto:RegisterDto):Promise<{ access_token:string }>{
        const existingUser= await this.userModel.findOne({email:dto.email})
        if(existingUser) throw new BadRequestException('Email already exists')
        
        const hashedPassword= await bcrypt.hash(dto.password,10)
        const user= new this.userModel({
            email:dto.email,
            password:dto.password,
            role:dto.role
        })
        await user.save()
        const payload= {sub:user._id,email:user.email,role:user.role}
        return {access_token:this.jwtService.sign(payload)}
    };


    async signIn(dto:SignInDto): Promise<{access_token:string,userId:string}>{
        console.log(dto)
        const user= await this.userModel.findOne({email:dto.email})
        if(!user|| !(await bcrypt.compare(dto.password,user.password)) ){
             throw new UnauthorizedException("Invalid Credentials")
        }
        const payload= {sub:user._id,email:user.email,role:user.role}
        console.log(user.id)
        return{access_token:this.jwtService.sign(payload),userId:user.id.toString()}
    };

    async sendOtp(email:string): Promise<void>{
        const user= await this.userModel.findOne({email});
        if(!user) throw new UnauthorizedException("User not found");

        const code= Math.floor(100000+Math.random()*900000).toString()
        const expireAt= new Date(Date.now()+10*60*1000);
        const otp= new this.otpModel({email,code,expireAt});
        await otp.save();
        console.log(`otp send to ${email}: ${code}`)
    };

    async verifyOtp(dto:VerifyOtpDto):Promise<boolean>{
        const otp= await this.otpModel.findOne({email:dto.email,code:dto.code});
        if(!otp || otp.expireAt< new Date()) throw new BadRequestException("Invalid Otp or otp expired");

        await this.otpModel.deleteOne({email:dto.email});
        return true;
    }

    async resendOtp(email:string):Promise<void>{
        await this.otpModel.deleteOne({email});
        await this.sendOtp(email);
    }

    async forgetPassword(dto:ForgotPasswordDto):Promise<void>{
        await this.sendOtp(dto.email);
    }

    async resetPassword(dto:ResetPasswordDto):Promise<void>{
        const user= await this.userModel.findOne({email:dto.email});
        if (!user) throw new BadRequestException("user not found");

        const is_validOtp= await this.verifyOtp({email:dto.email,code:dto.otp})
        if(!is_validOtp) throw new BadRequestException("Invalid Otp")
        
        const hashedPassword= await bcrypt.hash(dto.newPassword,10);
        user.password= hashedPassword;
        await user.save();
    }
}
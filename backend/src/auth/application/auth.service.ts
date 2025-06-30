import { Injectable,UnauthorizedException,BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { User } from "../domine/user.schema"; 
import { Otp } from "../domine/otp.schema";
import { RegisterDto, SignInDto, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto, Role } from '../infrastrucure/dto/auth.dto';

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
            name:dto.name,
            email:dto.email,
            mobileNumber:dto.mobileNumber,
            password:dto.password,
            role:dto.role
        })
        await user.save()
        const payload= {sub:user._id,email:user.email,role:user.role}
        return {access_token:this.jwtService.sign(payload)}
    };


    async signIn(dto:SignInDto): Promise<{access_token:string}>{
        const user= await this.userModel.findOne({email:dto.email})
        if(!user|| !(await bcrypt.compare(dto.password,user.password)) ){
             throw new UnauthorizedException("Invalid Credentials")
        }
        const payload= {sub:user._id,email:user.email,role:user.role}
        return{access_token:this.jwtService.sign(payload)}
    };
    async adminCreateUser(dto:RegisterDto): Promise<{}>
}
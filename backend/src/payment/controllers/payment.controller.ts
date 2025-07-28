import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreatePaymentDto } from "../dtos/create.payment.dto";


@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController{
    constructor(private readonly paymentService:PaymentService){}
     
     @Post('admission-payment')
     admissionPayment(@Body()dto:CreatePaymentDto){
        return this.paymentService.createAdmissionPayment(dto)
     }


}
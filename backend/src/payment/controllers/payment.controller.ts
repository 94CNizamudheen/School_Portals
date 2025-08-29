import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('payments')
// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
export class PaymentControllers{
    constructor(private readonly paymentService:PaymentService){}
     
     @Post('admission-payment')
     admissionPayment(@Body()dto:CreatePaymentDto){
        return this.paymentService.createAdmissionPayment(dto)
     }

}

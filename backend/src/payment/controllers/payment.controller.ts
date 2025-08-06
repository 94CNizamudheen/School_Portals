import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentControllers{
    constructor(private readonly paymentService:PaymentService){}
     
     @Post('admission-payment')
     admissionPayment(@Body()dto:CreatePaymentDto){
        return this.paymentService.createAdmissionPayment(dto)
     }

}

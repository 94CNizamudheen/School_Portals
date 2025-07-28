import { CreatePaymentDto } from "src/payment/dtos/create.payment.dto";
import { UpdatePaymentDto } from "src/payment/dtos/update.payment.dto";
import { Payment } from "src/payment/entities/payment.schema";


export interface IPaymentRepository{
    createPayment(dto:CreatePaymentDto):Promise<Payment>;
    fetchPaymentByStudentId(id:string):Promise<Payment|null>;
    updatePayment(dto:UpdatePaymentDto):Promise<Payment|null>;
}
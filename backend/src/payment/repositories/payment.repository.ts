import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { IPaymentRepository } from "./interfaces/payment.interface.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "../entities/payment.schema";
import { Model } from "mongoose";
import { CreatePaymentDto } from "../dtos/create.payment.dto";



@Injectable()
export class PaymentRepository implements IPaymentRepository {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>
    ) { }
    async createPayment(dto: CreatePaymentDto): Promise<Payment> {
        const payment = new this.paymentModel(dto)
        return await payment.save();
    }
    async fetchPaymentByStudentId(id: string): Promise<Payment | null> {
        const payment = this.paymentModel.findOne({ studentId: id }).exec();
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        return payment || null

    }
    async updatePaymentStatus(id: string, status: string): Promise<Payment|null> {
        const payment = this.paymentModel.findOneAndUpdate({ studentId: id }, { status }).exec()
        if (!payment) {
            throw new ForbiddenException('')
        }
        return payment
    }
}
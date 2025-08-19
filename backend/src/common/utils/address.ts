import { Prop, SchemaFactory } from "@nestjs/mongoose";


export class Address {
    @Prop({ required: true })
    addressLine: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
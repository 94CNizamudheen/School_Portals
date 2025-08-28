import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";



@Schema({ timestamps: true })
export class SchoolEvent extends Document {
    @Prop({ required: true }) title: string;
    @Prop({ required: true }) description: string;
    @Prop({ required: true }) date: Date;
    @Prop({ required: true }) endDate: Date;
    @Prop({ required: true }) venue: string;
    @Prop({ required: true }) posterUrl: string; 
};

export const SchoolEventSchema= SchemaFactory.createForClass(SchoolEvent);
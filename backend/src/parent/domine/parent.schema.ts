import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document , Types} from "mongoose";

@Schema()
export class Parent extends Document {
    @Prop({required:true})
     name:string;
    @Prop ({required:true,unique:true})
     email :string
    @Prop({required:true,unique:true})
    mobileNumber:string;
    @Prop()
    occupation:string;
    @Prop([{type:Types.ObjectId,ref:'Student'}])
    studentIds:Types.ObjectId[];
}
export const ParentSchema= SchemaFactory.createForClass(Parent);


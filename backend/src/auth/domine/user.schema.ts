import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
    export class User extends Document{
        @Prop({required:true})
        name: string;
        @Prop({required:true})
        email:string
        @Prop({required:true})
        mobileNumber:string
        @Prop({required:true})
        password:string
        @Prop({required:true,enum:['ADMIN', 'STUDENT', 'TEACHER', 'PARENT']})
        role:string
        // @Prop()
        // parentName?:string
        // @Prop()
        // address?:string
        // @Prop()
        // dob?:Date;
        // @Prop()
        // bloodGroup?:string
        // @Prop()
        // qualification?:string
    }
export const UserSchema= SchemaFactory.createForClass(User)
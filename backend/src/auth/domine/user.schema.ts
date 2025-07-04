import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
    export class User extends Document{

        @Prop({required:true,unique:true})
        email:string
        @Prop({required:true})
        password:string
        @Prop({required:true,enum:['ADMIN', 'STUDENT', 'TEACHER', 'PARENT']})
        role:string
        @Prop({required:true})
        profileId?:string

    }
export const UserSchema= SchemaFactory.createForClass(User)
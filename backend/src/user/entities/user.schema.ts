import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
    export class User extends Document{
        @Prop({required:true}) 
        name:string
        @Prop({required:true,unique:true})
        email:string
        @Prop({required:true})
        password:string
        @Prop({required:true,enum:['ADMIN', 'STUDENT', 'TEACHER', 'PARENT','GUEST']})
        role:string
        @Prop()
        profileId?:string

    }
export const UserSchema= SchemaFactory.createForClass(User)


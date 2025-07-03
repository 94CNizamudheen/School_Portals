import { NestFactory } from "@nestjs/core";
import {AppModule} from './app.module';

async function schoolMgt(){
    const app= await NestFactory.create(AppModule);
    await app.listen(1994)
}
schoolMgt()
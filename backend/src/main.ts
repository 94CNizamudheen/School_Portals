import { NestFactory } from "@nestjs/core";
import {AppModule} from './app.module';
import { AdminService } from "./admin/application/admin.service";
import { NocacheInreceptor } from "./interceptor";

async function bootstrap(){
    const app= await NestFactory.create(AppModule);
    app.enableCors({
        origin:['http://localhost:3000'],
        methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
        allowedHeaders:['content-Type','Authorization'],
        credentials:true
    })
    app.useGlobalInterceptors(new NocacheInreceptor())
    const adminService= app.get(AdminService);
    await adminService.seedSuperAdmin()
    await app.listen(1994)
}
bootstrap()
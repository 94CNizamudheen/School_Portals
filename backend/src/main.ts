import { NestFactory } from "@nestjs/core";
import {AppModule} from './app.module';
import { AdminService } from "./admin/application/admin.service";
import { NocacheInreceptor } from "./interceptor";
const url= process.env.FRONTEND_URL

async function bootstrap(){
    const app= await NestFactory.create(AppModule);
    app.enableCors({
        origin:[`${url}`],
        methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
        allowedHeaders:['Content-Type','Authorization'],
        credentials:true
    })
    app.useGlobalInterceptors(new NocacheInreceptor())
    const adminService= app.get(AdminService);
    await adminService.seedSuperAdmin()
    await app.listen(1994)
}
bootstrap()
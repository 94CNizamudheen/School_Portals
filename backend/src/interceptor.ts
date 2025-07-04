
import { Injectable, NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { Observable } from "rxjs"; 

@Injectable()
export class NocacheInreceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const response=context.switchToHttp().getResponse();
        response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.setHeader('Pragma', 'no-cache');
        response.setHeader('Expires', '0');
        response.setHeader('Surrogate-Control', 'no-store');
        return next.handle()
    }
}
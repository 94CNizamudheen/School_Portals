
import { ConfigService } from "@nestjs/config" 


export const databaseConfig={
    uri:new ConfigService().get<string>('MONGODB_URI')
} 

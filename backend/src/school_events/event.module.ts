import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SchoolEvent, SchoolEventSchema } from "./entities/school.events.schema";
import { SchoolEventController } from "./controllers/events.controller";
import { SchoolEventRepository } from "./repositories/event.repository";
import { SchoolEventService } from "./services/events.service";



@Module({
    imports:[MongooseModule.forFeature([{name:SchoolEvent.name,schema:SchoolEventSchema}])],
    controllers:[SchoolEventController],
    providers:[{provide:'ISchoolEventRepository',useClass:SchoolEventRepository},SchoolEventService],
    exports:['ISchoolEventRepository',SchoolEventService]
})
export class SchoolEventModule{};
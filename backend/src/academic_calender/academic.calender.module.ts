import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AcademicCalendar, AcademicCalendarSchema } from "./entities/academic.calender.schema";
import { AcademicCalendarController } from "./controllers/academic.calender.controller";
import { AcademicCalendarRepository } from "./repositories/academic.calender.repository";
import { AcademicCalendarService } from "./services/academic.calender.service";




@Module({
    imports:[MongooseModule.forFeature([{name:AcademicCalendar.name,schema:AcademicCalendarSchema}])],
    controllers:[AcademicCalendarController],
    providers:[{provide:"IAcademicCalendarRepository",useClass:AcademicCalendarRepository},AcademicCalendarService],
    exports:["IAcademicCalendarRepository",AcademicCalendarService],

})
export class AcademicCalendarModule{}
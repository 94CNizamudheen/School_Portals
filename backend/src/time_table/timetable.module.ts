import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TimetableSlot, TimetableSlotSchema } from "./entities/timetable.schema";
import { TimetableSlotcontroller } from "./controllers/timetable.controller";
import { TimetableSlotService } from "./services/timetable.service";
import { TimetableSlotRepostory } from "./repositories/timetable.repository";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports:[MongooseModule.forFeature([{name:TimetableSlot.name,schema:TimetableSlotSchema}]),AuthModule],
    providers:[TimetableSlotService,{provide:'ITimetableSlotRepostory',useClass:TimetableSlotRepostory}],
    controllers:[TimetableSlotcontroller],
    exports:[TimetableSlotService,'ITimetableSlotRepostory']

})
export class TimetableModule{}
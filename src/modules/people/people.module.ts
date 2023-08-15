import { Module } from "@nestjs/common";
import { PeopleController } from "./people.controller";
import { PeopleService } from "./people.service";
import { HttpModule } from "@nestjs/axios";


@Module({
    imports: [HttpModule],
    controllers: [PeopleController],
    providers: [PeopleService],
  })
  export class PeopleModule {}
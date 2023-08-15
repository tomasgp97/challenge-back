import { Module } from "@nestjs/common";
import { PlanetsService } from "./planets.service";
import { PlanetsController } from "./planets.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [PlanetsController],
    providers: [PlanetsService],
  })
  export class PlanetsModule {}
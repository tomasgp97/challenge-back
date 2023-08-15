import { Module } from "@nestjs/common";
import { StarshipsService } from "./starships.service";
import { StarshipsController } from "./starships.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [StarshipsController],
    providers: [StarshipsService],
  })
  export class StarshipsModule {}
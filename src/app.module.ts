import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration'
import { HttpModule } from '@nestjs/axios';
import { FilmsModule } from './modules/films/films.module';
import { PeopleModule } from './modules/people/people.module';
import { StarshipsModule } from './modules/starships/starships.module';
import { PlanetsModule } from './modules/planets/planets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true}),
    HttpModule,
    FilmsModule,
    PeopleModule,
    StarshipsModule,
    PlanetsModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    ConfigService
  ],
})
export class AppModule {}

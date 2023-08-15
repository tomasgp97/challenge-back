import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { Observable } from "rxjs";
import { FilmsService } from "./films.service";
import { Film } from "./model/films.model";
import { FilmsFilter } from "./dto/films-filter.dto";

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  
  @Get('/all')
  getAll(): Observable<Film[]> {
    return this.filmsService.getAll();
  }
  
  @Get('/urls')
  getByUrls(@Body() body: {urls: string[]}): Observable<Film[]> {
    return this.filmsService.getByUrls(body.urls);
  }
  
  @Get('/:id')
  getOne(@Param('id') id: number):Observable<Film> {
    return this.filmsService.getOne(id);
  }
  
  
  @Get('/:id/info')
  getOneWithFullInfo(@Param('id') id: number, @Body() optionalAttributes: FilmsFilter): Observable<Film> {
      return this.filmsService.getOneWithFullInfo(id, optionalAttributes);
  }
  
}
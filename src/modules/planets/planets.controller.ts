import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { Observable } from "rxjs";
import { PlanetsService } from "./planets.service";
import { Planet } from "./model/planets.model";
import { PlanetsFilter } from "./dto/planets-filter.dto";

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  
  @Get('/all')
  getAll(@Body() body: {totalRecords: number}): Observable<Planet[]> {
    return this.planetsService.getAll(body.totalRecords);
  }
  
  @Get('/urls')
  getByUrls(@Body() body: {urls: string[]}): Observable<Planet[]> {
    return this.planetsService.getByUrls(body.urls);
  }
  
  @Get('/:id')
  getOne(@Param('id') id: number):Observable<Planet> {
    return this.planetsService.getOne(id);
  }
  
  @Get()
getByPage(@Query('page') page: number):Observable<Planet[]> {
  return this.planetsService.getByPage(page);
}
  
  @Get('/:id/info')
  getOneWithFullInfo(@Param('id') id: number, @Body() optionalAttributes: PlanetsFilter): Observable<Planet> {
      return this.planetsService.getOneWithFullInfo(id, optionalAttributes);
  }

}
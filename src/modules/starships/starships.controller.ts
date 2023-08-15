import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { Observable } from "rxjs";
import { StarshipsService } from "./starships.service";
import { Starship } from "./model/starships.model";
import { StarshipsFilter } from "./dto/starships-filter.dto";

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  
  @Get('/all')
  getAll(@Body() body: {totalRecords: number}): Observable<Starship[]> {
    return this.starshipsService.getAll(body.totalRecords);
  }
  
  @Get('/urls')
  getByUrls(@Body() body: {urls: string[]}): Observable<Starship[]> {
    return this.starshipsService.getByUrls(body.urls);
  }
  
  @Get('/:id')
  getOne(@Param('id') id: number):Observable<Starship> {
    return this.starshipsService.getOne(id);
  }
  
  @Get()
getByPage(@Query('page') page: number):Observable<Starship[]> {
  return this.starshipsService.getByPage(page);
}
  
  @Get('/:id/info')
  getOneWithFullInfo(@Param('id') id: number, @Body() optionalAttributes: StarshipsFilter): Observable<Starship> {
      return this.starshipsService.getOneWithFullInfo(id, optionalAttributes);
  }


}
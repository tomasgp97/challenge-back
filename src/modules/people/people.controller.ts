import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { PeopleFilter, PeoplePaginationFilter} from "./dto/people-filter.dto";
import { Observable } from "rxjs";
import { People } from "./model/people.model";

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  
@Get('/all')
getAll(@Body() body: {totalRecords: number}): Observable<People[]> {
  return this.peopleService.getAll(body.totalRecords);
}

@Get()
getByPage(@Query('page') page: number):Observable<People[]> {
  return this.peopleService.getByPage(page);
}

@Get('/urls')
getByUrls(@Body() body: {urls: string[]}): Observable<People[]> {
  
  return this.peopleService.getByUrls(body.urls);
}

@Get('/:id')
getOne(@Param('id') id: number):Observable<People> {
  return this.peopleService.getOne(id);
}


@Get('/:id/info')
getOneWithFullInfo(@Param('id') id: number, @Body() optionalAttributes: PeopleFilter) {
    return this.peopleService.getOneWithFullInfo(id, optionalAttributes);
}

}
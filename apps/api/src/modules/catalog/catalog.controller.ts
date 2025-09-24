import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service.js';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogs: CatalogService) {}

  @Get('trade-types')
  tradeTypes() {
    return this.catalogs.tradeTypes();
  }

  @Get('zones')
  zones() {
    return this.catalogs.zones();
  }

  @Get('units')
  units() {
    return this.catalogs.units();
  }

  @Get('taxes')
  taxes() {
    return this.catalogs.taxes();
  }

  @Get('currencies')
  currencies() {
    return this.catalogs.currencies();
  }
}

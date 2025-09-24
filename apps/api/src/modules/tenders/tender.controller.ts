import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EvaluateTenderDto, CreateTenderDto, PublishTenderDto } from './tender.dto.js';
import { TenderService } from './tender.service.js';

@ApiTags('tenders')
@Controller('tenders')
export class TenderController {
  constructor(private readonly tenders: TenderService) {}

  @Get()
  list(@Query() query: Record<string, string>) {
    return this.tenders.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.tenders.get(id);
  }

  @Post()
  create(@Body() dto: CreateTenderDto) {
    return this.tenders.create(dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string, @Body() dto: PublishTenderDto) {
    return this.tenders.publish(id, dto);
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.tenders.updateStatus(id, 'Cerrada');
  }

  @Post(':id/open')
  open(@Param('id') id: string) {
    return this.tenders.updateStatus(id, 'Publicada');
  }

  @Post(':id/evaluate')
  evaluate(@Param('id') id: string, @Body() dto: EvaluateTenderDto) {
    return this.tenders.evaluate(id, dto);
  }

  @Post(':id/award')
  award(@Param('id') id: string, @Body('vendorId') vendorId: string) {
    return this.tenders.award(id, vendorId);
  }

  @Get(':id/report')
  report(@Param('id') id: string) {
    return this.tenders.report(id);
  }
}

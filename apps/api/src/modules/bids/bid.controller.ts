import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BidService } from './bid.service.js';
import { UpsertBidDto } from './bid.dto.js';

@ApiTags('bids')
@Controller()
export class BidController {
  constructor(private readonly bids: BidService) {}

  @Post('tenders/:id/bids')
  upsert(@Param('id') id: string, @Body() dto: UpsertBidDto) {
    return this.bids.upsert(id, dto);
  }

  @Get('tenders/:id/bids')
  list(@Param('id') id: string) {
    return this.bids.list(id);
  }

  @Get('bids/:id')
  get(@Param('id') id: string) {
    return this.bids.get(id);
  }
}

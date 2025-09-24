import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErpService } from './erp.service.js';

@ApiTags('erp')
@Controller('erp')
export class ErpController {
  constructor(private readonly erp: ErpService) {}

  @Post('connections')
  create(@Body() dto: { tenantId: string; name: string; type: string; config: Record<string, unknown> }) {
    return this.erp.createConnection(dto);
  }

  @Post(':id/push/award')
  pushAward(@Param('id') id: string, @Body() dto: { awardId: string }) {
    return this.erp.pushAward(id, dto.awardId);
  }

  @Post(':id/test')
  test(@Param('id') id: string) {
    return this.erp.test(id);
  }

  @Post('inbound/:id')
  webhook(@Param('id') id: string, @Body() body: unknown) {
    return this.erp.receiveWebhook(id, body);
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { ErpController } from './erp.controller.js';
import { ErpService } from './erp.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ErpController],
  providers: [ErpService]
})
export class ErpModule {}

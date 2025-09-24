import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { TenantController } from './tenant.controller.js';
import { TenantService } from './tenant.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController],
  providers: [TenantService]
})
export class TenantModule {}

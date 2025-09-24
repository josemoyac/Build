import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../shared/prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TenantModule } from './tenants/tenant.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { BudgetModule } from './budgets/budget.module.js';
import { TenderModule } from './tenders/tender.module.js';
import { BidModule } from './bids/bid.module.js';
import { EvaluationModule } from './evaluations/evaluation.module.js';
import { ErpModule } from './erp/erp.module.js';
import { AuditModule } from './audit/audit.module.js';
import configuration from '../shared/config/configuration.js';
import { HealthController } from '../shared/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    TerminusModule,
    PrismaModule,
    AuthModule,
    TenantModule,
    CatalogModule,
    BudgetModule,
    TenderModule,
    BidModule,
    EvaluationModule,
    ErpModule,
    AuditModule
  ],
  controllers: [HealthController]
})
export class AppModule {}

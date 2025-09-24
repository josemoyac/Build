import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { BudgetController } from './budget.controller.js';
import { BudgetService } from './budget.service.js';
import { Bc3Module } from '../../shared/bc3/bc3.module.js';

@Module({
  imports: [PrismaModule, Bc3Module],
  controllers: [BudgetController],
  providers: [BudgetService]
})
export class BudgetModule {}

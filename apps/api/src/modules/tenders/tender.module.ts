import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { EvaluationModule } from '../evaluations/evaluation.module.js';
import { TenderController } from './tender.controller.js';
import { TenderService } from './tender.service.js';

@Module({
  imports: [PrismaModule, EvaluationModule],
  controllers: [TenderController],
  providers: [TenderService],
  exports: [TenderService]
})
export class TenderModule {}

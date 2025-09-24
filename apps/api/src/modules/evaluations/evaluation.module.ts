import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { EvaluationService } from './evaluation.service.js';

@Module({
  imports: [PrismaModule],
  providers: [EvaluationService],
  exports: [EvaluationService]
})
export class EvaluationModule {}

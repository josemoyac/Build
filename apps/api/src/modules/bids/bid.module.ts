import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module.js';
import { BidController } from './bid.controller.js';
import { BidService } from './bid.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [BidController],
  providers: [BidService]
})
export class BidModule {}

import { Module } from '@nestjs/common';
import { Bc3Service } from './bc3.service.js';

@Module({
  providers: [Bc3Service],
  exports: [Bc3Service]
})
export class Bc3Module {}

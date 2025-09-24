import { Injectable } from '@nestjs/common';
import { parseBc3, serializeBc3, BudgetSnapshot } from '@build/bc3';

@Injectable()
export class Bc3Service {
  parse(buffer: Buffer): BudgetSnapshot {
    return parseBc3(buffer.toString('utf-8'));
  }

  serialize(snapshot: BudgetSnapshot): Buffer {
    const content = serializeBc3(snapshot);
    return Buffer.from(content, 'utf-8');
  }
}

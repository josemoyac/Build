import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma/prisma.health.js';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly prisma: PrismaHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prisma.pingCheck('database')]);
  }
}

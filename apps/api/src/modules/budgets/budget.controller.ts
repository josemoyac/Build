import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service.js';
import { CreateBudgetDto } from './budget.dto.js';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgets: BudgetService) {}

  @Get()
  list() {
    return this.budgets.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.budgets.get(id);
  }

  @Post()
  create(@Body() dto: CreateBudgetDto) {
    return this.budgets.create(dto);
  }

  @Post(':id/import/bc3')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  importBc3(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.budgets.importBc3(id, file.buffer);
  }
}

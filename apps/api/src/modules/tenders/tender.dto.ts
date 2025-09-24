import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTenderDto {
  @ApiProperty()
  @IsString()
  tenantId!: string;

  @ApiProperty()
  @IsString()
  companyId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  zone!: string;

  @ApiProperty()
  @IsString()
  tradeType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  budgetId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  openingAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  closingAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class PublishTenderDto {
  @ApiProperty()
  @IsDateString()
  publishedAt!: string;
}

export class EvaluateTenderDto {
  @ApiProperty({ description: 'Criterios y pesos', example: { price: 0.7, plazo: 0.3 } })
  criteria!: Record<string, number>;
}

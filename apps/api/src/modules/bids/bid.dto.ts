import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BidLineDto {
  @ApiProperty()
  @IsString()
  tenderLineId!: string;

  @ApiProperty()
  @IsNumber()
  unitPrice!: number;
}

export class UpsertBidDto {
  @ApiProperty()
  @IsString()
  vendorId!: string;

  @ApiProperty({ type: [BidLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BidLineDto)
  lines!: BidLineDto[];
}

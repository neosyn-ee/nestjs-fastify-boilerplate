
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';

export class ExampleFeatureInsertInputDto {
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}
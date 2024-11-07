import { IsString, IsNotEmpty } from 'class-validator';

export class IsAuthenticatedQueryDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateComplimentRequest {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsString()
  @IsNotEmpty()
  public outerCareWorkerId: string;
}

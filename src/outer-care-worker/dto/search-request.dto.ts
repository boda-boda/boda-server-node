import { IsNumberString } from 'class-validator';

export default class SearchRequest {
  public city?: string;
  public gu?: string;
  public dong?: string;
  public schedule?: string;

  @IsNumberString()
  public from: number;
  @IsNumberString()
  public size: number;

  public capabilities?: string[];
  public religions?: string[];
}

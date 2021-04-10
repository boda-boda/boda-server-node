class Schedule {
  public date: string[];
  public startHour: number;
  public startMinute: number;
  public endHour: number;
  public endMinute: number;
}

export default class SearchRequest {
  public name?: string;
  public city?: string;
  public gu?: string;
  public dong?: string;
  public schedule?: Schedule[];
  public capabilities: string[];
  public religions: string[];
}

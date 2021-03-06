export const CAREER = 'Career';
export const CAPABILITY = 'Capability';
export const PERSONALITY = 'Personality';
export const REGION = 'Region';

export type CareWorkerMetaType = 'Career' | 'Capability' | 'Personality';

export const AvailableCapabilities = [
  '석션',
  '휠체어',
  '기저귀',
  '목욕',
  '재활',
  '청소',
  '음식',
  '남성 수급자',
  '치매교육 이수',
];

export const AvailablePersonality = ['조용', '활발함', '긍정적임', '섬세함', '성실함'];

export interface Active {
  active?: boolean;
}

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const weekDaysKor = ['월', '화', '수', '목', '금', '토', '일'];

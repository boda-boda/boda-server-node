export const CAREER = 'Career';
export const CAPABILITY = 'Capability';
export const PERSONALITY = 'Personality'; // DEPRECATED (2021.03.08 - 성격 정보는 빼달라는 요구사항)
export const REGION = 'Region';
export const RELIGION = 'Religion';

export type CareWorkerMetaType = 'Career' | 'Capability' | 'Religion' | 'Personality';

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

export const RELIGION_LIST = ['기독교', '불교', '천주교', '무교', '기타'];

export const AvailablePersonality = ['조용', '활발함', '긍정적임', '섬세함', '성실함'];

export interface Active {
  active?: boolean;
}

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const weekDaysKor = ['월', '화', '수', '목', '금', '토', '일'];

export const outerCareWorkerScheduleTypes = ['오전', '오후', '종일', ''];

export type MatchingProposalStatus = 'NOT_READ' | 'READ' | 'ACCEPTED' | 'DECLINED';

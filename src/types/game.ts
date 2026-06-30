export type QuestStatus = 'todo' | 'doing' | 'done';
export type QuestRole = 'gameplay' | 'network' | 'both';

export interface Stage {
  id: string;
  name: string;
  enemyName: string;
  enemyMaxHp: number;
  enemyColor: string;
  enemyAvatar: string; // Boss icon/emoji
}

export interface Quest {
  id: string;
  stageId: string;
  role: QuestRole;
  title: string;
  desc: string;
  dmg: number;
  status: QuestStatus;
  assignees: string[];
  icon: string; // Task icon/emoji
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface GameState {
  quests: Quest[];
  members: TeamMember[];
  partyLevel: number;
  partyExp: number;
  stages: Stage[];
  currentStageId: string;
}

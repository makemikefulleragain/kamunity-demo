// Lore Campaign Types
export interface Battle {
  id: string;
  date: Date;
  location: string;
  winner: string;
  loser: string;
  points: number;
  notes: string;
}

export interface Showcase {
  id: string;
  title: string;
  url: string;
  caption: string;
}

export interface Honour {
  id: string;
  title: string;
  awardee: string;
}

export interface Meeting {
  id: string;
  title: string;
  when: Date;
  where: string;
  focus: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
}

export interface ChatMessage {
  who: string;
  text: string;
  at: Date;
}

export interface ImpactTile {
  key: string;
  label: string;
  colour: string;
  value: number;
}

export interface RoomConfig {
  name: string;
  purpose: string;
  emailDomain: string;
  demoMode: boolean;
  impactTiles: ImpactTile[];
  quickActions: Array<{ key: string; label: string }>;
  streams: string[];
  integrations: string[];
}

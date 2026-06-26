export interface CharacterBio {
  id: string;
  name: string;
  alterEgo: string;
  codename: string;
  description: string;
  powers: string[];
  weapons: string[];
  stats: {
    strength: number;
    agility: number;
    intellect: number;
    stamina: number;
    combat: number;
  };
  quote: string;
  color: string;
  bgGlow: string;
  alliance: string;
}

export interface ComicPanelData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageAlt: string;
  soundEffect: string;
  accentColor: string;
  dialogue: string;
}

export interface Ticket {
  id: string;
  city: string;
  theater: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  format: string;
  qrCode: string;
  bookedAt: string;
}

export interface CommMessage {
  id: string;
  sender: "user" | "PETER" | "BRUCE" | "SYSTEM";
  text: string;
  timestamp: Date;
}

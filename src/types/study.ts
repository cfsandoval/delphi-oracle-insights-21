
export interface Study {
  id: string;
  title: {
    es: string;
    en: string;
  };
  methodology: "traditional" | "realtime";
  status: "draft" | "active" | "completed" | "paused";
  category: string;
  experts: number;
  rounds: number;
  currentRound: number;
  consensus: number;
  createdAt: string;
  description: {
    es: string;
    en: string;
  };
}

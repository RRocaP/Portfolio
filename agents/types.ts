export type AssetType = "video" | "image" | "audio" | "shader";
export type Priority = 1 | 2 | 3 | 4 | 5;

export interface AssetBrief {
  section: string;
  currentState: string;
  assetType: AssetType;
  prompt: string;
  dimensions: { w: number; h: number };
  priority: Priority;
  placement: string;
}

export interface GeneratedAsset {
  brief: AssetBrief;
  url: string;
  modelUsed: string;
  fallbackReason?: string;
  localPath: string;
}

export interface QAScore {
  section: string;
  score: number;
  feedback: string;
  pass: boolean;
  screenshotPath: string;
}

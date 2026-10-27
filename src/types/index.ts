export type ToolType = 
  | 'dashboard'
  | 'cartoon'
  | 'image2video'
  | 'translator'
  | 'bgremover'
  | 'adcreator'
  | 'captions'
  | 'nano-banana'
  | 'adobe-studio'
  | 'pinterest'
  | 'vision-studio'
  | 'gallery'
  | 'pricing'
  | 'owner';

export interface OwnerUserRecord {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'suspended';
}

export interface OwnerTransaction {
  id: string;
  user: string;
  planName: string;
  amount: number;
  date: string;
  status: 'succeeded' | 'refunded';
}

export interface PinItem {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  author: string;
  authorAvatar: string;
  board: string;
  likes: number;
  saves: number;
  aspectRatio: string;
  tags: string[];
  resolution?: string;
}

export interface BoardCollection {
  id: string;
  name: string;
  count: number;
  coverUrl: string;
}

export interface VisionAnalysisResult {
  compositionScore: string;
  lightingStyle: string;
  colorPalette: { hex: string; name: string }[];
  detectedSubjects: string[];
  cinematographyAdvice: string;
  reversePrompt: string;
}

export type BillingCycle = 'monthly' | 'bundle';

export interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthly: number;
  monthsCount: number;
  totalPrice: number;
  creditsPerMonth: number | 'Unlimited';
  description: string;
  features: string[];
  buttonText: string;
}

export interface GeneratedAsset {
  id: string;
  title: string;
  tool: ToolType;
  type: 'video' | 'image' | 'audio';
  url: string;
  thumbnail: string;
  createdAt: string;
  prompt?: string;
  aspectRatio?: string;
  style?: string;
  tags?: string[];
  duration?: string;
}

export interface AdScene {
  timestamp: string;
  hook: string;
  visualCue: string;
  audio: string;
  caption: string;
}

export interface AdScript {
  headline: string;
  scenes: AdScene[];
  suggestedVoiceover: string;
  recommendedHooks: string[];
  hashtags: string[];
}

export interface SubtitleChunk {
  id: number;
  start: string;
  end: string;
  text: string;
  highlightWord?: string;
  emoji?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free Trial' | 'Starter Plan' | 'Pro Plan' | 'Ultimate Bundle';
  credits: number;
  maxCredits: number;
  planExpiry: string;
  isSubscribed: boolean;
  isOwner?: boolean;
}

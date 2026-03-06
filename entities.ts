export interface Boquet {
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  flowers: string[];
}

export interface Preferences {
  blockedFlowers: string[];
}

export interface Project {
  _id?: string;
  title: string;
  shortDescription: string;
  description: string;
  creator: string;
  chips: ChipAmount[];
}

export interface ChipAmount {
  amount: number;
  chip: string;
}

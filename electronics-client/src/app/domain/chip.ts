export interface Chip {
  _id?: string;
  code: string;
  name: string;
  pins: string[];
  description?: string;
  datasheet?: string;
  creator: string;
}

import { AFrame } from 'aframe';

export interface RootState {
  objects: any[];
  selectedObjectId: string | null;
  selectedTool: string;
  world: AFrame["AScene"] | {};
}
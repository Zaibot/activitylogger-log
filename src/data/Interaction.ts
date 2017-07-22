export interface IInteraction {
  timelineId: string;
  publicKey: string;
  mode: string;
  startTime: number;
  endTime: number;
  mousepresses: number;
  keypresses: number;
}

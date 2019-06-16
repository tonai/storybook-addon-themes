export interface Api {
  emit(type: string, event: any): void;
  on(type: string, callback: (data: any) => void): void;
  once(type: string, callback: (data: any) => void): void;
  off(type: string, callback: (data: any) => void): void;
  getCurrentStoryData(): any;
};

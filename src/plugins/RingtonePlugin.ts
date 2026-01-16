import { registerPlugin } from '@capacitor/core';

export interface RingtonePlugin {
  /**
   * Set a ringtone from the app's assets
   * @param options - The options for setting the ringtone
   * @returns Promise with result
   */
  setRingtone(options: { 
    fileName: string; 
    title: string;
    artist?: string;
  }): Promise<{ success: boolean; message: string }>;
  
  /**
   * Check if the app has permission to write settings
   * @returns Promise with permission status
   */
  checkPermission(): Promise<{ granted: boolean }>;
  
  /**
   * Request permission to write settings
   * @returns Promise with permission result
   */
  requestPermission(): Promise<{ granted: boolean }>;
  
  /**
   * Check if running on native Android
   * @returns Promise with platform info
   */
  isNativeAndroid(): Promise<{ isNative: boolean }>;
}

const Ringtone = registerPlugin<RingtonePlugin>('Ringtone', {
  web: () => import('./RingtoneWeb').then(m => new m.RingtoneWeb()),
});

export default Ringtone;

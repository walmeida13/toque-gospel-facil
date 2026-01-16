import { WebPlugin } from '@capacitor/core';
import type { RingtonePlugin } from './RingtonePlugin';

export class RingtoneWeb extends WebPlugin implements RingtonePlugin {
  async setRingtone(_options: { 
    fileName: string; 
    title: string;
    artist?: string;
  }): Promise<{ success: boolean; message: string }> {
    // Web doesn't support setting ringtones directly
    return { 
      success: false, 
      message: 'Definir toque automaticamente não é suportado no navegador. Use o wizard manual.' 
    };
  }

  async checkPermission(): Promise<{ granted: boolean }> {
    // Web always returns false as it can't set ringtones
    return { granted: false };
  }

  async requestPermission(): Promise<{ granted: boolean }> {
    // Web can't request this permission
    return { granted: false };
  }

  async isNativeAndroid(): Promise<{ isNative: boolean }> {
    return { isNative: false };
  }
}

import { useState, useEffect, useCallback } from 'react';
import Ringtone from '@/plugins/RingtonePlugin';

interface UseRingtoneReturn {
  isNativeAndroid: boolean;
  hasPermission: boolean | null;
  isLoading: boolean;
  isSettingRingtone: boolean;
  error: string | null;
  success: boolean;
  checkPermission: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
  setRingtone: () => Promise<boolean>;
}

export function useRingtone(): UseRingtoneReturn {
  const [isNativeAndroid, setIsNativeAndroid] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingRingtone, setIsSettingRingtone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { isNative } = await Ringtone.isNativeAndroid();
        setIsNativeAndroid(isNative);
        
        if (isNative) {
          const { granted } = await Ringtone.checkPermission();
          setHasPermission(granted);
        }
      } catch (err) {
        console.log('Ringtone plugin not available (expected on web):', err);
        setIsNativeAndroid(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { granted } = await Ringtone.checkPermission();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      console.error('Error checking permission:', err);
      return false;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const { granted } = await Ringtone.requestPermission();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Permissão necessária para definir o toque automaticamente.');
      }
      
      return granted;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError('Erro ao solicitar permissão.');
      return false;
    }
  }, []);

  const setRingtone = useCallback(async (): Promise<boolean> => {
    try {
      setIsSettingRingtone(true);
      setError(null);
      setSuccess(false);

      // Check permission first
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setIsSettingRingtone(false);
          return false;
        }
      }

      const result = await Ringtone.setRingtone({
        fileName: 'sete-livramentos-toque-oficial.mp3',
        title: 'Os Sete Livramentos',
        artist: 'Toque Gospel'
      });

      if (result.success) {
        setSuccess(true);
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      console.error('Error setting ringtone:', err);
      setError('Erro ao definir o toque. Tente o método manual.');
      return false;
    } finally {
      setIsSettingRingtone(false);
    }
  }, [hasPermission, requestPermission]);

  return {
    isNativeAndroid,
    hasPermission,
    isLoading,
    isSettingRingtone,
    error,
    success,
    checkPermission,
    requestPermission,
    setRingtone
  };
}

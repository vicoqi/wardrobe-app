/**
 * 天气数据 Hook
 * 管理位置权限、获取位置、获取天气数据
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { WeatherData } from '../types';
import { fetchWeatherData, isApiKeyConfigured } from '../services/weatherService';

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  hasLocationPermission: boolean | null;
  refresh: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // 检查并请求位置权限
  const checkAndRequestPermission = async (): Promise<boolean> => {
    try {
      // 检查当前权限状态
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus === 'granted') {
        setHasLocationPermission(true);
        return true;
      }

      // 请求权限
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      const granted = newStatus === 'granted';
      setHasLocationPermission(granted);

      if (!granted) {
        setError('需要位置权限才能获取天气信息');
      }

      return granted;
    } catch (err) {
      console.error('请求位置权限失败:', err);
      setError('请求位置权限失败');
      setHasLocationPermission(false);
      return false;
    }
  };

  // 获取天气数据
  const loadWeather = useCallback(async () => {
    // 检查 API Key 是否配置
    if (!isApiKeyConfigured()) {
      setError('未配置天气 API Key');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 检查权限
      const hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        return;
      }

      // 获取当前位置
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low, // 低精度即可，省电
      });

      const { latitude, longitude } = location.coords;

      // 获取天气数据
      const weatherData = await fetchWeatherData(latitude, longitude);

      if (weatherData) {
        setWeather(weatherData);
      } else {
        setError('获取天气数据失败');
      }
    } catch (err) {
      console.error('加载天气数据失败:', err);
      setError(err instanceof Error ? err.message : '获取天气失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 手动刷新
  const refresh = useCallback(async () => {
    await loadWeather();
  }, [loadWeather]);

  // 手动请求权限
  const requestPermission = useCallback(async (): Promise<boolean> => {
    return await checkAndRequestPermission();
  }, []);

  // 页面聚焦时加载天气数据
  useFocusEffect(
    useCallback(() => {
      // 仅在首次或权限状态变化时加载
      if (hasLocationPermission !== false) {
        loadWeather();
      }
    }, [loadWeather, hasLocationPermission])
  );

  return {
    weather,
    isLoading,
    error,
    hasLocationPermission,
    refresh,
    requestPermission,
  };
};

/**
 * 天气服务
 * 使用和风天气 API 获取天气数据
 * API 文档: https://dev.qweather.com/docs/api/
 */

import { WeatherData, WeatherType } from '../types';
import { getWeatherTypeFromCode } from '../constants/weather';

// 和风天气 API Key - 从环境变量获取
// 用户需要到 https://dev.qweather.com/ 注册并获取免费 API Key
const QWEATHER_API_KEY = process.env.EXPO_PUBLIC_QWEATHER_API_KEY || '';

// API 基础 URL（免费订阅使用 devapi，付费订阅使用 api）
const QWEATHER_BASE_URL = 'https://devapi.qweather.com/v7';

// 位置信息响应
interface QWeatherGeoResponse {
  code: string;
  location: Array<{
    name: string;
    adm2: string; // 上级行政区划
    adm1: string; // 一级行政区划
    country: string;
  }>;
}

// 实时天气响应
interface QWeatherNowResponse {
  code: string;
  now: {
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    pressure: string;
    visibility: string;
    cloud: string;
  };
  updateTime: string;
}

/**
 * 根据经纬度获取位置信息（城市名称）
 */
export const getLocationName = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    // 使用和风天气的城市查询 API
    const url = `${QWEATHER_BASE_URL.replace('/v7', '/v2')}/city/lookup?location=${longitude},${latitude}&key=${QWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data: QWeatherGeoResponse = await response.json();

    if (data.code === '200' && data.location && data.location.length > 0) {
      const location = data.location[0];
      // 返回城市名称，格式：城市名 或 区名,城市名
      if (location.adm2 && location.name !== location.adm2) {
        return `${location.name}, ${location.adm2}`;
      }
      return location.name;
    }

    return '未知位置';
  } catch (error) {
    console.error('获取位置名称失败:', error);
    return '未知位置';
  }
};

/**
 * 获取实时天气数据
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  if (!QWEATHER_API_KEY) {
    console.warn('未配置和风天气 API Key，请设置 EXPO_PUBLIC_QWEATHER_API_KEY 环境变量');
    return null;
  }

  try {
    // 并行获取位置信息和天气数据
    const [locationName, weatherResponse] = await Promise.all([
      getLocationName(latitude, longitude),
      fetch(
        `${QWEATHER_BASE_URL}/weather/now?location=${longitude},${latitude}&key=${QWEATHER_API_KEY}`
      ).then((res) => res.json()),
    ]);

    const weatherData: QWeatherNowResponse = weatherResponse;

    if (weatherData.code !== '200') {
      console.error('天气 API 返回错误:', weatherData.code);
      return null;
    }

    const { now, updateTime } = weatherData;
    const weatherType: WeatherType = getWeatherTypeFromCode(now.icon);

    return {
      temperature: parseInt(now.temp, 10) || 0,
      feelsLike: parseInt(now.feelsLike, 10) || 0,
      weatherType,
      description: now.text,
      location: locationName,
      humidity: parseInt(now.humidity, 10) || 0,
      windSpeed: now.windSpeed,
      windDir: now.windDir,
      pressure: now.pressure,
      visibility: now.visibility,
      updateTime,
    };
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return null;
  }
};

/**
 * 检查 API Key 是否已配置
 */
export const isApiKeyConfigured = (): boolean => {
  return !!QWEATHER_API_KEY;
};

/**
 * 天气相关常量
 */

import { WeatherType } from '../types';

// 天气图标映射
export const WEATHER_ICONS: Record<WeatherType, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  partlyCloudy: '⛅',
  rainy: '🌧️',
  snowy: '🌨️',
  foggy: '🌫️',
  windy: '💨',
  thunderstorm: '⛈️',
  hazy: '🌫️',
  unknown: '🌡️',
};

// 天气类型中文描述
export const WEATHER_DESCRIPTIONS: Record<WeatherType, string> = {
  sunny: '晴',
  cloudy: '阴',
  partlyCloudy: '多云',
  rainy: '雨',
  snowy: '雪',
  foggy: '雾',
  windy: '风',
  thunderstorm: '雷阵雨',
  hazy: '霾',
  unknown: '未知',
};

// 和风天气代码到天气类型的映射
// 参考: https://dev.qweather.com/docs/resource/icons/
export const QWEATHER_CODE_TO_TYPE: Record<string, WeatherType> = {
  // 晴
  '100': 'sunny',
  '150': 'sunny',

  // 多云
  '101': 'partlyCloudy',
  '102': 'partlyCloudy',
  '103': 'partlyCloudy',
  '151': 'partlyCloudy',
  '152': 'partlyCloudy',
  '153': 'partlyCloudy',

  // 阴
  '104': 'cloudy',
  '154': 'cloudy',

  // 雨
  '300': 'rainy',
  '301': 'rainy',
  '302': 'thunderstorm',
  '303': 'thunderstorm',
  '304': 'thunderstorm',
  '305': 'rainy',
  '306': 'rainy',
  '307': 'rainy',
  '308': 'rainy',
  '309': 'rainy',
  '310': 'rainy',
  '311': 'rainy',
  '312': 'rainy',
  '313': 'rainy',
  '314': 'rainy',
  '315': 'rainy',
  '316': 'rainy',
  '317': 'rainy',
  '318': 'rainy',
  '350': 'rainy',
  '351': 'rainy',
  '399': 'rainy',

  // 雪
  '400': 'snowy',
  '401': 'snowy',
  '402': 'snowy',
  '403': 'snowy',
  '404': 'snowy',
  '405': 'snowy',
  '406': 'snowy',
  '407': 'snowy',
  '408': 'snowy',
  '409': 'snowy',
  '410': 'snowy',
  '456': 'snowy',
  '457': 'snowy',
  '499': 'snowy',

  // 雾
  '500': 'foggy',
  '501': 'foggy',
  '502': 'foggy',
  '503': 'foggy',
  '504': 'foggy',
  '507': 'hazy',
  '508': 'hazy',
  '509': 'foggy',
  '510': 'foggy',
  '511': 'foggy',
  '512': 'foggy',
  '513': 'foggy',
  '514': 'foggy',
  '515': 'foggy',
  '599': 'foggy',

  // 风
  '800': 'windy',
  '801': 'windy',
  '802': 'windy',
  '803': 'windy',
  '804': 'windy',
  '805': 'windy',
  '806': 'windy',
  '807': 'windy',
  '899': 'windy',
};

// 根据和风天气代码获取天气类型
export const getWeatherTypeFromCode = (code: string): WeatherType => {
  return QWEATHER_CODE_TO_TYPE[code] || 'unknown';
};

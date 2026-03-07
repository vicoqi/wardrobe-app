/**
 * 季节配置
 */

import { SeasonType } from '../types';

export interface SeasonConfig {
  type: SeasonType;
  label: string;
  icon: string;
}

// 季节配置列表
export const SEASON_CONFIGS: SeasonConfig[] = [
  {
    type: 'spring',
    label: '春',
    icon: '🌸',
  },
  {
    type: 'summer',
    label: '夏',
    icon: '☀️',
  },
  {
    type: 'autumn',
    label: '秋',
    icon: '🍂',
  },
  {
    type: 'winter',
    label: '冬',
    icon: '❄️',
  },
];

// 所有季节类型
export const ALL_SEASONS: SeasonType[] = ['spring', 'summer', 'autumn', 'winter'];

// 根据类型获取季节配置
export const getSeasonConfig = (type: SeasonType): SeasonConfig => {
  return SEASON_CONFIGS.find((config) => config.type === type) || SEASON_CONFIGS[0];
};

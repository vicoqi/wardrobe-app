/**
 * 分类配置
 */

import { CategoryType, CategoryCount } from '../types';
import { COLORS } from './colors';

export interface CategoryConfig {
  type: CategoryType;
  label: string;
  icon: string;
  color: string;
}

// 分类配置列表
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    type: 'tops',
    label: '上衣',
    icon: '👕',
    color: COLORS.categoryTops,
  },
  {
    type: 'pants',
    label: '裤子',
    icon: '👖',
    color: COLORS.categoryPants,
  },
  {
    type: 'skirts',
    label: '裙子',
    icon: '👗',
    color: COLORS.categorySkirts,
  },
  {
    type: 'shoes',
    label: '鞋子',
    icon: '👟',
    color: COLORS.categoryShoes,
  },
  {
    type: 'bags',
    label: '包包',
    icon: '👜',
    color: COLORS.categoryBags,
  },
  {
    type: 'accessories',
    label: '配饰',
    icon: '💍',
    color: COLORS.categoryAccessories,
  },
];

// 首页显示的4个主要分类
export const HOME_CATEGORIES: CategoryType[] = ['tops', 'pants', 'shoes', 'bags'];

// 根据类型获取分类配置
export const getCategoryConfig = (type: CategoryType): CategoryConfig => {
  return CATEGORY_CONFIGS.find((config) => config.type === type) || CATEGORY_CONFIGS[0];
};

// 创建分类统计对象
export const createCategoryCount = (
  type: CategoryType,
  count: number = 0
): CategoryCount => {
  const config = getCategoryConfig(type);
  return {
    category: type,
    count,
    label: config.label,
    icon: config.icon,
  };
};

// 根据类型获取分类图标
export const getCategoryIcon = (type: CategoryType): string => {
  const config = getCategoryConfig(type);
  return config.icon;
};

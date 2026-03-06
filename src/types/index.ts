/**
 * 衣橱管理 App 类型定义
 */

// 衣服分类枚举
export type CategoryType = 'tops' | 'pants' | 'skirts' | 'shoes' | 'bags' | 'accessories';

// 衣服项目
export interface ClothesItem {
  id: number;
  name: string;
  category: CategoryType;
  image_uri: string;
  created_at: number;
  updated_at: number;
}

// 分类统计
export interface CategoryCount {
  category: CategoryType;
  count: number;
  label: string;
  icon: string;
}

// 导航参数类型
export type RootStackParamList = {
  Home: undefined;
  AddClothes: {
    imageUri?: string;
  };
  CategoryDetail: {
    category: CategoryType;
    title: string;
  };
  ClothesDetail: {
    id: number;
  };
};

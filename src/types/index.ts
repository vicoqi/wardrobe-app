/**
 * 衣橱管理 App 类型定义
 */

// 衣服分类枚举
export type CategoryType = 'tops' | 'pants' | 'skirts' | 'shoes' | 'bags' | 'accessories';

// 季节类型
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

// 衣服项目
export interface ClothesItem {
  id: number;
  name: string;
  category: CategoryType;
  image_uri: string;
  season: string; // 逗号分隔的季节
  color: string;
  brand: string;
  price: number | null;
  notes: string; // 备注
  created_at: number;
  updated_at: number;
}

// 添加衣服参数
export interface AddClothesParams {
  imageUri: string;
  category: CategoryType;
  season?: SeasonType[];
  color?: string;
  brand?: string;
  price?: number | null;
  notes?: string;
  name?: string;
}

// 分类统计
export interface CategoryCount {
  category: CategoryType;
  count: number;
  label: string;
  icon: string;
}

// 分类筛选类型（用于浏览页）
export type CategoryFilter = CategoryType | 'all';

// 分页结果类型
export interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
}

// 画布上衣服项的位置信息
export interface CanvasItemPosition {
  clothesId: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

// 搭配方案
export interface Outfit {
  id: number;
  name: string;
  thumbnail: string;
  items: CanvasItemPosition[];
  created_at: number;
  updated_at: number;
}

// 保存搭配参数
export interface SaveOutfitParams {
  name?: string;
  thumbnail: string;
  items: CanvasItemPosition[];
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
  WardrobeBrowse: {
    initialCategory?: CategoryType;
  } | undefined;
  Canvas: undefined;
  OutfitList: undefined;
};

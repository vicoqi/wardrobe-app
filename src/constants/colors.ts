/**
 * 颜色和样式常量
 */

// 主色调
export const COLORS = {
  // 品牌色
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E85555',

  // 背景色
  background: '#FFE5EC',
  surface: '#FFFFFF',

  // 文字色
  textPrimary: '#2D2D2D',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textWhite: '#FFFFFF',

  // 功能色
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // 分类色
  categoryTops: '#FF6B6B',
  categoryPants: '#4ECDC4',
  categorySkirts: '#FFE66D',
  categoryShoes: '#95E1D3',
  categoryBags: '#DDA0DD',
  categoryAccessories: '#F7DC6F',

  // 边框和分割线
  border: '#E0E0E0',
  divider: '#F0F0F0',
} as const;

// 间距
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// 圆角
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// 字体大小
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// 阴影样式
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

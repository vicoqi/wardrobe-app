/**
 * 颜色和样式常量
 */

// 主色调
export const COLORS = {
  // 品牌色 — 柔美玫瑰粉系
  primary: '#F06292',
  primaryLight: '#F8BBD0',
  primaryDark: '#D84878',

  // 背景色
  background: '#FFF0F5',
  surface: '#FFFFFF',

  // 文字色
  textPrimary: '#3D2C2C',
  textSecondary: '#7B6B6B',
  textTertiary: '#A89898',
  textWhite: '#FFFFFF',

  // 功能色
  success: '#81C784',
  warning: '#FFB74D',
  error: '#E57373',
  info: '#90CAF9',

  // 分类色 — 马卡龙柔和色系
  categoryTops: '#F48FB1',    // 玫瑰粉
  categoryPants: '#80CBC4',   // 薄荷绿
  categorySkirts: '#CE93D8',  // 淡紫丁香
  categoryShoes: '#FFAB91',   // 蜜桃橙
  categoryBags: '#B39DDB',    // 薰衣草紫
  categoryAccessories: '#FFF59D', // 柠檬奶黄

  // 边框和分割线
  border: '#F0E0E0',
  divider: '#F8F0F0',
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

/**
 * 画布相关常量
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** 画布宽度 */
export const CANVAS_WIDTH = SCREEN_WIDTH;

/** 头部 + 工具栏的预估高度 */
const TOOLBAR_HEIGHT = 200;

/** 画布高度 */
export const CANVAS_HEIGHT = SCREEN_HEIGHT - TOOLBAR_HEIGHT;

/** 画布上单个衣服项的默认尺寸 */
export const ITEM_SIZE = 120;

/** 最小缩放比例 */
export const MIN_SCALE = 0.5;

/** 最大缩放比例 */
export const MAX_SCALE = 2.5;

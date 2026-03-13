import { CanvasItemPosition } from '../types';

type PartialCanvasItem = Omit<CanvasItemPosition, 'itemId'> & {
  itemId?: number;
};

export const normalizeCanvasItems = (
  items: PartialCanvasItem[]
): CanvasItemPosition[] => {
  let nextItemId =
    items.reduce((maxId, item) => {
      if (typeof item.itemId === 'number' && Number.isFinite(item.itemId)) {
        return Math.max(maxId, item.itemId);
      }
      return maxId;
    }, 0) + 1;

  const withIds = items.map((item) => ({
    ...item,
    itemId:
      typeof item.itemId === 'number' && Number.isFinite(item.itemId)
        ? item.itemId
        : nextItemId++,
  }));

  const sortedByLayer = [...withIds].sort((left, right) => {
    if (left.zIndex !== right.zIndex) {
      return left.zIndex - right.zIndex;
    }
    return left.itemId - right.itemId;
  });

  const normalizedZIndexMap = new Map<number, number>();
  sortedByLayer.forEach((item, index) => {
    normalizedZIndexMap.set(item.itemId, index + 1);
  });

  return withIds.map((item) => ({
    ...item,
    zIndex: normalizedZIndexMap.get(item.itemId) ?? item.zIndex,
  }));
};

export const getNextCanvasItemId = (items: CanvasItemPosition[]): number =>
  items.reduce((maxId, item) => Math.max(maxId, item.itemId), 0) + 1;

export const getNextCanvasZIndex = (items: CanvasItemPosition[]): number =>
  items.reduce((maxZIndex, item) => Math.max(maxZIndex, item.zIndex), 0) + 1;

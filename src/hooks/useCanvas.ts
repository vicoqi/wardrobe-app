/**
 * 画布状态管理 Hook
 */

import { useState, useRef, useCallback } from 'react';
import { CanvasItemPosition, ClothesItem } from '../types';
import { saveOutfit as saveOutfitToDb } from '../database/outfitRepository';
import {
  getNextCanvasItemId,
  getNextCanvasZIndex,
  normalizeCanvasItems,
} from '../utils/canvasItems';

const MAX_HISTORY = 50;

export const useCanvas = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItemPosition[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 历史记录（用于撤销/重做）
  const historyRef = useRef<CanvasItemPosition[][]>([[]]);
  const historyIndexRef = useRef(0);
  const nextItemIdRef = useRef(1);
  const nextZIndexRef = useRef(1);

  /**
   * 保存当前状态到历史记录
   */
  const saveToHistory = useCallback((items: CanvasItemPosition[]) => {
    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;

    // 移除当前位置之后的历史记录（放弃重做栈）
    const newHistory = history.slice(0, currentIndex + 1);

    // 添加新状态
    newHistory.push([...items]);

    // 限制历史记录数量
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    } else {
      historyIndexRef.current++;
    }

    historyRef.current = newHistory;
  }, []);

  /**
   * 添加衣服到画布
   */
  const addItem = useCallback((clothes: ClothesItem) => {
    setCanvasItems((prev) => {
      const newItem: CanvasItemPosition = {
        itemId: nextItemIdRef.current++,
        clothesId: clothes.id,
        x: 100 + Math.random() * 100, // 随机初始位置
        y: 100 + Math.random() * 100,
        scale: 1,
        rotation: 0,
        zIndex: nextZIndexRef.current++,
      };
      const newItems = [...prev, newItem];
      saveToHistory(newItems);
      return newItems;
    });
  }, [saveToHistory]);

  /**
   * 提交位置更新到历史记录（拖拽结束时调用）
   */
  const commitPositionUpdate = useCallback(
    (itemId: number, updates: Partial<CanvasItemPosition>) => {
      setCanvasItems((prev) => {
        const target = prev.find((item) => item.itemId === itemId);
        if (!target) return prev;

        const hasChanged = Object.entries(updates).some(([key, value]) => {
          const typedKey = key as keyof CanvasItemPosition;
          return target[typedKey] !== value;
        });
        if (!hasChanged) return prev;

        const newItems = prev.map((item) =>
          item.itemId === itemId ? { ...item, ...updates } : item
        );
        saveToHistory(newItems);
        return newItems;
      });
    },
    [saveToHistory]
  );

  /**
   * 将选中的衣服提升到最上层
   */
  const bringItemToFront = useCallback((itemId: number) => {
    setCanvasItems((prev) => {
      const target = prev.find((item) => item.itemId === itemId);
      if (!target) return prev;

      const highestZIndex = prev.reduce(
        (maxZIndex, item) => Math.max(maxZIndex, item.zIndex),
        0
      );

      if (target.zIndex === highestZIndex) {
        return prev;
      }

      const newZIndex = highestZIndex + 1;
      nextZIndexRef.current = Math.max(nextZIndexRef.current, newZIndex + 1);

      const newItems = prev.map((item) =>
        item.itemId === itemId ? { ...item, zIndex: newZIndex } : item
      );
      return newItems;
    });
  }, []);

  /**
   * 删除衣服
   */
  const removeItem = useCallback((itemId: number) => {
    setCanvasItems((prev) => {
      const newItems = prev.filter((item) => item.itemId !== itemId);
      saveToHistory(newItems);
      return newItems;
    });
  }, [saveToHistory]);

  /**
   * 清空画布
   */
  const clearCanvas = useCallback(() => {
    setCanvasItems([]);
    saveToHistory([]);
  }, [saveToHistory]);

  /**
   * 撤销
   */
  const undo = useCallback(() => {
    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;

    if (currentIndex > 0) {
      historyIndexRef.current = currentIndex - 1;
      setCanvasItems([...history[currentIndex - 1]]);
    }
  }, []);

  /**
   * 重做
   */
  const redo = useCallback(() => {
    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;

    if (currentIndex < history.length - 1) {
      historyIndexRef.current = currentIndex + 1;
      setCanvasItems([...history[currentIndex + 1]]);
    }
  }, []);

  /**
   * 是否可以撤销
   */
  const canUndo = historyIndexRef.current > 0;

  /**
   * 是否可以重做
   */
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  /**
   * 保存搭配（调用外部截图函数）
   */
  const saveOutfit = useCallback(
    async (thumbnail: string, name?: string): Promise<number> => {
      setIsSaving(true);
      try {
        const id = await saveOutfitToDb({
          name,
          thumbnail,
          items: canvasItems,
        });
        return id;
      } finally {
        setIsSaving(false);
      }
    },
    [canvasItems]
  );

  /**
   * 加载已保存的搭配
   */
  const loadOutfit = useCallback((items: CanvasItemPosition[]) => {
    const normalizedItems = normalizeCanvasItems(items);
    setCanvasItems(normalizedItems);
    historyRef.current = [[]];
    historyIndexRef.current = 0;
    nextItemIdRef.current = getNextCanvasItemId(normalizedItems);
    nextZIndexRef.current = getNextCanvasZIndex(normalizedItems);
    saveToHistory(normalizedItems);
  }, [saveToHistory]);

  return {
    canvasItems,
    isSaving,
    addItem,
    commitPositionUpdate,
    bringItemToFront,
    removeItem,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
    saveOutfit,
    loadOutfit,
  };
};

/**
 * 首页数据 Hook
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ClothesItem, CategoryCount } from '../types';
import {
  getTotalCount,
  getCategoryCounts,
  getRecentItems,
} from '../database/clothesRepository';

interface HomeData {
  totalCount: number;
  categoryCounts: CategoryCount[];
  recentItems: ClothesItem[];
  isLoading: boolean;
  error: string | null;
}

export const useHomeData = (): HomeData & { refresh: () => Promise<void> } => {
  const [totalCount, setTotalCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [recentItems, setRecentItems] = useState<ClothesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 并行加载数据
      const [total, counts, recent] = await Promise.all([
        getTotalCount(),
        getCategoryCounts(),
        getRecentItems(4),
      ]);

      setTotalCount(total);
      setCategoryCounts(counts);
      setRecentItems(recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 每次页面获得焦点时刷新数据
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return {
    totalCount,
    categoryCounts,
    recentItems,
    isLoading,
    error,
    refresh: loadData,
  };
};

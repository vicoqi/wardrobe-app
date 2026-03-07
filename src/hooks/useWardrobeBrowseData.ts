/**
 * 衣橱浏览数据 Hook
 */

import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ClothesItem, CategoryFilter } from '../types';
import { getClothesPaginated } from '../database/clothesRepository';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 10;

interface BrowseDataState {
  clothes: ClothesItem[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  searchKeyword: string;
  selectedCategory: CategoryFilter;
  debouncedSearch: string;
}

interface BrowseDataActions {
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setSearchKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
}

type BrowseData = BrowseDataState & BrowseDataActions;

export const useWardrobeBrowseData = (
  initialCategory?: CategoryFilter
): BrowseData => {
  const [clothes, setClothes] = useState<ClothesItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    initialCategory || 'all'
  );

  // 防抖搜索关键词
  const debouncedSearch = useDebounce(searchKeyword, 300);
  const activeQueryKey = `${selectedCategory}::${debouncedSearch}`;
  const activeQueryKeyRef = useRef(activeQueryKey);
  const dataVersionRef = useRef(0);

  // 始终保存当前查询上下文，供异步响应校验使用
  activeQueryKeyRef.current = activeQueryKey;

  // 加载初始数据
  const loadInitial = useCallback(async () => {
    const requestQueryKey = activeQueryKey;
    const requestVersion = ++dataVersionRef.current;

    try {
      setIsLoading(true);
      const result = await getClothesPaginated({
        page: 0,
        pageSize: PAGE_SIZE,
        category: selectedCategory,
        searchKeyword: debouncedSearch,
      });

      if (
        requestVersion !== dataVersionRef.current ||
        requestQueryKey !== activeQueryKeyRef.current
      ) {
        return;
      }

      setClothes(result.items);
      setPage(0);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load clothes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch, activeQueryKey]);

  // 加载更多
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) {
      return;
    }

    const requestQueryKey = activeQueryKey;
    const requestVersion = dataVersionRef.current;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const result = await getClothesPaginated({
        page: nextPage,
        pageSize: PAGE_SIZE,
        category: selectedCategory,
        searchKeyword: debouncedSearch,
      });

      if (
        requestVersion !== dataVersionRef.current ||
        requestQueryKey !== activeQueryKeyRef.current
      ) {
        return;
      }

      setClothes((prev) => [...prev, ...result.items]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more clothes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    page,
    hasMore,
    isLoadingMore,
    isLoading,
    selectedCategory,
    debouncedSearch,
    activeQueryKey,
  ]);

  // 刷新
  const refresh = useCallback(async () => {
    const requestQueryKey = activeQueryKey;
    const requestVersion = ++dataVersionRef.current;

    try {
      setIsRefreshing(true);
      const result = await getClothesPaginated({
        page: 0,
        pageSize: PAGE_SIZE,
        category: selectedCategory,
        searchKeyword: debouncedSearch,
      });

      if (
        requestVersion !== dataVersionRef.current ||
        requestQueryKey !== activeQueryKeyRef.current
      ) {
        return;
      }

      setClothes(result.items);
      setPage(0);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to refresh clothes:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedCategory, debouncedSearch, activeQueryKey]);

  // 设置分类
  const setCategory = useCallback((category: CategoryFilter) => {
    setSelectedCategory(category);
  }, []);

  // 页面获得焦点，或筛选条件变化时，重新加载第一页
  useFocusEffect(
    useCallback(() => {
      loadInitial();
    }, [loadInitial])
  );

  return {
    clothes,
    page,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    searchKeyword,
    selectedCategory,
    debouncedSearch,
    loadInitial,
    loadMore,
    refresh,
    setSearchKeyword,
    setCategory,
  };
};

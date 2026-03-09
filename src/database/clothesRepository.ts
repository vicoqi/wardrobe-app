/**
 * 衣服数据仓库
 */

import { getDatabase } from './db';
import { ClothesItem, CategoryType, CategoryCount, AddClothesParams, SeasonType, CategoryFilter, PaginatedResult } from '../types';
import { CATEGORY_CONFIGS, createCategoryCount } from '../constants/categories';

/**
 * 获取衣服总数
 */
export const getTotalCount = async (): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM clothes'
  );
  return result?.count ?? 0;
};

/**
 * 获取各分类数量
 */
export const getCategoryCounts = async (): Promise<CategoryCount[]> => {
  const db = await getDatabase();

  // 获取所有分类的计数
  const results = await db.getAllAsync<{ category: CategoryType; count: number }>(
    'SELECT category, COUNT(*) as count FROM clothes GROUP BY category'
  );

  // 创建分类计数的映射
  const countMap = new Map<CategoryType, number>();
  results.forEach((row) => {
    countMap.set(row.category, row.count);
  });

  // 返回所有分类的统计（包括数量为0的分类）
  return CATEGORY_CONFIGS.map((config) =>
    createCategoryCount(config.type, countMap.get(config.type) ?? 0)
  );
};

/**
 * 获取最近添加的衣服
 */
export const getRecentItems = async (limit: number = 4): Promise<ClothesItem[]> => {
  const db = await getDatabase();
  const results = await db.getAllAsync<ClothesItem>(
    'SELECT id, name, category, image_uri, season, color, brand, price, notes, created_at, updated_at FROM clothes ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  return results;
};

/**
 * 添加新衣服
 */
export const addClothes = async (params: AddClothesParams): Promise<number> => {
  const db = await getDatabase();
  const now = Date.now();
  const season = (params.season ?? []).join(',');

  const result = await db.runAsync(
    'INSERT INTO clothes (name, category, image_uri, season, color, brand, price, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      params.name ?? '',
      params.category,
      params.imageUri,
      season,
      params.color?.trim() ?? '',
      params.brand?.trim() ?? '',
      params.price ?? null,
      params.notes ?? '',
      now,
      now,
    ]
  );

  return result.lastInsertRowId;
};

/**
 * 根据ID获取衣服
 */
export const getClothesById = async (id: number): Promise<ClothesItem | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<ClothesItem>(
    'SELECT id, name, category, image_uri, season, color, brand, price, notes, created_at, updated_at FROM clothes WHERE id = ?',
    [id]
  );
  return result ?? null;
};

/**
 * 根据分类获取衣服列表
 */
export const getClothesByCategory = async (
  category: CategoryType
): Promise<ClothesItem[]> => {
  const db = await getDatabase();
  const results = await db.getAllAsync<ClothesItem>(
    'SELECT id, name, category, image_uri, season, color, brand, price, notes, created_at, updated_at FROM clothes WHERE category = ? ORDER BY created_at DESC',
    [category]
  );
  return results;
};

/**
 * 删除衣服
 */
export const deleteClothes = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM clothes WHERE id = ?', [id]);
};

/**
 * 更新衣服信息
 */
export const updateClothes = async (
  id: number,
  updates: {
    name?: string;
    category?: CategoryType;
    season?: SeasonType[];
    color?: string;
    brand?: string;
    price?: number | null;
    notes?: string;
  }
): Promise<void> => {
  const db = await getDatabase();
  const now = Date.now();

  if (updates.name !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET name = ?, updated_at = ? WHERE id = ?',
      [updates.name, now, id]
    );
  }

  if (updates.category !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET category = ?, updated_at = ? WHERE id = ?',
      [updates.category, now, id]
    );
  }

  if (updates.season !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET season = ?, updated_at = ? WHERE id = ?',
      [updates.season.join(','), now, id]
    );
  }

  if (updates.notes !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET notes = ?, updated_at = ? WHERE id = ?',
      [updates.notes, now, id]
    );
  }

  if (updates.color !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET color = ?, updated_at = ? WHERE id = ?',
      [updates.color, now, id]
    );
  }

  if (updates.brand !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET brand = ?, updated_at = ? WHERE id = ?',
      [updates.brand, now, id]
    );
  }

  if (updates.price !== undefined) {
    await db.runAsync(
      'UPDATE clothes SET price = ?, updated_at = ? WHERE id = ?',
      [updates.price, now, id]
    );
  }
};

/**
 * 分页查询衣服
 */
export const getClothesPaginated = async (params: {
  page: number;
  pageSize: number;
  category?: CategoryFilter;
  searchKeyword?: string;
}): Promise<PaginatedResult<ClothesItem>> => {
  const db = await getDatabase();
  const { page, pageSize, category, searchKeyword } = params;

  // 构建查询条件
  const conditions: string[] = ['1=1'];
  const sqlParams: (string | number)[] = [];

  // 分类筛选
  if (category && category !== 'all') {
    conditions.push('category = ?');
    sqlParams.push(category);
  }

  // 搜索关键词（在 name 和 notes 中搜索）
  if (searchKeyword && searchKeyword.trim()) {
    conditions.push('(name LIKE ? OR notes LIKE ? OR color LIKE ? OR brand LIKE ?)');
    const keyword = `%${searchKeyword.trim()}%`;
    sqlParams.push(keyword, keyword, keyword, keyword);
  }

  const whereClause = conditions.join(' AND ');
  const offset = page * pageSize;

  // 查询 pageSize + 1 条数据来判断是否还有更多
  const results = await db.getAllAsync<ClothesItem>(
    `SELECT id, name, category, image_uri, season, color, brand, price, notes, created_at, updated_at
     FROM clothes
     WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...sqlParams, pageSize + 1, offset]
  );

  const hasMore = results.length > pageSize;
  const items = hasMore ? results.slice(0, pageSize) : results;

  return {
    items,
    hasMore,
  };
};

/**
 * 获取所有衣服
 */
export const getAllClothes = async (): Promise<ClothesItem[]> => {
  const db = await getDatabase();
  const results = await db.getAllAsync<ClothesItem>(
    'SELECT id, name, category, image_uri, season, color, brand, price, notes, created_at, updated_at FROM clothes ORDER BY created_at DESC'
  );
  return results;
};

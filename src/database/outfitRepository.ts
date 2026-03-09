/**
 * 搭配方案数据仓库
 */

import { getDatabase } from './db';
import { Outfit, SaveOutfitParams, CanvasItemPosition } from '../types';

interface OutfitRow {
  id: number;
  name: string;
  thumbnail: string;
  items_json: string;
  created_at: number;
  updated_at: number;
}

/**
 * 将数据库行转换为 Outfit 对象
 */
const rowToOutfit = (row: OutfitRow): Outfit => ({
  id: row.id,
  name: row.name,
  thumbnail: row.thumbnail,
  items: JSON.parse(row.items_json) as CanvasItemPosition[],
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/**
 * 获取所有搭配方案
 */
export const getAllOutfits = async (): Promise<Outfit[]> => {
  const db = await getDatabase();
  const results = await db.getAllAsync<OutfitRow>(
    'SELECT id, name, thumbnail, items_json, created_at, updated_at FROM outfits ORDER BY created_at DESC'
  );
  return results.map(rowToOutfit);
};

/**
 * 根据 ID 获取搭配方案
 */
export const getOutfitById = async (id: number): Promise<Outfit | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<OutfitRow>(
    'SELECT id, name, thumbnail, items_json, created_at, updated_at FROM outfits WHERE id = ?',
    [id]
  );
  return result ? rowToOutfit(result) : null;
};

/**
 * 保存搭配方案
 */
export const saveOutfit = async (params: SaveOutfitParams): Promise<number> => {
  const db = await getDatabase();
  const now = Date.now();
  const itemsJson = JSON.stringify(params.items);

  const result = await db.runAsync(
    `INSERT INTO outfits (name, thumbnail, items_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [params.name ?? '', params.thumbnail, itemsJson, now, now]
  );

  return result.lastInsertRowId;
};

/**
 * 更新搭配方案
 */
export const updateOutfit = async (
  id: number,
  params: Partial<SaveOutfitParams>
): Promise<void> => {
  const db = await getDatabase();
  const now = Date.now();

  if (params.name !== undefined) {
    await db.runAsync(
      'UPDATE outfits SET name = ?, updated_at = ? WHERE id = ?',
      [params.name, now, id]
    );
  }

  if (params.thumbnail !== undefined) {
    await db.runAsync(
      'UPDATE outfits SET thumbnail = ?, updated_at = ? WHERE id = ?',
      [params.thumbnail, now, id]
    );
  }

  if (params.items !== undefined) {
    const itemsJson = JSON.stringify(params.items);
    await db.runAsync(
      'UPDATE outfits SET items_json = ?, updated_at = ? WHERE id = ?',
      [itemsJson, now, id]
    );
  }
};

/**
 * 删除搭配方案
 */
export const deleteOutfit = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM outfits WHERE id = ?', [id]);
};

/**
 * 获取搭配方案数量
 */
export const getOutfitCount = async (): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM outfits'
  );
  return result?.count ?? 0;
};

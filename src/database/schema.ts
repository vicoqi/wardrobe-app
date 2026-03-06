/**
 * 数据库表结构
 */

import { getDatabase } from './db';

/**
 * 初始化数据库表
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // 创建衣服表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clothes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      image_uri TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
    CREATE INDEX IF NOT EXISTS idx_clothes_created_at ON clothes(created_at DESC);
  `);
};

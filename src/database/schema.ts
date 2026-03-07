/**
 * 数据库表结构
 */

import { getDatabase } from './db';

/**
 * 迁移数据库 - 添加 season 和 notes 字段
 */
const migrateDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // 检查 season 列是否存在
  const tableInfo = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(clothes)"
  );
  const hasSeason = tableInfo.some(col => col.name === 'season');
  const hasNotes = tableInfo.some(col => col.name === 'notes');

  // 如果没有 season 列，需要重建表
  if (!hasSeason || !hasNotes) {
    await db.execAsync('BEGIN IMMEDIATE TRANSACTION;');
    try {
      // 创建新表
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS clothes_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL,
          image_uri TEXT NOT NULL,
          season TEXT NOT NULL DEFAULT '',
          notes TEXT NOT NULL DEFAULT '',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 复制旧数据（根据现有列决定复制哪些数据）
      if (!hasSeason && !hasNotes) {
        await db.execAsync(`
          INSERT INTO clothes_new (id, name, category, image_uri, season, notes, created_at, updated_at)
          SELECT id, name, category, image_uri, '', '', created_at, updated_at FROM clothes;
        `);
      } else {
        // 部分迁移（未来如果添加新字段时使用）
        await db.execAsync(`
          INSERT INTO clothes_new (id, name, category, image_uri, season, notes, created_at, updated_at)
          SELECT id, name, category, image_uri,
            COALESCE(season, ''),
            COALESCE(notes, ''),
            created_at, updated_at
          FROM clothes;
        `);
      }

      // 删除旧表并原子切换到新表
      await db.execAsync(`DROP TABLE clothes;`);
      await db.execAsync(`ALTER TABLE clothes_new RENAME TO clothes;`);

      // 重建索引
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
        CREATE INDEX IF NOT EXISTS idx_clothes_created_at ON clothes(created_at DESC);
      `);

      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }
};

/**
 * 初始化数据库表
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // 创建衣服表（如果不存在）
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clothes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      image_uri TEXT NOT NULL,
      season TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
    CREATE INDEX IF NOT EXISTS idx_clothes_created_at ON clothes(created_at DESC);
  `);

  // 执行迁移
  await migrateDatabase();
};

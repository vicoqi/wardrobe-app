/**
 * 数据库表结构
 */

import { getDatabase } from './db';

/**
 * 迁移数据库 - 补齐字段并保证数据完整保留
 */
const migrateDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  const requiredColumns = [
    'id',
    'name',
    'category',
    'image_uri',
    'season',
    'color',
    'brand',
    'price',
    'notes',
    'created_at',
    'updated_at',
  ] as const;

  const tableInfo = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(clothes)"
  );
  const existingColumns = new Set(tableInfo.map((col) => col.name));
  const missingColumns = requiredColumns.filter((column) => !existingColumns.has(column));

  if (missingColumns.length === 0) {
    return;
  }

  const hasSeason = existingColumns.has('season');
  const hasColor = existingColumns.has('color');
  const hasBrand = existingColumns.has('brand');
  const hasPrice = existingColumns.has('price');
  const hasNotes = existingColumns.has('notes');

  await db.execAsync('BEGIN IMMEDIATE TRANSACTION;');
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS clothes_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL,
        image_uri TEXT NOT NULL,
        season TEXT NOT NULL DEFAULT '',
        color TEXT NOT NULL DEFAULT '',
        brand TEXT NOT NULL DEFAULT '',
        price REAL,
        notes TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    await db.execAsync(`
      INSERT INTO clothes_new (
        id,
        name,
        category,
        image_uri,
        season,
        color,
        brand,
        price,
        notes,
        created_at,
        updated_at
      )
      SELECT
        id,
        name,
        category,
        image_uri,
        ${hasSeason ? "COALESCE(season, '')" : "''"},
        ${hasColor ? "COALESCE(color, '')" : "''"},
        ${hasBrand ? "COALESCE(brand, '')" : "''"},
        ${hasPrice ? 'price' : 'NULL'},
        ${hasNotes ? "COALESCE(notes, '')" : "''"},
        created_at,
        updated_at
      FROM clothes;
    `);

    await db.execAsync('DROP TABLE clothes;');
    await db.execAsync('ALTER TABLE clothes_new RENAME TO clothes;');

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
      CREATE INDEX IF NOT EXISTS idx_clothes_created_at ON clothes(created_at DESC);
    `);

    await db.execAsync('COMMIT;');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw error;
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
      color TEXT NOT NULL DEFAULT '',
      brand TEXT NOT NULL DEFAULT '',
      price REAL,
      notes TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
    CREATE INDEX IF NOT EXISTS idx_clothes_created_at ON clothes(created_at DESC);

    -- 搭配方案表
    CREATE TABLE IF NOT EXISTS outfits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      thumbnail TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON outfits(created_at DESC);
  `);

  // 执行迁移
  await migrateDatabase();
};

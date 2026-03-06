/**
 * SQLite 数据库连接
 */

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'wardrobe.db';

let database: SQLite.SQLiteDatabase | null = null;

/**
 * 获取数据库实例
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return database;
};

/**
 * 关闭数据库连接
 */
export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.closeAsync();
    database = null;
  }
};

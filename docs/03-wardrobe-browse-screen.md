# 衣橱浏览页需求文档 (WardrobeBrowseScreen)

## 📋 页面概述

**页面名称：** 衣橱浏览页 (WardrobeBrowseScreen)  
**页面路径：** `/wardrobe-browse`  
**访问方式：** 从首页分类入口或搜索进入  
**核心目标：** 快速浏览和查找衣服

---

## 🎯 功能需求

### 1. 顶部导航栏

**功能描述：**
- 返回按钮 "←"
- 标题 "我的衣橱"

**交互逻辑：**
- 点击 "←" → 返回上一页

---

### 2. 搜索栏

**功能描述：**
- 搜索输入框
- 占位符 "搜索衣服..."
- 搜索图标 🔍
- 取消按钮（搜索时显示）

**交互逻辑：**

**输入搜索：**
```
输入文字 → 实时搜索 → 显示结果
```

**取消搜索：**
```
点击取消 → 清空输入 → 显示全部
```

**搜索规则：**
- 实时搜索（防抖 300ms）
- 支持模糊匹配
- 搜索字段：名称、备注
- 支持拼音搜索（可选）

**SQL 查询：**
```sql
SELECT * FROM clothes
WHERE name LIKE '%{keyword}%'
   OR notes LIKE '%{keyword}%'
ORDER BY created_at DESC
```

---

### 3. 分类筛选标签

**功能描述：**
- 横向滚动标签
- 分类：全部 / 上衣 / 裤子 / 裙子 / 鞋子 / 包包 / 配饰
- 单选模式

**标签列表：**
| 标签 | 说明 | SQL 条件 |
|------|------|---------|
| 全部 | 显示所有 | 无筛选 |
| 上衣 | 只显示上衣 | `category = '上衣'` |
| 裤子 | 只显示裤子 | `category = '裤子'` |
| 裙子 | 只显示裙子 | `category = '裙子'` |
| 鞋子 | 只显示鞋子 | `category = '鞋子'` |
| 包包 | 只显示包包 | `category = '包包'` |
| 配饰 | 只显示配饰 | `category = '配饰'` |

**交互逻辑：**
- 默认选中 "全部"
- 点击标签 → 切换选中状态
- 激活状态：珊瑚粉背景 + 白色文字
- 非激活状态：白色背景 + 灰色文字

**数据加载：**
```javascript
useEffect(() => {
  loadClothes(selectedCategory, searchKeyword);
}, [selectedCategory, searchKeyword]);
```

---

### 4. 高级筛选栏（可选）

**功能描述：**
- 三个筛选选项：季节 / 颜色 / 排序
- 图标 + 文字 + 下拉箭头

**筛选选项：**

**季节筛选：**
```
🌸 春 | ☀️ 夏 | 🍂 秋 | ❄️ 冬
```
- 多选模式
- SQL: `WHERE season LIKE '%春%'`

**颜色筛选：**
```
⚪ 白 | ⚫ 黑 | 🔴 红 | 🔵 蓝 | 🟢 绿 | 🟡 黄
```
- 单选模式
- SQL: `WHERE color = '白色'`

**排序选项：**
```
📅 最近添加 | 🔤 名称 | 📊 穿搭次数
```
- 单选模式
- 默认：最近添加

---

### 5. 衣服网格展示区

**功能描述：**
- 2 列网格布局
- 无限滚动（分页加载）
- 每页 20 件

**卡片设计：**
- 正方形图片（1:1）
- 圆角卡片（12px）
- 阴影效果
- 底部显示分类标签

**交互逻辑：**
```
点击卡片 → 跳转到详情页
```

**跳转参数：**
```javascript
{
  clothesId: 123
}
```

---

### 6. 浮动添加按钮（FAB）

**功能描述：**
- 圆形按钮（直径 56px）
- 珊瑚粉背景
- 白色 "+" 图标
- 固定在右下角
- 阴影效果

**交互逻辑：**
```
点击 → 跳转到添加页
```

---

### 7. 空状态

**功能描述：**
- 无衣服时显示
- 提示文字 "还没有衣服，快去添加吧！"
- 引导按钮 "添加第一件衣服"

**交互逻辑：**
```
点击按钮 → 跳转到添加页
```

---

## 🎨 UI 设计

**设计图：**
![衣橱浏览页 UI 设计](wardrobe-browse-ui.png)

**设计要点：**
- 搜索栏醒目
- 分类标签易点击
- 网格布局整齐
- 图片为主展示
- FAB 按钮明显

---

## 📊 数据结构

### 页面状态
```typescript
interface WardrobeBrowseState {
  clothes: Clothes[];           // 衣服列表
  selectedCategory: string;     // 选中分类
  searchKeyword: string;        // 搜索关键词
  filters: {                    // 筛选条件
    seasons: string[];          // 季节
    color: string | null;       // 颜色
    sortBy: string;             // 排序
  };
  page: number;                 // 当前页
  hasMore: boolean;             // 是否有更多
  loading: boolean;             // 加载中
  refreshing: boolean;          // 刷新中
}

interface Clothes {
  id: number;
  imagePath: string;
  category: string;
  season: string;
  color: string;
  name: string;
  createdAt: string;
}
```

---

## 🔄 业务流程

### 数据加载流程
```
1. 页面加载
   ↓
2. 加载第一页数据（20件）
   ↓
3. 显示列表
   ↓
4. 滚动到底部 → 加载下一页
   ↓
5. 重复步骤 4 直到无更多数据
```

### 搜索流程
```
1. 输入关键词
   ↓
2. 防抖 300ms
   ↓
3. 重新加载数据（从第1页开始）
   ↓
4. 显示搜索结果
```

### 筛选流程
```
1. 点击分类标签
   ↓
2. 更新选中分类
   ↓
3. 重新加载数据（从第1页开始）
   ↓
4. 显示筛选结果
```

---

## 🔧 技术要点

### 1. 分页加载
```javascript
const loadClothes = async (page = 1) => {
  if (loading || !hasMore) return;
  
  setLoading(true);
  
  try {
    const offset = (page - 1) * 20;
    const db = await getDBConnection();
    
    let sql = `SELECT * FROM clothes WHERE 1=1`;
    const params = [];
    
    // 分类筛选
    if (selectedCategory !== '全部') {
      sql += ` AND category = ?`;
      params.push(selectedCategory);
    }
    
    // 搜索关键词
    if (searchKeyword) {
      sql += ` AND (name LIKE ? OR notes LIKE ?)`;
      params.push(`%${searchKeyword}%`, `%${searchKeyword}%`);
    }
    
    // 排序
    sql += ` ORDER BY created_at DESC`;
    
    // 分页
    sql += ` LIMIT 20 OFFSET ?`;
    params.push(offset);
    
    const results = await db.executeSql(sql, params);
    const newClothes = results[0].rows.raw();
    
    setClothes(page === 1 ? newClothes : [...clothes, ...newClothes]);
    setHasMore(newClothes.length === 20);
    setPage(page);
    
  } catch (error) {
    console.error('加载失败', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. 搜索防抖
```javascript
import { useEffect, useRef } from 'react';

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

// 使用
const debouncedKeyword = useDebounce(searchKeyword, 300);

useEffect(() => {
  loadClothes(1);
}, [debouncedKeyword, selectedCategory]);
```

### 3. 下拉刷新
```javascript
import { RefreshControl } from 'react-native';

<FlatList
  data={clothes}
  renderItem={renderItem}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#FF6B6B']}
    />
  }
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

### 4. 虚拟列表优化
```javascript
const renderItem = useCallback(({ item }) => {
  return <ClothesCard clothes={item} onPress={handlePress} />;
}, []);

const keyExtractor = useCallback((item) => item.id.toString(), []);

const getItemLayout = useCallback((data, index) => ({
  length: CARD_SIZE,
  offset: CARD_SIZE * index,
  index,
}), []);

<FlatList
  data={clothes}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

---

## ⏱️ 性能优化

### 图片加载优化
- 使用缩略图（200x200）
- 懒加载
- 内存缓存
- 磁盘缓存

### 列表优化
- 虚拟列表（FlatList）
- 分页加载（每页 20 件）
- 懒加载图片
- 避免重新渲染

### 搜索优化
- 防抖处理（300ms）
- 本地搜索（SQLite LIKE）
- 结果缓存

---

## ✅ 验收标准

### 功能验收
- [ ] 搜索功能正常
- [ ] 分类筛选正常
- [ ] 高级筛选正常
- [ ] 分页加载正常
- [ ] 下拉刷新正常
- [ ] 上拉加载更多正常
- [ ] 点击卡片跳转正常
- [ ] FAB 按钮正常
- [ ] 空状态显示正常

### UI 验收
- [ ] 网格布局整齐
- [ ] 图片比例正确
- [ ] 卡片圆角正确
- [ ] 标签滚动流畅
- [ ] FAB 按钮明显
- [ ] 配色符合设计

### 性能验收
- [ ] 首屏加载 < 1秒
- [ ] 搜索响应 < 500ms
- [ ] 滚动流畅（60fps）
- [ ] 内存占用合理
- [ ] 无明显卡顿

---

## 📝 备注

**优先级：** P0（最高）  
**预计工时：** 2天  
**核心功能：** 浏览 + 搜索 + 筛选  
**风险点：** 大量图片加载性能

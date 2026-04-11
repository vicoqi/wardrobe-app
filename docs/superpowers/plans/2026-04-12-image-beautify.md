# 衣物照片美化功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在添加衣物流程中，用户拍照/选图后可一键通过 Gemini API 生成白底商品质感图。

**Architecture:** 新增 `imageBeautifyService` 服务调用 Gemini REST API（参考现有 `weatherService` 模式），新增 `ImageComparison` 切换组件，修改 `AddClothesScreen` 集成美化流程。纯客户端方案，无后端。

**Tech Stack:** React Native, Expo SDK 54, TypeScript, Gemini 2.5 Flash Image API (via REST)

---

### Task 1: 环境配置

**Files:**
- Modify: `.env`
- Modify: `app.json`

- [ ] **Step 1: 添加环境变量到 `.env`**

在 `.env` 文件末尾追加三行：

```
EXPO_PUBLIC_GOOGLE_API_KEY=sbYQiwYts14Zn0HWpFRXMNbX9dq11x1LybxszikpNLlKUQz1
EXPO_PUBLIC_GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
EXPO_PUBLIC_GOOGLE_BASE_URL=https://www.packyapi.com/v1beta
```

- [ ] **Step 2: 提交环境配置**

```bash
git add .env
git commit -m "chore: add Google Gemini API config for image beautify"
```

---

### Task 2: 图片美化服务

**Files:**
- Create: `src/services/imageBeautifyService.ts`

- [ ] **Step 1: 创建 imageBeautifyService.ts**

创建 `src/services/imageBeautifyService.ts`，完整内容如下：

```typescript
/**
 * 图片美化服务
 * 使用 Gemini API (Nano Banana) 将衣物照片背景替换为纯白底
 */

// 从环境变量获取配置
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
const GOOGLE_IMAGE_MODEL = process.env.EXPO_PUBLIC_GOOGLE_IMAGE_MODEL || 'gemini-2.5-flash-image';
const GOOGLE_BASE_URL = process.env.EXPO_PUBLIC_GOOGLE_BASE_URL || '';

// 美化 prompt
const BEAUTIFY_PROMPT = `Remove the background of this clothing item photo and replace it with a clean, pure white background. Keep the clothing item exactly as-is, preserving all details, colors, and textures. The result should look like a professional e-commerce product photo on a white background.`;

// Gemini API 响应中的 inline_data 部分
interface InlineData {
  mime_type: string;
  data: string;
}

interface ResponsePart {
  text?: string;
  inline_data?: InlineData;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: ResponsePart[];
    };
    error?: {
      message: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * 将图片 URI 转为 base64 字符串
 */
const imageUriToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/jpeg;base64,xxxxx → 只取 base64 部分
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Failed to extract base64 from data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 美化衣物照片 — 替换背景为纯白色
 * @param imageUri 本地图片 URI
 * @returns 美化后图片的 data URI，失败返回 null
 */
export const beautifyImage = async (imageUri: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_BASE_URL) {
    console.warn('未配置 Google API，请设置环境变量');
    return null;
  }

  try {
    // 将图片转为 base64
    const base64Image = await imageUriToBase64(imageUri);

    const url = `${GOOGLE_BASE_URL}/models/${GOOGLE_IMAGE_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: BEAUTIFY_PROMPT },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Gemini API HTTP error: ${response.status}`);
      return null;
    }

    const data: GeminiResponse = await response.json();

    // 检查 API 级别错误
    if (data.error) {
      console.error('Gemini API error:', data.error.message);
      return null;
    }

    // 提取生成的图片
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      console.error('Gemini API: no parts in response');
      return null;
    }

    const imagePart = parts.find((p) => p.inline_data?.data);
    if (!imagePart?.inline_data) {
      console.error('Gemini API: no image data in response');
      return null;
    }

    const { mime_type, data: imageData } = imagePart.inline_data;
    return `data:${mime_type};base64,${imageData}`;
  } catch (error) {
    console.error('图片美化失败:', error);
    return null;
  }
};

/**
 * 检查 API 是否已配置
 */
export const isBeautifyConfigured = (): boolean => {
  return !!(GOOGLE_API_KEY && GOOGLE_BASE_URL);
};
```

- [ ] **Step 2: 提交服务代码**

```bash
git add src/services/imageBeautifyService.ts
git commit -m "feat: add image beautify service with Gemini API"
```

---

### Task 3: 图片对比切换组件

**Files:**
- Create: `src/components/add/ImageComparison.tsx`

- [ ] **Step 1: 创建 ImageComparison 组件**

创建 `src/components/add/ImageComparison.tsx`，完整内容如下：

```typescript
/**
 * 图片对比切换组件
 * 显示原图/美化图，通过 tab 切换，当前显示的即为选中保存的图
 */

import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../../constants/colors';

interface ImageComparisonProps {
  /** 原图 URI */
  originalUri: string;
  /** 美化后图片 URI */
  beautifiedUri: string | null;
  /** 是否正在美化 */
  isBeautifying: boolean;
  /** 选中的图片 URI 变化时回调 */
  onSelectedChange: (uri: string) => void;
  /** 点击美化按钮 */
  onBeautifyPress: () => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalUri,
  beautifiedUri,
  isBeautifying,
  onSelectedChange,
  onBeautifyPress,
}) => {
  const [showOriginal, setShowOriginal] = useState(true);

  // 美化完成后自动切换到美化图
  useEffect(() => {
    if (beautifiedUri && showOriginal) {
      setShowOriginal(false);
      onSelectedChange(beautifiedUri);
    }
  }, [beautifiedUri]);

  const displayUri = showOriginal ? originalUri : beautifiedUri!;

  const handleTabPress = (isOriginal: boolean) => {
    setShowOriginal(isOriginal);
    onSelectedChange(isOriginal ? originalUri : beautifiedUri!);
  };

  return (
    <View style={styles.container}>
      {/* 图片显示区 */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: displayUri }} style={styles.image} />
      </View>

      {/* Tab 切换 — 美化完成后才显示 */}
      {beautifiedUri && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, showOriginal && styles.tabActive]}
            onPress={() => handleTabPress(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, showOriginal && styles.tabTextActive]}>
              原图
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !showOriginal && styles.tabActive]}
            onPress={() => handleTabPress(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, !showOriginal && styles.tabTextActive]}>
              美化图
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 美化按钮 */}
      <TouchableOpacity
        style={[
          styles.beautifyButton,
          isBeautifying && styles.beautifyButtonDisabled,
        ]}
        onPress={onBeautifyPress}
        disabled={isBeautifying}
        activeOpacity={0.7}
      >
        {isBeautifying ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.textWhite} />
            <Text style={styles.beautifyButtonText}>美化中...</Text>
          </View>
        ) : (
          <Text style={styles.beautifyButtonText}>
            {beautifiedUri ? '✨ 重新美化' : '✨ 美化背景'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 3,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textWhite,
  },
  beautifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  beautifyButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.8,
  },
  beautifyButtonText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
});
```

- [ ] **Step 2: 提交组件代码**

```bash
git add src/components/add/ImageComparison.tsx
git commit -m "feat: add ImageComparison component for before/after toggle"
```

---

### Task 4: 集成到 AddClothesScreen

**Files:**
- Modify: `src/screens/AddClothesScreen.tsx`

- [ ] **Step 1: 修改 AddClothesScreen — 添加 import 和状态**

在 `AddClothesScreen.tsx` 中：

**新增 import（在现有 import 后追加）：**

```typescript
import { ImageComparison } from '../components/add/ImageComparison';
import { beautifyImage, isBeautifyConfigured } from '../services/imageBeautifyService';
```

**在 `State` interface 中追加两个字段（在 `saving: boolean;` 之后）：**

```typescript
  beautifiedUri: string | null;
  isBeautifying: boolean;
```

**在 `useState` 初始值中追加：**

```typescript
    beautifiedUri: null,
    isBeautifying: false,
```

- [ ] **Step 2: 添加美化处理函数**

在 `handleAlbumPress` 函数之后添加：

```typescript
  // 处理美化
  const handleBeautify = async () => {
    if (!state.imageUri || state.isBeautifying) return;

    setState((prev) => ({ ...prev, isBeautifying: true }));
    try {
      const result = await beautifyImage(state.imageUri);
      if (result) {
        setState((prev) => ({ ...prev, beautifiedUri: result }));
      } else {
        Alert.alert('提示', '美化失败，请检查网络后重试');
      }
    } catch {
      Alert.alert('提示', '美化失败，请稍后再试');
    } finally {
      setState((prev) => ({ ...prev, isBeautifying: false }));
    }
  };

  // 处理选中图片变化
  const handleSelectedChange = (uri: string) => {
    setState((prev) => ({ ...prev, imageUri: uri }));
  };
```

- [ ] **Step 3: 替换 ImagePreview 为 ImageComparison**

在 `render` 方法中，将原来的：

```typescript
        {/* 图片预览 */}
        <ImagePreview
          imageUri={state.imageUri}
          onPlaceholderPress={() => {
            void handleCameraPress();
          }}
        />
```

替换为：

```typescript
        {/* 图片预览 / 美化对比 */}
        {state.imageUri ? (
          <ImageComparison
            originalUri={state.imageUri}
            beautifiedUri={state.beautifiedUri}
            isBeautifying={state.isBeautifying}
            onSelectedChange={handleSelectedChange}
            onBeautifyPress={handleBeautify}
          />
        ) : (
          <ImagePreview
            imageUri={null}
            onPlaceholderPress={() => {
              void handleCameraPress();
            }}
          />
        )}
```

**重要：** `handleBeautify` 需要记住原始图片 URI（拍照时的原图），美化后的图是替换 `beautifiedUri` 而不是 `imageUri`。但 `handleSelectedChange` 会将 `imageUri` 更新为选中的图（原图或美化图）。

这里有个问题：如果 `imageUri` 被更新为美化图后，用户重新美化会基于美化图再美化。需要修复：

**修改 `handleBeautify`：** 始终基于原图美化。在 State 中新增 `originalImageUri` 字段来保存最初的原图。

**修改 State interface 追加：**

```typescript
  originalImageUri: string | null;
```

**修改 useState 初始值追加：**

```typescript
    originalImageUri: route.params?.imageUri ?? null,
```

**修改 `handleCameraPress` 和 `handleAlbumPress`：** 更新 `originalImageUri`。

```typescript
  const handleCameraPress = async () => {
    const uri = await pickImageFromCamera();
    if (uri) {
      setState((prev) => ({ ...prev, imageUri: uri, originalImageUri: uri, beautifiedUri: null }));
    }
  };

  const handleAlbumPress = async () => {
    const uri = await pickImageFromAlbum();
    if (uri) {
      setState((prev) => ({ ...prev, imageUri: uri, originalImageUri: uri, beautifiedUri: null }));
    }
  };
```

**修改 `handleBeautify` 使用原图：**

```typescript
  const handleBeautify = async () => {
    if (!state.originalImageUri || state.isBeautifying) return;

    setState((prev) => ({ ...prev, isBeautifying: true }));
    try {
      const result = await beautifyImage(state.originalImageUri);
      if (result) {
        setState((prev) => ({ ...prev, beautifiedUri: result }));
      } else {
        Alert.alert('提示', '美化失败，请检查网络后重试');
      }
    } catch {
      Alert.alert('提示', '美化失败，请稍后再试');
    } finally {
      setState((prev) => ({ ...prev, isBeautifying: false }));
    }
  };
```

**修改 ImageComparison 的 `originalUri` prop 使用 `originalImageUri`：**

```typescript
          <ImageComparison
            originalUri={state.originalImageUri!}
            beautifiedUri={state.beautifiedUri}
            isBeautifying={state.isBeautifying}
            onSelectedChange={handleSelectedChange}
            onBeautifyPress={handleBeautify}
          />
```

**修改 `handleSelectedChange`：**

```typescript
  const handleSelectedChange = (uri: string) => {
    setState((prev) => ({ ...prev, imageUri: uri }));
  };
```

**修改 `useLayoutEffect` 依赖数组**，追加新的状态字段：

```typescript
  }, [navigation, state.saving, state.imageUri, state.name, state.category, state.seasons, state.color, state.brand, state.price, state.notes, state.originalImageUri, state.beautifiedUri, state.isBeautifying]);
```

- [ ] **Step 4: 移除不再需要的 import**

由于 `ImagePreview` 仍在无图时使用（placeholder 场景），保留该 import。

- [ ] **Step 5: 提交集成代码**

```bash
git add src/screens/AddClothesScreen.tsx
git commit -m "feat: integrate image beautify into AddClothesScreen"
```

---

### Task 5: 启动验证

- [ ] **Step 1: 启动 Expo 开发服务器**

```bash
npx expo start
```

- [ ] **Step 2: 手动验证完整流程**

在模拟器或真机上测试：
1. 进入添加衣物页面 → 显示 placeholder
2. 拍照或选择图片 → 显示原图 + "美化背景"按钮
3. 点击"美化背景" → 按钮变为 loading
4. 美化完成 → 自动切换到美化图，显示 tab（原图/美化图）
5. 切换 tab → 图片随之切换，`imageUri` 更新
6. 点击"重新美化" → 再次基于原图调用 API
7. 不美化直接填信息保存 → 正常保存原图
8. 选中美化图后保存 → 保存美化后的图片

- [ ] **Step 3: 最终提交**

确认功能正常后：

```bash
git log --oneline -5  # 确认所有提交都在
```

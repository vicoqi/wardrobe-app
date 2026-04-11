# 衣物照片美化功能设计

## 概述

在添加衣物流程中，用户拍照/选图后可一键生成白底商品质感图，通过 Nano Banana（Gemini 2.5 Flash Image）实现背景替换。

## 技术方案

### 方案选型

直接调用 Gemini REST API，与现有 `weatherService.ts` 模式一致，不引入新依赖或后端服务。

### 环境配置

`.env` 新增三个变量：

```
GOOGLE_API_KEY=<用户密钥>
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
GOOGLE_BASE_URL=https://www.packyapi.com/v1beta
```

`app.json` 的 `extra` 字段中暴露给运行时，与现有 `QWEATHER_KEY` 并列。

### API 调用

**端点：**
```
POST ${GOOGLE_BASE_URL}/models/${GOOGLE_IMAGE_MODEL}:generateContent?key=${GOOGLE_API_KEY}
```

**请求体：**
```json
{
  "contents": [{
    "parts": [
      { "text": "Remove the background of this clothing item photo and replace it with a clean, pure white background. Keep the clothing item exactly as-is, preserving all details, colors, and textures. The result should look like a professional e-commerce product photo on a white background." },
      { "inline_data": { "mime_type": "image/jpeg", "data": "<base64>" } }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["IMAGE"]
  }
}
```

**错误处理：**
- 网络失败 → 提示"美化失败，请检查网络"
- API 限流 → 提示"稍后再试"
- 返回无图片 → 降级使用原图

## UI 设计

### 交互流程

1. 用户拍照或从相册选择图片 → 图片预览区显示原图
2. 图片预览区下方出现**「美化背景」**按钮
3. 点击后按钮变为 loading 状态（spinner + "美化中..."），调用 API
4. 成功后展示**切换式对比**：一张大图占满宽度，下方两个 chip/tab 切换「原图」/「美化图」
5. 当前显示的图即为最终选中保存的图
6. 不点美化按钮直接填信息保存，不影响原有流程

### 新增状态

- `beautifiedUri`: 美化后的图片 URI（`null` = 未美化）
- `selectedUri`: 当前选中的图片 URI（默认原图）
- `isBeautifying`: loading 状态

## 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/services/imageBeautifyService.ts` | Gemini API 调用服务 |
| 新增 | `src/components/add/ImageComparison.tsx` | 原图/美化图切换组件 |
| 修改 | `src/screens/AddClothesScreen.tsx` | 集成美化按钮和对比组件 |
| 修改 | `.env` | 新增 GOOGLE_API_KEY、GOOGLE_IMAGE_MODEL、GOOGLE_BASE_URL |
| 修改 | `app.json` | extra 中暴露新配置项 |

### 不动的部分

数据库 schema、导航、其他所有页面、现有图片存储逻辑。

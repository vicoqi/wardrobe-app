# Wardrobe App

React Native + Expo 衣橱管理应用。

## 本地开发

### 环境要求

- Node.js 18+
- iOS: Xcode + CocoaPods（如需模拟器）
- Android: Android Studio + Android SDK（如需模拟器）
- Expo Go App（真机调试）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 默认启动
npx expo start

# 指定平台
npx expo start --ios        # iOS 模拟器
npx expo start --android    # Android 模拟器

# 隧道模式（手机和电脑不在同一网络时使用）
npx expo start --tunnel
```

### 真机调试

1. 手机安装 Expo Go App
2. 启动开发服务器后扫描终端中的二维码
3. 若提示网络错误，使用隧道模式：`npx expo start --tunnel`

### TypeScript 检查

```bash
npx tsc --noEmit
```

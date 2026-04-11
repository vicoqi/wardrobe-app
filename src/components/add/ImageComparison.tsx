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

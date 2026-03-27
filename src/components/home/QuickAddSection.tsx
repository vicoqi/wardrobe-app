/**
 * 快速添加区组件 — 柔美胶囊按钮 + 立体图标
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';

interface QuickAddSectionProps {
  onAddPress: () => void;
  onCameraPress: () => void;
  onAlbumPress: () => void;
}

export const QuickAddSection: React.FC<QuickAddSectionProps> = ({
  onAddPress,
  onCameraPress,
  onAlbumPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 主添加按钮 */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={onAddPress}
        activeOpacity={0.85}
      >
        <View style={styles.mainButtonIconWrap}>
          <Text style={styles.mainButtonIcon}>✨</Text>
        </View>
        <Text style={styles.mainButtonText}>添加新衣服</Text>
      </TouchableOpacity>

      {/* 快捷入口 */}
      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={onCameraPress}
          activeOpacity={0.7}
        >
          <View style={styles.quickIconWrap}>
            <Text style={styles.quickButtonIcon}>📸</Text>
          </View>
          <Text style={styles.quickButtonText}>拍照</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={onAlbumPress}
          activeOpacity={0.7}
        >
          <View style={styles.quickIconWrap}>
            <Text style={styles.quickButtonIcon}>🖼️</Text>
          </View>
          <Text style={styles.quickButtonText}>相册</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  mainButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
  },
  mainButtonIconWrap: {
    marginRight: SPACING.xs,
  },
  mainButtonIcon: {
    fontSize: 18,
  },
  mainButtonText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.small,
  },
  quickIconWrap: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginRight: SPACING.xs,
  },
  quickButtonIcon: {
    fontSize: 18,
  },
  quickButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

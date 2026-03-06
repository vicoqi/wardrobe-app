/**
 * 快速添加区组件
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
        activeOpacity={0.8}
      >
        <Text style={styles.mainButtonText}>+ 添加新衣服</Text>
      </TouchableOpacity>

      {/* 快捷入口 */}
      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={onCameraPress}
          activeOpacity={0.7}
        >
          <Text style={styles.quickButtonIcon}>📷</Text>
          <Text style={styles.quickButtonText}>拍照</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={onAlbumPress}
          activeOpacity={0.7}
        >
          <Text style={styles.quickButtonIcon}>🖼️</Text>
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
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.medium,
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.small,
  },
  quickButtonIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  quickButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});

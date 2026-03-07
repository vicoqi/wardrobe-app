/**
 * 空状态组件
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';

interface EmptyBrowseStateProps {
  hasFilters: boolean;
  onAddPress: () => void;
}

export const EmptyBrowseState: React.FC<EmptyBrowseStateProps> = ({
  hasFilters,
  onAddPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{hasFilters ? '🔍' : '👗'}</Text>
      <Text style={styles.title}>
        {hasFilters ? '没有找到匹配的衣服' : '还没有衣服'}
      </Text>
      <Text style={styles.subtitle}>
        {hasFilters
          ? '试试其他搜索词或筛选条件'
          : '快去添加你的第一件衣服吧！'}
      </Text>
      {!hasFilters && (
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>添加衣服</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl + SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.small,
  },
  addButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
});

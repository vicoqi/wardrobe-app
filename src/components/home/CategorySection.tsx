/**
 * 分类入口区组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryType, CategoryCount } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { getCategoryConfig, HOME_CATEGORIES } from '../../constants/categories';

interface CategorySectionProps {
  categoryCounts: CategoryCount[];
  onCategoryPress: (category: CategoryType) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryCounts,
  onCategoryPress,
}) => {
  // 获取首页显示的分类
  const homeCategories = HOME_CATEGORIES.map((type) => {
    const count = categoryCounts.find((c) => c.category === type);
    return {
      type,
      config: getCategoryConfig(type),
      count: count?.count ?? 0,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>分类浏览</Text>
      <View style={styles.grid}>
        {homeCategories.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[styles.card, { borderLeftColor: item.config.color }]}
            onPress={() => onCategoryPress(item.type)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{item.config.icon}</Text>
            <Text style={styles.cardLabel}>{item.config.label}</Text>
            <Text style={styles.cardCount}>{item.count} 件</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  cardLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  cardCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
});

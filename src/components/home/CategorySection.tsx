/**
 * 分类入口区组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CategoryType, CategoryCount } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { CATEGORY_CONFIGS } from '../../constants/categories';

interface CategorySectionProps {
  categoryCounts: CategoryCount[];
  onCategoryPress: (category: CategoryType) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryCounts,
  onCategoryPress,
}) => {
  const allCategories = CATEGORY_CONFIGS.map((config) => {
    const count = categoryCounts.find((item) => item.category === config.type);
    return { ...config, count: count?.count ?? 0 };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>分类浏览</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {allCategories.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => onCategoryPress(item.type)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardCount}>{item.count} 件</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  horizontalList: {
    paddingRight: SPACING.sm,
  },
  card: {
    width: 120,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    marginRight: SPACING.md,
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

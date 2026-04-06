/**
 * 分类入口区组件 — 3D 立体图标 + 柔美配色
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
      <View style={styles.titleRow}>
        <View style={styles.titleBar} />
        <Text style={styles.sectionTitle}>分类浏览</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {allCategories.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[styles.card, { backgroundColor: item.lightColor }]}
            onPress={() => onCategoryPress(item.type)}
            activeOpacity={0.7}
          >
            {/* 3D 立体图标容器 */}
            <View style={[styles.iconContainer, { shadowColor: item.color }]}>
              <View style={[styles.iconBg, { backgroundColor: item.color }]}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
            </View>
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
    paddingVertical: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  titleBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  horizontalList: {
    paddingHorizontal: SPACING.lg,
    paddingRight: SPACING.sm,
  },
  card: {
    width: 100,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  iconContainer: {
    marginBottom: SPACING.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 24,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  cardCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

/**
 * 分类选择器组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryType } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { CATEGORY_CONFIGS } from '../../constants/categories';

interface CategorySelectorProps {
  selected: CategoryType | null;
  onSelect: (category: CategoryType) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>选择分类 *</Text>
      <View style={styles.grid}>
        {CATEGORY_CONFIGS.map((config) => {
          const isSelected = selected === config.type;
          return (
            <TouchableOpacity
              key={config.type}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
              ]}
              onPress={() => onSelect(config.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{config.icon}</Text>
              <Text style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  item: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  itemSelected: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

/**
 * 分类筛选标签组件
 */

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { CategoryFilter } from '../../types';
import { CATEGORY_CONFIGS } from '../../constants/categories';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';

interface CategoryFilterTagsProps {
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
}

// 筛选标签列表：全部 + 各分类
const FILTER_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  ...CATEGORY_CONFIGS.map((config) => ({
    value: config.type,
    label: `${config.icon} ${config.label}`,
  })),
];

export const CategoryFilterTags: React.FC<CategoryFilterTagsProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.tag,
                isSelected && styles.tagSelected,
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tagText,
                  isSelected && styles.tagTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  tag: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  tagSelected: {
    backgroundColor: COLORS.primary,
  },
  tagText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: COLORS.textWhite,
  },
});

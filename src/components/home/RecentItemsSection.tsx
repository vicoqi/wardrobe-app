/**
 * 最近添加区组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ClothesItem } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { getCategoryConfig } from '../../constants/categories';

interface RecentItemsSectionProps {
  items: ClothesItem[];
  onItemPress: (item: ClothesItem) => void;
}

export const RecentItemsSection: React.FC<RecentItemsSectionProps> = ({
  items,
  onItemPress,
}) => {
  const hasItems = items.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>最近添加</Text>

      {hasItems ? (
        <View style={styles.grid}>
          {items.map((item) => {
            const categoryConfig = getCategoryConfig(item.category);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => onItemPress(item)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.image_uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.overlay}>
                  <Text style={styles.categoryIcon}>{categoryConfig.icon}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👗</Text>
          <Text style={styles.emptyText}>还没有衣服</Text>
          <Text style={styles.emptyHint}>点击上方按钮添加你的第一件衣服吧</Text>
        </View>
      )}
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
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.divider,
    borderRadius: BORDER_RADIUS.lg,
  },
  overlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BORDER_RADIUS.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptyHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
});

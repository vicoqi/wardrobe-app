/**
 * 顶部标题区组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/colors';

interface HeaderSectionProps {
  totalCount: number;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ totalCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的衣橱</Text>
      <Text style={styles.subtitle}>
        共 <Text style={styles.count}>{totalCount}</Text> 件衣服
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  count: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

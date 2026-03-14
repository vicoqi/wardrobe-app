/**
 * 顶部标题区组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/colors';

interface HeaderSectionProps {
  totalCount: number;
  onMenuPress: () => void;
  userName?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  totalCount,
  onMenuPress,
  userName = '我'
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.md }]}>
      {/* 头像按钮 */}
      <TouchableOpacity style={styles.headerRow} onPress={onMenuPress}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.title}>{userName}的衣橱</Text>
      </TouchableOpacity>

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
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
    marginLeft: 44 + SPACING.md,
  },
  count: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

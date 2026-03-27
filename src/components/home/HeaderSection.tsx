/**
 * 顶部标题区组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/colors';

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
      <TouchableOpacity style={styles.headerRow} onPress={onMenuPress} activeOpacity={0.7}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>💃</Text>
          </View>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{userName}的衣橱</Text>
          <Text style={styles.subtitle}>
            共 <Text style={styles.count}>{totalCount}</Text> 件衣服 ✨
          </Text>
        </View>
      </TouchableOpacity>
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
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
    borderWidth: 2,
    borderColor: 'rgba(240,98,146,0.3)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
  },
  textWrap: {
    marginLeft: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  count: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

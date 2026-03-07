/**
 * 衣服卡片组件
 */

import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { ClothesItem } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { getCategoryConfig } from '../../constants/categories';

interface ClothesCardProps {
  item: ClothesItem;
  onPress: (item: ClothesItem) => void;
}

export const ClothesCard: React.FC<ClothesCardProps> = ({ item, onPress }) => {
  const categoryConfig = getCategoryConfig(item.category);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
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
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.sm / 2,
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
});

/**
 * 衣服选择器中的单件衣服
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';
import { ClothesItem } from '../../types';
import { getCategoryIcon } from '../../constants/categories';

interface ClothesPickerItemProps {
  clothes: ClothesItem;
  onPress: () => void;
}

export const ClothesPickerItem: React.FC<ClothesPickerItemProps> = ({
  clothes,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: clothes.image_uri }} style={styles.image} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {clothes.name || getCategoryIcon(clothes.category)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    padding: SPACING.xs,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

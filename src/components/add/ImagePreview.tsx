/**
 * 图片预览组件
 */

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/colors';

interface ImagePreviewProps {
  imageUri: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUri }) => {
  if (imageUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderIcon}>📷</Text>
      <Text style={styles.placeholderText}>点击下方按钮添加图片</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});

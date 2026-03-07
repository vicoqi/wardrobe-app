/**
 * 操作按钮组件（拍照/相册）
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';

interface ActionButtonsProps {
  onCameraPress: () => void;
  onAlbumPress: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCameraPress,
  onAlbumPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onCameraPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>📸</Text>
        <Text style={styles.label}>拍照</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onAlbumPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>🖼️</Text>
        <Text style={styles.label}>相册</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});

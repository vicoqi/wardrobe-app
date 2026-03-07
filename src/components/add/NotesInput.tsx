/**
 * 备注输入组件
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';

interface NotesInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const MAX_LENGTH = 200;

export const NotesInput: React.FC<NotesInputProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>备注（可选）</Text>
        <Text style={styles.counter}>{value.length}/{MAX_LENGTH}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="添加备注信息..."
        placeholderTextColor={COLORS.textTertiary}
        multiline
        numberOfLines={3}
        maxLength={MAX_LENGTH}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  counter: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
  },
});

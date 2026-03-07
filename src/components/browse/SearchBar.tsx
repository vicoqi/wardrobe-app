/**
 * 搜索栏组件
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onCancel,
}) => {
  const hasValue = value.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchInputWrapper}>
        <View style={styles.searchIconWrapper}>
          <View style={styles.searchIcon} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="搜索衣服..."
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      {hasValue && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <View style={styles.cancelText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    paddingLeft: SPACING.md,
    height: 40,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  searchIconWrapper: {
    marginRight: SPACING.sm,
  },
  searchIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.textTertiary,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  cancelButton: {
    marginLeft: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  cancelText: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.textTertiary,
  },
});

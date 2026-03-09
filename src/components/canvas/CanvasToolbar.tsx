/**
 * 画布工具栏
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';

interface CanvasToolbarProps {
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasItems: boolean;
  isSaving: boolean;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAdd,
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo,
  hasItems,
  isSaving,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + SPACING.sm }]}>
      <View style={styles.toolbar}>
        {/* 撤销 */}
        <TouchableOpacity
          style={[styles.button, !canUndo && styles.buttonDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={[styles.buttonIcon, !canUndo && styles.buttonIconDisabled]}>
            ↩️
          </Text>
          <Text style={[styles.buttonText, !canUndo && styles.buttonTextDisabled]}>
            撤销
          </Text>
        </TouchableOpacity>

        {/* 重做 */}
        <TouchableOpacity
          style={[styles.button, !canRedo && styles.buttonDisabled]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Text style={[styles.buttonIcon, !canRedo && styles.buttonIconDisabled]}>
            ↪️
          </Text>
          <Text style={[styles.buttonText, !canRedo && styles.buttonTextDisabled]}>
            重做
          </Text>
        </TouchableOpacity>

        {/* 清空 */}
        <TouchableOpacity
          style={[styles.button, !hasItems && styles.buttonDisabled]}
          onPress={onClear}
          disabled={!hasItems}
        >
          <Text style={[styles.buttonIcon, !hasItems && styles.buttonIconDisabled]}>
            🗑️
          </Text>
          <Text style={[styles.buttonText, !hasItems && styles.buttonTextDisabled]}>
            清空
          </Text>
        </TouchableOpacity>

        {/* 添加 */}
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>添加</Text>
        </TouchableOpacity>

        {/* 保存 */}
        <TouchableOpacity
          style={[styles.saveButton, (!hasItems || isSaving) && styles.buttonDisabled]}
          onPress={onSave}
          disabled={!hasItems || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={COLORS.textWhite} />
          ) : (
            <>
              <Text style={styles.saveButtonIcon}>💾</Text>
              <Text style={styles.saveButtonText}>保存</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  button: {
    alignItems: 'center',
    padding: SPACING.xs,
    minWidth: 50,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonIconDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  buttonTextDisabled: {
    color: COLORS.textTertiary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  addButtonIcon: {
    fontSize: 18,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  addButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textWhite,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  saveButtonIcon: {
    fontSize: 14,
  },
  saveButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textWhite,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});

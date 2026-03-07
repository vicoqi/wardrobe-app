/**
 * 季节选择器组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SeasonType } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';
import { SEASON_CONFIGS } from '../../constants/seasons';

interface SeasonSelectorProps {
  selected: SeasonType[];
  onToggle: (season: SeasonType) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  selected,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>适合季节（可选）</Text>
      <View style={styles.row}>
        {SEASON_CONFIGS.map((config) => {
          const isSelected = selected.includes(config.type);
          return (
            <TouchableOpacity
              key={config.type}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
              ]}
              onPress={() => onToggle(config.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{config.icon}</Text>
              <Text style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemSelected: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

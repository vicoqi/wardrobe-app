/**
 * 天气卡片组件
 * 显示当前天气信息，帮助用户选择合适的穿搭
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WeatherData } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/colors';
import { WEATHER_ICONS } from '../../constants/weather';

interface WeatherSectionProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export const WeatherSection: React.FC<WeatherSectionProps> = ({
  weather,
  isLoading,
  error,
  onRefresh,
}) => {
  // 加载状态
  if (isLoading && !weather) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>获取天气中...</Text>
        </View>
      </View>
    );
  }

  // 错误状态
  if (error && !weather) {
    return (
      <TouchableOpacity style={styles.container} onPress={onRefresh} activeOpacity={0.7}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>点击重试</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 无数据状态
  if (!weather) {
    return null;
  }

  const weatherIcon = WEATHER_ICONS[weather.weatherType] || WEATHER_ICONS.unknown;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onRefresh}
      activeOpacity={0.8}
    >
      <View style={styles.mainRow}>
        {/* 天气图标和温度 */}
        <View style={styles.leftSection}>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{weather.temperature}</Text>
            <Text style={styles.tempUnit}>°C</Text>
          </View>
        </View>

        {/* 天气详情 */}
        <View style={styles.rightSection}>
          <Text style={styles.description}>{weather.description}</Text>
          <Text style={styles.location}>{weather.location}</Text>

          {/* 详细信息行 */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>湿度</Text>
              <Text style={styles.detailValue}>{weather.humidity}%</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>风速</Text>
              <Text style={styles.detailValue}>{weather.windSpeed}km/h</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>风向</Text>
              <Text style={styles.detailValue}>{weather.windDir}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 刷新提示 */}
      {isLoading && (
        <View style={styles.refreshingIndicator}>
          <ActivityIndicator size="small" color={COLORS.textTertiary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  retryText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  weatherIcon: {
    fontSize: 40,
    marginRight: SPACING.sm,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tempUnit: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  rightSection: {
    flex: 1,
  },
  description: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  detailValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.divider,
  },
  refreshingIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
});

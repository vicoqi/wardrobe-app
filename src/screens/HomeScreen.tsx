/**
 * 首页主组件
 */

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList, CategoryType, ClothesItem } from '../types';
import { COLORS, SPACING } from '../constants/colors';
import { getCategoryConfig } from '../constants/categories';
import { HeaderSection } from '../components/home/HeaderSection';
import { QuickAddSection } from '../components/home/QuickAddSection';
import { CategorySection } from '../components/home/CategorySection';
import { RecentItemsSection } from '../components/home/RecentItemsSection';
import { useHomeData } from '../hooks/useHomeData';
import { pickImageFromCamera, pickImageFromAlbum } from '../utils/imageUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { totalCount, categoryCounts, recentItems, isLoading, error } = useHomeData();

  // 添加新衣服
  const handleAddPress = () => {
    navigation.navigate('AddClothes', {});
  };

  // 拍照
  const handleCameraPress = async () => {
    const imageUri = await pickImageFromCamera();
    if (imageUri) {
      navigation.navigate('AddClothes', { imageUri });
    }
  };

  // 从相册选择
  const handleAlbumPress = async () => {
    const imageUri = await pickImageFromAlbum();
    if (imageUri) {
      navigation.navigate('AddClothes', { imageUri });
    }
  };

  // 点击分类
  const handleCategoryPress = (category: CategoryType) => {
    const config = getCategoryConfig(category);
    navigation.navigate('CategoryDetail', {
      category,
      title: config.label,
    });
  };

  // 点击衣服详情
  const handleItemPress = (item: ClothesItem) => {
    navigation.navigate('ClothesDetail', { id: item.id });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 顶部标题区 */}
      <HeaderSection totalCount={totalCount} />

      {/* 快速添加区 */}
      <QuickAddSection
        onAddPress={handleAddPress}
        onCameraPress={handleCameraPress}
        onAlbumPress={handleAlbumPress}
      />

      {/* 分类入口区 */}
      <CategorySection
        categoryCounts={categoryCounts}
        onCategoryPress={handleCategoryPress}
      />

      {/* 最近添加区 */}
      <RecentItemsSection items={recentItems} onItemPress={handleItemPress} />

      {/* 底部留白 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

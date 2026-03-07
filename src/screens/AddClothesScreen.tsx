/**
 * 添加衣服页面
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, CategoryType, SeasonType } from '../types';
import { COLORS, SPACING } from '../constants/colors';
import { addClothes } from '../database/clothesRepository';
import { pickImageFromCamera, pickImageFromAlbum } from '../utils/imageUtils';

import { ImagePreview } from '../components/add/ImagePreview';
import { ActionButtons } from '../components/add/ActionButtons';
import { CategorySelector } from '../components/add/CategorySelector';
import { SeasonSelector } from '../components/add/SeasonSelector';
import { NotesInput } from '../components/add/NotesInput';
import { TouchableOpacity, Text } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddClothes'>;
type AddClothesRouteProp = RouteProp<RootStackParamList, 'AddClothes'>;

interface State {
  imageUri: string | null;
  category: CategoryType | null;
  seasons: SeasonType[];
  notes: string;
  saving: boolean;
}

export const AddClothesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddClothesRouteProp>();

  const [state, setState] = useState<State>({
    imageUri: route.params?.imageUri ?? null,
    category: null,
    seasons: [],
    notes: '',
    saving: false,
  });

  // 处理拍照
  const handleCameraPress = async () => {
    const uri = await pickImageFromCamera();
    if (uri) {
      setState((prev) => ({ ...prev, imageUri: uri }));
    }
  };

  // 处理相册选择
  const handleAlbumPress = async () => {
    const uri = await pickImageFromAlbum();
    if (uri) {
      setState((prev) => ({ ...prev, imageUri: uri }));
    }
  };

  // 处理分类选择
  const handleCategorySelect = (category: CategoryType) => {
    setState((prev) => ({ ...prev, category }));
  };

  // 处理季节切换
  const handleSeasonToggle = (season: SeasonType) => {
    setState((prev) => {
      const seasons = prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season];
      return { ...prev, seasons };
    });
  };

  // 处理备注变更
  const handleNotesChange = (notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!state.imageUri) {
      Alert.alert('提示', '请先添加图片');
      return false;
    }
    if (!state.category) {
      Alert.alert('提示', '请选择分类');
      return false;
    }
    return true;
  };

  // 保存衣服
  const handleSave = async () => {
    if (!validateForm()) return;

    setState((prev) => ({ ...prev, saving: true }));

    try {
      await addClothes({
        imageUri: state.imageUri!,
        category: state.category!,
        season: state.seasons.length > 0 ? state.seasons : undefined,
        notes: state.notes || undefined,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
      console.error('Failed to save clothes:', error);
    } finally {
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 图片预览 */}
        <ImagePreview imageUri={state.imageUri} />

        {/* 操作按钮 */}
        <View style={styles.section}>
          <ActionButtons
            onCameraPress={handleCameraPress}
            onAlbumPress={handleAlbumPress}
          />
        </View>

        {/* 分类选择 */}
        <View style={styles.section}>
          <CategorySelector
            selected={state.category}
            onSelect={handleCategorySelect}
          />
        </View>

        {/* 季节选择 */}
        <View style={styles.section}>
          <SeasonSelector
            selected={state.seasons}
            onToggle={handleSeasonToggle}
          />
        </View>

        {/* 备注 */}
        <View style={styles.section}>
          <NotesInput
            value={state.notes}
            onChangeText={handleNotesChange}
          />
        </View>

        {/* 底部占位 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 保存按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            state.saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={state.saving}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>
            {state.saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  section: {
    marginTop: SPACING.lg,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});

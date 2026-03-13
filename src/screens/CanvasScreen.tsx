/**
 * 灵感画布页面
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { captureRef } from 'react-native-view-shot';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/colors';
import { RootStackParamList, ClothesItem } from '../types';
import { useCanvas } from '../hooks/useCanvas';
import { Canvas } from '../components/canvas/Canvas';
import { CanvasToolbar } from '../components/canvas/CanvasToolbar';
import { ClothesPicker } from '../components/canvas/ClothesPicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Canvas'>;

export const CanvasScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const canvasRef = useRef<View>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  const {
    canvasItems,
    isSaving,
    addItem,
    commitPositionUpdate,
    bringItemToFront,
    removeItem,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
    saveOutfit,
  } = useCanvas();

  const handleAdd = () => {
    setPickerVisible(true);
  };

  const handleSelectClothes = (clothes: ClothesItem) => {
    addItem(clothes);
  };

  const handleClear = () => {
    if (canvasItems.length === 0) return;
    Alert.alert(
      '清空画布',
      '确定要清空画布吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清空',
          style: 'destructive',
          onPress: () => clearCanvas(),
        },
      ]
    );
  };

  const handleSave = async () => {
    if (canvasItems.length === 0) return;
    setSaveModalVisible(true);
  };

  const confirmSave = async () => {
    try {
      // 截图
      const thumbnail = await captureRef(canvasRef, {
        format: 'png',
        quality: 0.8,
        result: 'data-uri',
      });

      // 保存到数据库
      await saveOutfit(thumbnail, outfitName || undefined);

      Alert.alert('保存成功', '搭配方案已保存', [
        {
          text: '好的',
          onPress: () => {
            setSaveModalVisible(false);
            setOutfitName('');
            clearCanvas();
            navigation.navigate('OutfitList');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('保存失败', '请稍后重试');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 画布区域 */}
      <Canvas
        canvasRef={canvasRef}
        items={canvasItems}
        onCommitUpdate={commitPositionUpdate}
        onSelectItem={bringItemToFront}
        onRemoveItem={removeItem}
      />

      {/* 工具栏 */}
      <CanvasToolbar
        onAdd={handleAdd}
        onUndo={undo}
        onRedo={redo}
        onClear={handleClear}
        onSave={handleSave}
        canUndo={canUndo}
        canRedo={canRedo}
        hasItems={canvasItems.length > 0}
        isSaving={isSaving}
      />

      {/* 衣服选择器 */}
      <ClothesPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleSelectClothes}
      />

      {/* 保存命名弹窗 */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.nameModalOverlay}
          activeOpacity={1}
          onPress={() => setSaveModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.nameModal}
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.nameModalTitle}>保存搭配</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="给搭配起个名字（可选）"
              value={outfitName}
              onChangeText={setOutfitName}
              autoFocus
            />
            <View style={styles.nameModalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setSaveModalVisible(false);
                  setOutfitName('');
                }}
              >
                <Text style={styles.cancelButton}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSave}>
                <Text style={styles.confirmButton}>保存</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  nameModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameModal: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '80%',
  },
  nameModalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  nameModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.lg,
    gap: SPACING.lg,
  },
  cancelButton: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  confirmButton: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

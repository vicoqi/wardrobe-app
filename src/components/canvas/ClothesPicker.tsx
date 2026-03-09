/**
 * 衣服选择器组件
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';
import { ClothesItem } from '../../types';
import { getAllClothes } from '../../database/clothesRepository';
import { ClothesPickerItem } from './ClothesPickerItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

interface ClothesPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (clothes: ClothesItem) => void;
}

export const ClothesPicker: React.FC<ClothesPickerProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();
  const [clothes, setClothes] = React.useState<ClothesItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (visible) {
      loadClothes();
    }
  }, [visible]);

  const loadClothes = async () => {
    setLoading(true);
    try {
      const results = await getAllClothes();
      setClothes(results);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: ClothesItem) => {
    onSelect(item);
    onClose();
  };

  const renderItem = ({ item }: { item: ClothesItem }) => (
    <ClothesPickerItem clothes={item} onPress={() => handleSelect(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👗</Text>
      <Text style={styles.emptyText}>衣橱空空如也</Text>
      <Text style={styles.emptySubtext}>先添加一些衣服吧</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.modalContent,
            { paddingBottom: insets.bottom + SPACING.md },
          ]}
        >
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>选择衣服</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>关闭</Text>
            </TouchableOpacity>
          </View>

          {/* 列表 */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={clothes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              numColumns={3}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmpty}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    height: MODAL_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeButton: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
});

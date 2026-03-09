/**
 * 主画布容器组件
 */

import React from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { CanvasItemPosition, ClothesItem } from '../../types';
import { getClothesById } from '../../database/clothesRepository';
import { CanvasItem } from './CanvasItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_HEIGHT = SCREEN_HEIGHT - 200; // 减去头部和工具栏高度

interface CanvasProps {
  canvasRef: React.RefObject<View | null>;
  items: CanvasItemPosition[];
  onCommitUpdate: (clothesId: number, updates: Partial<CanvasItemPosition>) => void;
  onRemoveItem: (clothesId: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  items,
  onCommitUpdate,
  onRemoveItem,
}) => {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [clothesMap, setClothesMap] = React.useState<Map<number, ClothesItem>>(
    new Map()
  );

  // 加载衣服信息
  React.useEffect(() => {
    const loadClothes = async () => {
      const map = new Map<number, ClothesItem>();
      for (const item of items) {
        if (!map.has(item.clothesId)) {
          const clothes = await getClothesById(item.clothesId);
          if (clothes) {
            map.set(item.clothesId, clothes);
          }
        }
      }
      setClothesMap(map);
    };
    loadClothes();
  }, [items]);

  // 长按删除
  const handleLongPress = (clothesId: number) => {
    Alert.alert(
      '删除衣服',
      '确定要从画布中移除这件衣服吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onRemoveItem(clothesId),
        },
      ]
    );
  };

  return (
    <View
      ref={canvasRef}
      style={styles.container}
      collapsable={false}
      onTouchStart={() => setSelectedId(null)}
    >
      {items.map((item) => {
        const clothes = clothesMap.get(item.clothesId);
        if (!clothes) return null;

        return (
          <CanvasItem
            key={`${item.clothesId}-${item.zIndex}`}
            item={item}
            imageUri={clothes.image_uri}
            onCommitUpdate={onCommitUpdate}
            onSelect={setSelectedId}
            onLongPress={handleLongPress}
            isSelected={selectedId === item.clothesId}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#FAFAFA',
  },
});

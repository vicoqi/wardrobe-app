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
  onCommitUpdate: (itemId: number, updates: Partial<CanvasItemPosition>) => void;
  onSelectItem: (itemId: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  items,
  onCommitUpdate,
  onSelectItem,
  onRemoveItem,
}) => {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [clothesMap, setClothesMap] = React.useState<Map<number, ClothesItem>>(
    new Map()
  );
  const loadRequestIdRef = React.useRef(0);
  const clothesIds = React.useMemo(
    () => Array.from(new Set(items.map((item) => item.clothesId))),
    [items]
  );
  const clothesIdsKey = React.useMemo(
    () => clothesIds.join(','),
    [clothesIds]
  );

  // 加载衣服信息
  React.useEffect(() => {
    if (selectedId !== null && !items.some((item) => item.itemId === selectedId)) {
      setSelectedId(null);
    }
  }, [items, selectedId]);

  React.useEffect(() => {
    if (clothesIds.length === 0) {
      setClothesMap(new Map());
      return;
    }

    const requestId = ++loadRequestIdRef.current;
    let cancelled = false;

    const loadClothes = async () => {
      try {
        const entries = await Promise.all(
          clothesIds.map(async (clothesId) => {
            const clothes = await getClothesById(clothesId);
            return [clothesId, clothes] as const;
          })
        );

        if (cancelled || requestId !== loadRequestIdRef.current) {
          return;
        }

        const map = new Map<number, ClothesItem>();
        entries.forEach(([clothesId, clothes]) => {
          if (clothes) {
            map.set(clothesId, clothes);
          }
        });
        setClothesMap(map);
      } catch (error) {
        if (!cancelled) {
          console.warn('Failed to load canvas clothes:', error);
        }
      }
    };

    void loadClothes();

    return () => {
      cancelled = true;
    };
  }, [clothesIdsKey]);

  // 长按删除
  const handleSelect = (itemId: number) => {
    setSelectedId(itemId);
    onSelectItem(itemId);
  };

  const handleLongPress = (itemId: number) => {
    setSelectedId(itemId);
    Alert.alert(
      '删除衣服',
      '确定要从画布中移除这件衣服吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onRemoveItem(itemId),
        },
      ]
    );
  };

  return (
    <View
      ref={canvasRef}
      style={styles.container}
      collapsable={false}
    >
      {items.map((item) => {
        const clothes = clothesMap.get(item.clothesId);
        if (!clothes) return null;

        return (
          <CanvasItem
            key={item.itemId.toString()}
            item={item}
            imageUri={clothes.image_uri}
            onCommitUpdate={onCommitUpdate}
            onSelect={handleSelect}
            onLongPress={handleLongPress}
            isSelected={selectedId === item.itemId}
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

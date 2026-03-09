/**
 * 画布上可拖拽/缩放的衣服项
 */

import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CanvasItemPosition } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH;
const CANVAS_HEIGHT = SCREEN_HEIGHT - 200; // 减去头部和工具栏高度

const ITEM_SIZE = 120;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

interface CanvasItemProps {
  item: CanvasItemPosition;
  imageUri: string;
  onCommitUpdate: (clothesId: number, updates: Partial<CanvasItemPosition>) => void;
  onSelect: (clothesId: number) => void;
  onLongPress: (clothesId: number) => void;
  isSelected: boolean;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({
  item,
  imageUri,
  onCommitUpdate,
  onSelect,
  onLongPress,
  isSelected,
}) => {
  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);
  const scale = useSharedValue(item.scale);
  const rotation = useSharedValue(item.rotation);
  const savedTranslateX = useSharedValue(item.x);
  const savedTranslateY = useSharedValue(item.y);
  const savedScale = useSharedValue(item.scale);
  const savedRotation = useSharedValue(item.rotation);

  // 更新共享值（当外部 item 变化时）
  React.useEffect(() => {
    translateX.value = item.x;
    translateY.value = item.y;
    scale.value = item.scale;
    rotation.value = item.rotation;
    savedTranslateX.value = item.x;
    savedTranslateY.value = item.y;
    savedScale.value = item.scale;
    savedRotation.value = item.rotation;
  }, [item.x, item.y, item.scale, item.rotation]);

  // 拖拽手势
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)(item.clothesId);
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // 边界限制
      const boundedX = Math.max(-ITEM_SIZE / 2, Math.min(CANVAS_WIDTH - ITEM_SIZE / 2, translateX.value));
      const boundedY = Math.max(-ITEM_SIZE / 2, Math.min(CANVAS_HEIGHT - ITEM_SIZE / 2, translateY.value));

      translateX.value = boundedX;
      translateY.value = boundedY;
      savedTranslateX.value = boundedX;
      savedTranslateY.value = boundedY;

      runOnJS(onCommitUpdate)(item.clothesId, {
        x: boundedX,
        y: boundedY,
      });
    });

  // 缩放手势
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      runOnJS(onSelect)(item.clothesId);
    })
    .onUpdate((e) => {
      const newScale = Math.min(
        Math.max(savedScale.value * e.scale, MIN_SCALE),
        MAX_SCALE
      );
      scale.value = newScale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(onCommitUpdate)(item.clothesId, { scale: scale.value });
    });

  // 旋转手势
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      runOnJS(onSelect)(item.clothesId);
    })
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      runOnJS(onCommitUpdate)(item.clothesId, { rotation: rotation.value });
    });

  // 长按删除
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(onSelect)(item.clothesId);
      runOnJS(onLongPress)(item.clothesId);
    });

  // 组合手势：拖拽 + 缩放 + 旋转同时进行
  const transformGesture = Gesture.Simultaneous(
    dragGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture)
  );
  const composedGesture = Gesture.Race(longPressGesture, transformGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(scale.value, { damping: 20, stiffness: 200 }) },
      { rotateZ: `${rotation.value}rad` },
    ],
    zIndex: item.zIndex,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          isSelected && styles.selectedContainer,
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

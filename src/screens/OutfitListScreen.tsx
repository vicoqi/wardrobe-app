/**
 * 搭配列表页面
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/colors';
import { RootStackParamList, Outfit } from '../types';
import { getAllOutfits, deleteOutfit } from '../database/outfitRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'OutfitList'>;

export const OutfitListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOutfits = useCallback(async () => {
    try {
      const results = await getAllOutfits();
      setOutfits(results);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOutfits();
  }, [loadOutfits]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOutfits();
  };

  const handleDelete = (outfit: Outfit) => {
    Alert.alert(
      '删除搭配',
      `确定要删除"${outfit.name || '未命名搭配'}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await deleteOutfit(outfit.id);
            loadOutfits();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: Outfit }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // TODO: Navigate to outfit detail
      }}
      onLongPress={() => handleDelete(item)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name || '未命名搭配'}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        <Text style={styles.cardItemCount}>
          {item.items.length} 件衣服
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎨</Text>
      <Text style={styles.emptyText}>还没有搭配方案</Text>
      <Text style={styles.emptySubtext}>去灵感画布创建你的第一个 OOTD 吧</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Canvas')}
      >
        <Text style={styles.emptyButtonText}>开始创作</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  card: {
    flex: 1 / 2,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.background,
  },
  cardInfo: {
    padding: SPACING.sm,
  },
  cardName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  cardItemCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  emptyButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
});

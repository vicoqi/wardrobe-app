/**
 * 衣橱浏览页面
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ClothesItem } from '../types';
import { COLORS } from '../constants/colors';
import { useWardrobeBrowseData } from '../hooks/useWardrobeBrowseData';
import { SearchBar } from '../components/browse/SearchBar';
import { CategoryFilterTags } from '../components/browse/CategoryFilterTags';
import { ClothesCard } from '../components/browse/ClothesCard';
import { EmptyBrowseState } from '../components/browse/EmptyBrowseState';
import { FloatingAddButton } from '../components/browse/FloatingAddButton';

type Props = NativeStackScreenProps<RootStackParamList, 'WardrobeBrowse'>;

export const WardrobeBrowseScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialCategory = route.params?.initialCategory;
  const {
    clothes,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    searchKeyword,
    selectedCategory,
    loadMore,
    refresh,
    setSearchKeyword,
    setCategory,
  } = useWardrobeBrowseData(initialCategory);

  const handleItemPress = useCallback(
    (item: ClothesItem) => {
      navigation.navigate('ClothesDetail', { id: item.id });
    },
    [navigation]
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate('AddClothes', {});
  }, [navigation]);

  const handleCancelSearch = useCallback(() => {
    setSearchKeyword('');
  }, [setSearchKeyword]);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMore();
    }
  }, [isLoadingMore, hasMore, loadMore]);

  const hasFilters = searchKeyword.length > 0 || selectedCategory !== 'all';

  const renderItem = useCallback(
    ({ item }: { item: ClothesItem }) => (
      <ClothesCard item={item} onPress={handleItemPress} />
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback(
    (item: ClothesItem) => item.id.toString(),
    []
  );

  const ListFooterComponent = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }
    return null;
  }, [isLoadingMore]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <EmptyBrowseState hasFilters={hasFilters} onAddPress={handleAddPress} />
    );
  }, [isLoading, hasFilters, handleAddPress]);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        onCancel={handleCancelSearch}
      />
      <CategoryFilterTags selected={selectedCategory} onSelect={setCategory} />

      <FlatList
        data={clothes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />

      <FloatingAddButton onPress={handleAddPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 100,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'flex-start',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

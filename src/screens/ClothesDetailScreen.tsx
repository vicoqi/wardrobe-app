/**
 * 衣服详情页面
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList, ClothesItem, CategoryType, SeasonType } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../constants/colors';
import { CATEGORY_CONFIGS, getCategoryConfig } from '../constants/categories';
import { SEASON_CONFIGS, getSeasonConfig } from '../constants/seasons';
import { deleteClothes, getClothesById, updateClothes } from '../database/clothesRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'ClothesDetail'>;

interface EditState {
  name: string;
  category: CategoryType;
  seasons: SeasonType[];
  color: string;
  brand: string;
  priceInput: string;
  notes: string;
}

const IMAGE_HEIGHT = Math.floor(Dimensions.get('window').height * 0.4);

const ALL_SEASON_TYPES: SeasonType[] = ['spring', 'summer', 'autumn', 'winter'];

const isSeasonType = (value: string): value is SeasonType => {
  return ALL_SEASON_TYPES.includes(value as SeasonType);
};

const parseSeason = (seasonValue: string): SeasonType[] => {
  if (!seasonValue) {
    return [];
  }

  return seasonValue
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is SeasonType => isSeasonType(item));
};

const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) {
    return '未设置';
  }
  return `¥${Number(price).toString()}`;
};

interface MetaItemProps {
  label: string;
  value: string;
}

const MetaItem: React.FC<MetaItemProps> = ({ label, value }) => {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
};

export const ClothesDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [clothes, setClothes] = useState<ClothesItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await getClothesById(route.params.id);
      if (!detail) {
        Alert.alert('提示', '衣服不存在或已被删除');
        navigation.goBack();
        return;
      }
      setClothes(detail);
    } catch (error) {
      console.error('Failed to load clothes detail:', error);
      Alert.alert('错误', '加载详情失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [navigation, route.params.id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const categoryConfig = useMemo(() => {
    if (editState) {
      return getCategoryConfig(editState.category);
    }
    if (clothes) {
      return getCategoryConfig(clothes.category);
    }
    return getCategoryConfig('tops');
  }, [clothes, editState]);

  const seasonText = useMemo(() => {
    const source = editing && editState ? editState.seasons : parseSeason(clothes?.season ?? '');
    if (source.length === 0) {
      return '未设置';
    }
    return source.map((season) => getSeasonConfig(season).label).join('');
  }, [clothes?.season, editState, editing]);

  const colorText = useMemo(() => {
    if (editing && editState) {
      return editState.color.trim() || '未设置';
    }
    return clothes?.color?.trim() || '未设置';
  }, [clothes?.color, editState, editing]);

  const brandText = useMemo(() => {
    if (editing && editState) {
      return editState.brand.trim() || '未设置';
    }
    return clothes?.brand?.trim() || '未设置';
  }, [clothes?.brand, editState, editing]);

  const priceText = useMemo(() => {
    if (editing && editState) {
      const trimmed = editState.priceInput.trim();
      if (!trimmed) {
        return '未设置';
      }
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) ? formatPrice(parsed) : '未设置';
    }
    return formatPrice(clothes?.price);
  }, [clothes?.price, editState, editing]);

  const displayName = useMemo(() => {
    if (editing && editState) {
      return editState.name;
    }
    if (clothes?.name?.trim()) {
      return clothes.name.trim();
    }
    return `${categoryConfig.label}单品`;
  }, [categoryConfig.label, clothes?.name, editState, editing]);

  const startEdit = useCallback(() => {
    if (!clothes) {
      return;
    }
    setEditState({
      name: clothes.name,
      category: clothes.category,
      seasons: parseSeason(clothes.season),
      color: clothes.color,
      brand: clothes.brand,
      priceInput: clothes.price === null ? '' : `${clothes.price}`,
      notes: clothes.notes,
    });
    setEditing(true);
  }, [clothes]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setEditState(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!clothes || !editState) {
      return;
    }

    const trimmedPrice = editState.priceInput.trim();
    let parsedPrice: number | null = null;
    if (trimmedPrice.length > 0) {
      const numericPrice = Number(trimmedPrice);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        Alert.alert('提示', '价格请输入有效数字');
        return;
      }
      parsedPrice = numericPrice;
    }

    setSaving(true);
    try {
      await updateClothes(clothes.id, {
        name: editState.name.trim(),
        category: editState.category,
        season: editState.seasons,
        color: editState.color.trim(),
        brand: editState.brand.trim(),
        price: parsedPrice,
        notes: editState.notes.trim(),
      });
      await loadDetail();
      setEditing(false);
      setEditState(null);
    } catch (error) {
      console.error('Failed to update clothes:', error);
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [clothes, editState, loadDetail]);

  const performDelete = useCallback(async () => {
    if (!clothes) {
      return;
    }

    setDeleting(true);
    try {
      await deleteClothes(clothes.id);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete clothes:', error);
      Alert.alert('错误', '删除失败，请重试');
    } finally {
      setDeleting(false);
    }
  }, [clothes, navigation]);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      '确认删除',
      '确定要删除这件衣服吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            void performDelete();
          },
        },
      ]
    );
  }, [performDelete]);

  const toggleSeason = useCallback((season: SeasonType) => {
    setEditState((prev) => {
      if (!prev) {
        return prev;
      }
      const seasons = prev.seasons.includes(season)
        ? prev.seasons.filter((item) => item !== season)
        : [...prev.seasons, season];
      return { ...prev, seasons };
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!clothes) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>衣服不存在</Text>
      </View>
    );
  }

  const createdAtText = formatDateTime(clothes.created_at);
  const notesText = editing ? editState?.notes ?? '' : clothes.notes.trim();
  const isBusy = deleting || saving;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton} activeOpacity={0.7}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>衣服详情</Text>
        <View style={styles.headerActions}>
          {editing ? (
            <>
              <TouchableOpacity
                onPress={cancelEdit}
                style={styles.headerTextButton}
                disabled={isBusy}
                activeOpacity={0.7}
              >
                <Text style={styles.headerTextButtonLabel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => void handleSaveEdit()}
                style={[styles.headerTextButton, styles.headerSaveButton]}
                disabled={isBusy}
                activeOpacity={0.7}
              >
                <Text style={styles.headerSaveButtonLabel}>{saving ? '保存中' : '保存'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={startEdit}
                style={styles.headerButton}
                activeOpacity={0.7}
                disabled={isBusy}
              >
                <Text style={styles.headerIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={styles.headerButton}
                activeOpacity={0.7}
                disabled={isBusy}
              >
                <Text style={styles.headerIcon}>🗑️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowViewer(true)}
          disabled={!clothes.image_uri}
        >
          <Image source={{ uri: clothes.image_uri }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryConfig.icon} {categoryConfig.label}</Text>
          </View>

          {editing ? (
            <TextInput
              value={editState?.name}
              onChangeText={(text) =>
                setEditState((prev) => (prev ? { ...prev, name: text } : prev))
              }
              placeholder="请输入衣服名称"
              style={styles.nameInput}
            />
          ) : (
            <Text style={styles.name}>{displayName}</Text>
          )}

          <View style={styles.metaGrid}>
            <MetaItem label="季节" value={seasonText} />
            <MetaItem label="颜色" value={colorText} />
            <MetaItem label="品牌" value={brandText} />
            <MetaItem label="价格" value={priceText} />
          </View>

          {editing && editState ? (
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>分类</Text>
              <View style={styles.editChips}>
                {CATEGORY_CONFIGS.map((category) => {
                  const selected = editState.category === category.type;
                  return (
                    <TouchableOpacity
                      key={category.type}
                      style={[
                        styles.chip,
                        selected && styles.chipSelected,
                      ]}
                      onPress={() =>
                        setEditState((prev) => (prev ? { ...prev, category: category.type } : prev))
                      }
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {category.icon} {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.editLabel}>季节</Text>
              <View style={styles.editChips}>
                {SEASON_CONFIGS.map((season) => {
                  const selected = editState.seasons.includes(season.type);
                  return (
                    <TouchableOpacity
                      key={season.type}
                      style={[
                        styles.chip,
                        selected && styles.chipSelected,
                      ]}
                      onPress={() => toggleSeason(season.type)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {season.icon} {season.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.editLabel}>颜色</Text>
              <TextInput
                value={editState.color}
                onChangeText={(text) =>
                  setEditState((prev) => (prev ? { ...prev, color: text } : prev))
                }
                placeholder="请输入颜色"
                style={styles.editInput}
              />

              <Text style={styles.editLabel}>品牌</Text>
              <TextInput
                value={editState.brand}
                onChangeText={(text) =>
                  setEditState((prev) => (prev ? { ...prev, brand: text } : prev))
                }
                placeholder="请输入品牌"
                style={styles.editInput}
              />

              <Text style={styles.editLabel}>价格</Text>
              <TextInput
                value={editState.priceInput}
                onChangeText={(text) =>
                  setEditState((prev) => (prev ? { ...prev, priceInput: text } : prev))
                }
                placeholder="请输入价格"
                style={styles.editInput}
                keyboardType="decimal-pad"
              />
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>备注</Text>
          {editing ? (
            <TextInput
              value={notesText}
              onChangeText={(text) =>
                setEditState((prev) => (prev ? { ...prev, notes: text } : prev))
              }
              placeholder="添加备注..."
              multiline={true}
              style={styles.notesInput}
              textAlignVertical="top"
            />
          ) : notesText ? (
            <Text style={styles.notesText}>{notesText}</Text>
          ) : (
            <Text style={styles.emptyMetaText}>暂无备注</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.timeText}>添加时间: {createdAtText}</Text>
          <Text style={styles.timeSubText}>最后更新: {formatDateTime(clothes.updated_at)}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}>
        {editing ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={cancelEdit}
              activeOpacity={0.7}
              disabled={isBusy}
            >
              <Text style={styles.editButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => void handleSaveEdit()}
              activeOpacity={0.7}
              disabled={isBusy}
            >
              <Text style={styles.primaryButtonText}>{saving ? '保存中...' : '保存'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={startEdit}
              activeOpacity={0.7}
              disabled={isBusy}
            >
              <Text style={styles.editButtonText}>✏️ 编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={confirmDelete}
              activeOpacity={0.7}
              disabled={isBusy}
            >
              <Text style={styles.deleteButtonText}>{deleting ? '删除中...' : '🗑️ 删除'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={showViewer} transparent={true} animationType="fade">
        <Pressable style={styles.viewerContainer} onPress={() => setShowViewer(false)}>
          <Image source={{ uri: clothes.image_uri }} style={styles.viewerImage} resizeMode="contain" />
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 72,
    justifyContent: 'flex-end',
  },
  headerTextButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  headerTextButtonLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  headerSaveButton: {
    backgroundColor: COLORS.primary,
  },
  headerSaveButtonLabel: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: COLORS.divider,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: -24,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFECEF',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  name: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nameInput: {
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.lg,
  },
  metaItem: {
    width: '50%',
    marginBottom: SPACING.md,
  },
  metaLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  editSection: {
    marginTop: SPACING.sm,
  },
  editLabel: {
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  editChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  editInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFECEF',
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  notesText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    lineHeight: 28,
    fontWeight: '500',
  },
  notesInput: {
    marginTop: SPACING.sm,
    minHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  emptyMetaText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },
  timeText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  timeSubText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: 'rgba(255, 229, 236, 0.95)',
  },
  actionButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.full,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  editButtonText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  primaryButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  deleteButton: {
    marginLeft: SPACING.sm,
    backgroundColor: '#EFEFEF',
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
});

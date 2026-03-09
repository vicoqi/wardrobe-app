/**
 * 侧边栏组件
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/colors';
import { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigate = (screen: keyof RootStackParamList) => {
    onClose();
    // @ts-ignore - TypeScript has issues with dynamic navigation
    navigation.navigate(screen);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sidebar,
                {
                  transform: [{ translateX: slideAnim }],
                  paddingTop: insets.top + SPACING.lg,
                },
              ]}
            >
              {/* 个人信息区 */}
              <View style={styles.profileSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>衣橱主人</Text>
                <Text style={styles.userEmail}>管理我的衣橱</Text>
              </View>

              {/* 分割线 */}
              <View style={styles.divider} />

              {/* 菜单项 */}
              <View style={styles.menuSection}>
                {/* 灵感画布 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate('Canvas')}
                >
                  <Text style={styles.menuIcon}>🎨</Text>
                  <Text style={styles.menuText}>灵感画布</Text>
                </TouchableOpacity>

                {/* 我的搭配 */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate('OutfitList')}
                >
                  <Text style={styles.menuIcon}>👗</Text>
                  <Text style={styles.menuText}>我的搭配</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuIcon}>📊</Text>
                  <Text style={styles.menuText}>衣橱统计</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuIcon}>🔔</Text>
                  <Text style={styles.menuText}>提醒设置</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuIcon}>📦</Text>
                  <Text style={styles.menuText}>数据备份</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuIcon}>❓</Text>
                  <Text style={styles.menuText}>帮助与反馈</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuIcon}>ℹ️</Text>
                  <Text style={styles.menuText}>关于我们</Text>
                </TouchableOpacity>
              </View>

              {/* 底部版本信息 */}
              <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.lg }]}>
                <Text style={styles.versionText}>版本 1.0.0</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  profileSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.lg,
  },
  menuSection: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 28,
    textAlign: 'center',
  },
  menuText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  versionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});

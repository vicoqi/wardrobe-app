/**
 * 导航配置
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddClothesScreen } from '../screens/AddClothesScreen';
import { WardrobeBrowseScreen } from '../screens/WardrobeBrowseScreen';
import { ClothesDetailScreen } from '../screens/ClothesDetailScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

type CategoryDetailProps = NativeStackScreenProps<RootStackParamList, 'CategoryDetail'>;

// 分类详情页兼容入口：转发到已实现的浏览页
const CategoryDetailScreen: React.FC<CategoryDetailProps> = ({ navigation, route }) => {
  useEffect(() => {
    navigation.replace('WardrobeBrowse', {
      initialCategory: route.params.category,
    });
  }, [navigation, route.params.category]);

  return null;
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddClothes"
          component={AddClothesScreen}
          options={{
            title: '添加衣服',
          }}
        />
        <Stack.Screen
          name="WardrobeBrowse"
          component={WardrobeBrowseScreen}
          options={{
            title: '我的衣橱',
          }}
        />
        <Stack.Screen
          name="CategoryDetail"
          component={CategoryDetailScreen}
          options={({ route }) => ({
            title: (route.params as { title: string }).title,
          })}
        />
        <Stack.Screen
          name="ClothesDetail"
          component={ClothesDetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

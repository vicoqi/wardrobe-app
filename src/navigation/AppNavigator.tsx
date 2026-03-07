/**
 * 导航配置
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddClothesScreen } from '../screens/AddClothesScreen';
import { WardrobeBrowseScreen } from '../screens/WardrobeBrowseScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

// 占位页面组件 - 分类详情页面
const CategoryDetailScreen: React.FC = () => {
  return (
    <React.Fragment>
      {/* 占位页面，后续实现 */}
    </React.Fragment>
  );
};

// 占位页面组件 - 衣服详情页面
const ClothesDetailScreen: React.FC = () => {
  return (
    <React.Fragment>
      {/* 占位页面，后续实现 */}
    </React.Fragment>
  );
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
            title: '衣服详情',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

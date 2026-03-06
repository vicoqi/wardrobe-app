/**
 * 图片处理工具
 */

import * as ImagePicker from 'expo-image-picker';

/**
 * 从相机拍照
 */
export const pickImageFromCamera = async (): Promise<string | null> => {
  // 请求相机权限
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('需要相机权限才能拍照');
    return null;
  }

  // 启动相机
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }

  return null;
};

/**
 * 从相册选择图片
 */
export const pickImageFromAlbum = async (): Promise<string | null> => {
  // 请求相册权限
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('需要相册权限才能选择图片');
    return null;
  }

  // 启动相册
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }

  return null;
};

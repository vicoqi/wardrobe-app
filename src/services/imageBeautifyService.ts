/**
 * 图片美化服务
 * 使用 Gemini API (Nano Banana) 将衣物照片背景替换为纯白底
 */

// 从环境变量获取配置
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';
const GOOGLE_IMAGE_MODEL = process.env.EXPO_PUBLIC_GOOGLE_IMAGE_MODEL || 'gemini-2.5-flash-image';
const GOOGLE_BASE_URL = process.env.EXPO_PUBLIC_GOOGLE_BASE_URL || '';

// 美化 prompt
const BEAUTIFY_PROMPT = `Remove the background of this clothing item photo and replace it with a clean, pure white background. Keep the clothing item exactly as-is, preserving all details, colors, and textures. The result should look like a professional e-commerce product photo on a white background.`;

// Gemini API 响应中的 inline_data 部分
interface InlineData {
  mime_type: string;
  data: string;
}

interface ResponsePart {
  text?: string;
  inline_data?: InlineData;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: ResponsePart[];
    };
    error?: {
      message: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * 将图片 URI 转为 base64 字符串
 */
const imageUriToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/jpeg;base64,xxxxx → 只取 base64 部分
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Failed to extract base64 from data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 美化衣物照片 — 替换背景为纯白色
 * @param imageUri 本地图片 URI
 * @returns 美化后图片的 data URI，失败返回 null
 */
export const beautifyImage = async (imageUri: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_BASE_URL) {
    console.warn('未配置 Google API，请设置环境变量');
    return null;
  }

  try {
    // 将图片转为 base64
    const base64Image = await imageUriToBase64(imageUri);

    const url = `${GOOGLE_BASE_URL}/models/${GOOGLE_IMAGE_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: BEAUTIFY_PROMPT },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Gemini API HTTP error: ${response.status}`);
      return null;
    }

    const data: GeminiResponse = await response.json();

    // 检查 API 级别错误
    if (data.error) {
      console.error('Gemini API error:', data.error.message);
      return null;
    }

    // 提取生成的图片
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      console.error('Gemini API: no parts in response');
      return null;
    }

    const imagePart = parts.find((p) => p.inline_data?.data);
    if (!imagePart?.inline_data) {
      console.error('Gemini API: no image data in response');
      return null;
    }

    const { mime_type, data: imageData } = imagePart.inline_data;
    return `data:${mime_type};base64,${imageData}`;
  } catch (error) {
    console.error('图片美化失败:', error);
    return null;
  }
};

/**
 * 检查 API 是否已配置
 */
export const isBeautifyConfigured = (): boolean => {
  return !!(GOOGLE_API_KEY && GOOGLE_BASE_URL);
};

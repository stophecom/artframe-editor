import type { ColorPickerType } from '~/config/types';

export const TRANSPARENT_BACKGROUND_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABlBMVEUAAADY2NjnFMi2AAAAAXRSTlMAQObYZgAAABVJREFUGNNjYIQDBgQY0oLDxBsIQQCltADJNa/7sQAAAABJRU5ErkJggg==';

export const COLOR_PICKERS: ColorPickerType[] = [
  'SketchPicker',
  'ChromePicker',
  'SwatchesPicker',
  'TwitterPicker',
  'BlockPicker',
  'CompactPicker',
  'GithubPicker',
  'CirclePicker',
  'PhotoshopPicker',
  'HuePicker',
];

const isProduction = process.env.VERCEL_ENV === 'production';
// const isDevelopment = process.env.VERCEL_ENV === 'development';
// const isPreview = process.env.VERCEL_ENV === 'preview';

export const BASE_PATH = isProduction ? 'artframe.stophe.com' : process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
export const HOST = isProduction ? 'https://' : 'http://';

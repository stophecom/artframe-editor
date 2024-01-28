import { create } from 'zustand';

import type { ColorPickerType } from '~/config/types';

interface DefaultParams {
  canvasBackgroundColor: string;
  backgroundColorHex: string;
  strokeColorHex: string;
  fontColorHex: string;
  activeColorPicker: ColorPickerType;
  searchQueryIcons: string;
  searchQueryImages: string;
  sizePreset: string | null;
}

const useDefaultParams = create<{
  defaultParams: DefaultParams;
  setDefaultParams: (params: Partial<DefaultParams>) => void;
}>((set) => ({
  defaultParams: {
    canvasBackgroundColor: '#FFFFFF',
    backgroundColorHex: '#333333',
    strokeColorHex: '#000000',
    fontColorHex: '#000000',
    activeColorPicker: 'TwitterPicker',
    searchQueryIcons: '',
    searchQueryImages: '',
    sizePreset: null,
  },
  setDefaultParams: (params: Partial<DefaultParams>) =>
    set((state) => ({
      defaultParams: { ...state.defaultParams, ...params },
    })),
}));

export default useDefaultParams;

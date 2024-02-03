import { create } from 'zustand';

import type { Frame } from '~/config/types';

export interface FramesState {
  frames: Frame[];
}

export const useFrames = create<FramesState>(() => ({
  frames: [],
}));

export default useFrames;

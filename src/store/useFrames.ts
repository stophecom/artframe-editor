import { create } from 'zustand';

import type { Frame } from '~/config/types';

export interface State {
  frames: Frame[];
  currentFrame?: Frame;
}

interface Actions {
  setFrames: (state: State['frames']) => void;
  setCurrentFrame: (state: State['currentFrame']) => void;
}

export const useFrames = create<State & Actions>((set) => ({
  frames: [],
  setFrames: (frames) => set((state) => ({ ...state, frames: frames })),
  setCurrentFrame: (frame) => set((state) => ({ ...state, currentFrame: frame })),
}));

export default useFrames;

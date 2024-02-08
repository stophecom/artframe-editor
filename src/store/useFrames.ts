import { create } from 'zustand';

import type { Frame } from '~/config/types';

export interface State {
  frames: Frame[];
}

interface Actions {
  setFrames: (state: State['frames']) => void;
}

export const useFrames = create<State & Actions>((set) => ({
  frames: [],
  setFrames: (state) => set(() => ({ frames: state })),
}));

export default useFrames;

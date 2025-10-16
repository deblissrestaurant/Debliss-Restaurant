import { create } from "zustand";

interface animationActions {
  setAnimation: (animation: string) => void;
}

interface animationState {
  animation: string;
}

type animationStore = animationActions & animationState;

export const useAnimationStore = create<animationStore>()(
  (set) => ({
    animation: "",

    setAnimation: (newAnimation: string) => {
      set(() => ({ animation: newAnimation }));
    },
  })
);

import create from 'zustand';

import type { LayoutRectangle } from 'react-native';
import type { HistoryItem } from '@/components/History';

export type State = {
  uri: string;
  editing: boolean;
  history: HistoryItem[];
  inputLayout?: LayoutRectangle;
  title: string;
  loading: boolean;
  setUri: (uri: string) => void;
  setTitle: (title: string) => void;
  setEditing: (editing: boolean) => void;
  setHistory: (history: HistoryItem[]) => void;
  setInputLayout: (inputLayout: LayoutRectangle) => void;
  setLoading: (loading: boolean) => void;
};

export const useStore = create<State>((set) => ({
  uri: '',
  editing: false,
  history: [],
  title: '',
  loading: false,
  setUri: (uri) => set({ uri }),
  setTitle: (title) => set({ title }),
  setEditing: (editing) => set({ editing }),
  setHistory: (history) => set({ history }),
  setInputLayout: (inputLayout) => set({ inputLayout }),
  setLoading: (loading) => set({ loading }),
}));

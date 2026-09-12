import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const asyncStorage = createJSONStorage(() => AsyncStorage);

/** Short, collision-safe enough id for locally created content. */
export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

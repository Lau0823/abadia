import { create } from 'zustand';
import { fetchApi } from '../lib/api';

export interface Setting {
  key: string;
  value: string;
  description?: string;
}

interface SettingsState {
  settings: Setting[];
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  getSetting: (key: string, defaultValue?: string) => string;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: [],
  isLoading: false,
  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchApi('/settings');
      const settingsArray = Array.isArray(data) ? data : (data?.data || []);
      set({ settings: settingsArray, isLoading: false });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ isLoading: false });
    }
  },
  getSetting: (key: string, defaultValue = '') => {
    const { settings } = get();
    const setting = settings.find((s) => s.key === key);
    return setting && setting.value ? setting.value : defaultValue;
  },
}));

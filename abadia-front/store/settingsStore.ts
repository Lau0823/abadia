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
  updateSetting: (key: string, value: string) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
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
  updateSetting: async (key: string, value: string) => {
    try {
      await fetchApi("/settings/batch", {
        method: "POST",
        body: JSON.stringify({
          settings: [{ key, value, description: "" }]
        })
      });
      // Update local state directly for speed
      const { settings } = get();
      const exists = settings.find(s => s.key === key);
      if (exists) {
        set({ settings: settings.map(s => s.key === key ? { ...s, value } : s) });
      } else {
        set({ settings: [...settings, { key, value }] });
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We use a dummy key "upload_temp" to just get the URL if we want.
    const res = await fetchApi(`/settings/upload-image/temp_upload_${Date.now()}`, {
      method: 'POST',
      body: formData
    });

    return res.value; // The URL
  }
}));

// Web Storage compatibility layer for @react-native-async-storage/async-storage
// Uses localStorage as the backend for web environment

const storage = {
  _data: new Map<string, string>(),

  async setItem(key: string, value: string): Promise<void> {
    // Use localStorage if available, otherwise use in-memory Map
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      this._data.set(key, value);
    }
    return Promise.resolve();
  },

  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(this._data.get(key) || null);
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      this._data.delete(key);
    }
    return Promise.resolve();
  },

  async clear(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    } else {
      this._data.clear();
    }
    return Promise.resolve();
  },

  async getAllKeys(): Promise<string[]> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) keys.push(key);
      }
      return Promise.resolve(keys);
    }
    return Promise.resolve(Array.from(this._data.keys()));
  },

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    const results: [string, string | null][] = [];
    for (const key of keys) {
      const value = await this.getItem(key);
      results.push([key, value]);
    }
    return Promise.resolve(results);
  },

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    for (const [key, value] of keyValuePairs) {
      await this.setItem(key, value);
    }
    return Promise.resolve();
  },

  async multiRemove(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.removeItem(key);
    }
    return Promise.resolve();
  },
};

export default storage;


import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  constructor() {}

  async setData(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async getData(key: string): Promise<any> {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  }

  async removeData(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clearAll(): Promise<void> {
    await Preferences.clear();
  }
}

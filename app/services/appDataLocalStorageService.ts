// services/localStorageService.ts

import { AppData, BoardType } from "../types/taskTypes";

// Local Storage Key
const APP_DATA_KEY = "appData";

export class LocalStorageService {
  getAppData(): Promise<AppData> {
    const data = localStorage.getItem(APP_DATA_KEY);
    if (data) {
      return Promise.resolve(JSON.parse(data));
    } else {
      return Promise.resolve({ boards: [] });
    }
  }

  saveAppData(appData: AppData): void {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
  }
  clearLocalStorage() {
    localStorage.removeItem(APP_DATA_KEY);
  }
}

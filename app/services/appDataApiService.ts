// services/apiService.ts

import { AppData } from "../types/taskTypes";

export class ApiService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getAppData(): Promise<AppData> {
    try {
      const response = await fetch(`/api/appData?userId=${this.userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch app data");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { boards: [] }; // Fallback to empty data on error
    }
  }

  async saveAppData(appData: AppData): Promise<void> {
    try {
      const response = await fetch(`/api/appData?userId=${this.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appData),
      });
      if (!response.ok) {
        throw new Error("Failed to save app data");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.error('Error reading from localStorage', e);
        return null;
      }
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from AsyncStorage', e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error writing to localStorage', e);
      }
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to AsyncStorage', e);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing from localStorage', e);
      }
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from AsyncStorage', e);
    }
  }
};

export interface UserData {
  phone: string;
  role: 'DOCTOR' | 'STAFF' | 'PATIENT' | 'SUPER_ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  permissions?: string[];
  name?: string;
}

export const MockDB = {
  async getUsers(): Promise<UserData[]> {
    const data = await Storage.getItem('mock_users');
    return data ? JSON.parse(data) : [];
  },
  async saveUsers(users: UserData[]): Promise<void> {
    await Storage.setItem('mock_users', JSON.stringify(users));
  },
  async getUserByPhone(phone: string): Promise<UserData | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.phone === phone);
  },
  async addUser(user: UserData): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
  },
  async updateUserStatus(phone: string, status: UserData['status']): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.phone === phone);
    if (index > -1) {
      users[index].status = status;
      await this.saveUsers(users);
    }
  },
  async setCurrentSession(user: UserData): Promise<void> {
    await Storage.setItem('current_user', JSON.stringify(user));
    await Storage.setItem('isLoggedIn', 'true');
  },
  async getCurrentSession(): Promise<UserData | null> {
    const data = await Storage.getItem('current_user');
    return data ? JSON.parse(data) : null;
  },
  async clearSession(): Promise<void> {
    await Storage.removeItem('current_user');
    await Storage.removeItem('isLoggedIn');
  }
};

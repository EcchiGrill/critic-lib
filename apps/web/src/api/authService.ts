import { User } from '@/types/user';
import { api } from './axiosInstance';

interface UpdateUserBody {
  username?: string;
  email?: string;
  password?: string;
}

export class AuthService {
  private static instance: AuthService;

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    AuthService.instance = this;
  }

  async register(email: string, password: string): Promise<void> {
    return api.post('/auth/register', { email, password });
  }

  async login(email: string, password: string): Promise<void> {
    return api.post('/auth/login', { email, password });
  }

  async getProfile(): Promise<User> {
    return api.get('/auth/me');
  }

  async updateProfile(profile: UpdateUserBody): Promise<User> {
    return api.patch('/auth/me', profile);
  }

  async uploadAvatar(avatar: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return api.post('/auth/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

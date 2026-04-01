import { User } from '@/types/user';
import { api } from './axiosInstance';

interface UpdateUserBody {
  username?: string;
  email?: string;
  password?: string;
}

interface TokenResponse {
  accessToken: string;
}

export class AuthService {
  private static instance: AuthService;

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    AuthService.instance = this;
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/register', {
      username,
      email,
      password,
    });
    return data;
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  }

  async getProfile(token?: string): Promise<User> {
    const { data } = await api.get<User>('/auth/me', {
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    });
    return data;
  }

  async updateProfile(profile: UpdateUserBody): Promise<User> {
    const { data } = await api.patch<User>('/auth/me', profile);
    return data;
  }

  async uploadAvatar(avatar: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', avatar);
    return await api.post('/auth/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

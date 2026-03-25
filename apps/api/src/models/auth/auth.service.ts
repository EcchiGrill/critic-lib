import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { Express } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import type { JwtPayload } from './types/jwtPayload';

const userPublicSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  favoriteBooks: true,
  readBooks: true,
  reviews: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async register(body: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const password = await bcrypt.hash(body.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...body,
        password,
      },
    });
    return this.buildAuthResponse(user.id, user.email);
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildAuthResponse(user.id, user.email);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async updateProfile(userId: string, body: UpdateMeDto) {
    if (body.email) {
      const taken = await this.prisma.user.findFirst({
        where: { email: body.email, NOT: { id: userId } },
      });
      if (taken) {
        throw new ConflictException('Email already in use');
      }
    }
    const data: Prisma.UserUpdateInput = {
      ...body,
      ...(body.password && { password: await bcrypt.hash(body.password, 10) }),
    };
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    await this.getProfile(userId);
    const url = await this.cloudinary.uploadBuffer(file.buffer, 'avatars');
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
      select: userPublicSelect,
    });
  }

  private buildAuthResponse(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

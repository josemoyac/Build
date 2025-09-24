import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { RegisterDto } from './dto/auth.dto.js';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        tenantId: dto.tenantId,
        companyId: dto.companyId,
        role: dto.role
      }
    });
    return { userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const accessToken = await this.jwt.signAsync({ sub: user.id, tenantId: user.tenantId, role: user.role }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync({ sub: user.id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      const accessToken = await this.jwt.signAsync({ sub: payload.sub }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }
}

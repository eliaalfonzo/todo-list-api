// src/auth/jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // Usamos una instancia singleton de AuthService
  private authService = new AuthService();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token');
    }

    try {
      if (this.authService.isTokenRevoked(token)) {
        throw new UnauthorizedException('Token revocado. Debe iniciar sesión de nuevo');
      }

      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
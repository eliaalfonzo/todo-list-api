// src/auth/auth.service.ts 
import { Injectable } from '@nestjs/common';
import { query } from '../db';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config';

@Injectable()
export class AuthService {
  // Conjunto de tokens revocados (logout)
  private revokedTokens: Set<string> = new Set();

  // Valida usuario y contraseña (login)
  async validateUser(email: string, password: string) {
    const result = await query('SELECT * FROM usuario WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return null;

    // Compara contraseña hasheada
    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) return null;

    return user;
  }

  // Valida usuario por ID (para JwtAuthGuard)
  async validateUserById(id: number) {
    const result = await query('SELECT * FROM usuario WHERE id_usuario=$1', [id]);
    return result.rows[0] || null;
  }

  // Genera token JWT
  generateToken(userId: number) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
  }

  // LOGOUT: revocar token
  logout(token: string) {
    this.revokedTokens.add(token);
  }

  // Verifica si un token está revocado
  isTokenRevoked(token: string) {
    return this.revokedTokens.has(token);
  }
}
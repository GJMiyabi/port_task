import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { SignInResponse } from 'src/auth/dto/signInResponse';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async signIn(user: User): Promise<SignInResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload), user };
  }
}

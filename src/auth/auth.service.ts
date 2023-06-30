import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string) {
    const userExist = await this.usersService.findByEmail(email);

    if (userExist) {
      throw new BadRequestException('User with this email already exist.');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword);

    const payload = { userId: user.id, email: user.email, admin: user.admin };
    const token = await this.jwtService.sign(payload);
    return {
      user,
      token: token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, admin: user.admin };
    return this.jwtService.sign(payload);
  }
}

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.entity';

interface CustomRequest extends Request {
  user?: User;
}

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token: string = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const extractedToken = token.split(' ')[1];
    const decodedToken = this.jwtService.verify(extractedToken);

    const { userId } = decodedToken;

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.user = user;
    }

    next();
  }
}

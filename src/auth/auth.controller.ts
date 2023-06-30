import { Body, Controller, Inject, Post } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
  ) {}

  @Post('/signup')
  async registerUser(@Body() body: createUserDto) {
    const user = await this.authService.createUser(body.email, body.password);
    console.log(process.env.JWT_SECRET);

    this.emailService.emit('user_created', user.user.email);
    return user;
  }

  @Post('/login')
  loginUser(@Body() body: createUserDto) {
    return this.authService.login(body.email, body.password);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RegisterDto, RequestWithUser } from './auth.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { JwtAuthGuard } from './guard/jwt.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guard/jwt-refresh.guard';
import { EmailConfirmationService } from '../emailConfirmation/emailConfirmation.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authenticationService.register(registrationData);
    console.log('here?');
    await this.emailConfirmationService.sendVerificationLink(registrationData.email);
    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authenticationService.getCookieWithJwtRefreshToken(
      user.id,
    );

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }

    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Delete('users/:id')
  async delete(@Param('id') userId: any) {
    const del = await this.userService.deleteUser(+userId);
    return del;
  }

  @Get('users')
  async listUsers() {
    const del = await this.userService.listUsers();
    return del;
  }
}

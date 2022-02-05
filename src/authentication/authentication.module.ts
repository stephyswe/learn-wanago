import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { AuthenticationResolver } from './authentication.resolver';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './strategy/jwt-two-factor.strategy';
import { EmailConfirmationModule } from '../emailConfirmation/emailConfirmation.module';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, EmailConfirmationModule, JwtModule.register({})],
  controllers: [AuthenticationController, TwoFactorAuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    AuthenticationResolver,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthModule {}

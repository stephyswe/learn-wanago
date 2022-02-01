import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { RequestWithUser } from '../authentication/auth.dto';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { CreateLoginInput } from './inputs/login.input';
import { Login } from './models/login.model';

@Resolver(() => Login)
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService, private userService: UsersService) {}


  @Mutation(() => Login)
  async login(@Args('input') loginInput: CreateLoginInput, @Context() context: { req: RequestWithUser; res: any }) {
    const user = await this.userService.getByEmail(loginInput.email);
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    context.res.cookie(accessTokenCookie);
    user.password = undefined;
    return user;
  }
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Login {
  @Field()
  email: string;

  @Field()
  password: string;
}

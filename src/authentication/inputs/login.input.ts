import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

import { UserRepository } from '../repositories/user-repository';
import { User } from '../models/user';
import { Log } from '../utils/log';
import { Inject } from '../decorators/inject';
import { Validated } from '../decorators/validated';
import { Runnable } from '../utils/runnable';
import { Iso8601 } from '../utils/iso8601';
import { UserSchema } from '../joi-schemas/user-schema';

const schema = UserSchema()
  .requiredKeys(['name', 'email'])
  .forbiddenKeys(['id']);

@Inject()
export default class CreateUserUseCase implements Runnable {
  constructor(private repository: UserRepository) {}

  @Validated(schema)
  public async run(data: User, accessUserId: string): Promise<User> {
    Log.info(`ユーザーを新規作成します: ${JSON.stringify(data)}`);

    data.createdAt = Iso8601.now();

    try {
      const user = await this.repository.create(data);
      Log.info(`ユーザーを新規登録しました。 user.id: ${user.id}`);
      return user;
    } catch (e) {
      throw e;
    }
  }
}

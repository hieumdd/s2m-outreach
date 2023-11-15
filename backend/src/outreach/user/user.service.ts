import { pascalCase } from 'pascal-case';

import { exchangeCodeForToken } from '../auth/auth.service';
import { getClient } from '../auth/auth.service';
import { getMe } from '../me/me.service';
import { UserRepository } from './user.repository';
import { User } from './user.type';

export const createUser = async (code: string) => {
    const token = await exchangeCodeForToken(code);
    console.log({ token });
    const me = await getMe(getClient(<string>token.access_token));
    console.log({ me });

    const user: User = {
        id: me.data.id,
        name: me.data.attributes.name,
        dataset: pascalCase(me.data.attributes.name),
        meta: { user: me.meta.user },
        token,
    };

    UserRepository.doc(me.data.id).set(user);

    return user;
};

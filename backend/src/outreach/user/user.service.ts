import { pascalCase } from 'pascal-case';

import { exchangeCodeForToken } from '../auth/auth.service';
import { getClient } from '../auth/auth.service';
import { getMe } from '../me/me.service';
import { UserRepository } from './user.repository';
import { User } from './user.type';

export const createUser = async (code: string) => {
    const token = await exchangeCodeForToken(code);
    const me = await getMe(getClient(<string>token.access_token));

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

export const getUsers = async (withToken = false) => {
    return await UserRepository.get().then((querySnapshot) => {
        return querySnapshot.docs
            .map((doc) => doc.data())
            .map((data) => ({ ...data, token: withToken ? data.token : undefined }));
    });
};

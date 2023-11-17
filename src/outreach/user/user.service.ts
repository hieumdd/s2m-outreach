import { pascalCase } from 'pascal-case';

import { ensureToken, exchangeCodeForToken } from '../auth/auth.service';
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

export const getUsers = async () => {
    return await UserRepository.get().then((querySnapshot) => {
        return querySnapshot.docs
            .map((doc) => <User>doc.data())
            .map((data) => ({ ...data, token: undefined }));
    });
};

export const getUser = async (userId: string) => {
    const userRef = UserRepository.doc(userId);

    await userRef
        .get()
        .then((snapshot) => <User>snapshot.data())
        .then((user) => {
            return ensureToken(user.token, (token) => userRef.set({ token }, { merge: true }));
        });

    return await userRef.get().then((snapshot) => <User>snapshot.data());
};

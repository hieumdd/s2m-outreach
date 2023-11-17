import { getUsers } from './user.service';

it('getUsers', async () => {
    return getUsers()
        .then((users) => {
            expect(users).toBeDefined();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
});

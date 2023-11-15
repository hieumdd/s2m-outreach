import { Router } from 'express';

import { getAuthorizationURL } from './auth.service';

export const AuthController = Router();

AuthController.get('/authorize', (_, res) => {
    res.redirect(getAuthorizationURL());
});

AuthController.get('/authorize/callback', (req, res) => {
    const { code } = req.body;


})

const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const passportConfig = require(__base + 'app/passport/passport');
const accountController = require(__base + 'app/controllers/accountController');
const { validateBody, schemas} = require(__base + 'app/helpers/routeHelpers');
const  passportLocalOAuth = passport.authenticate('local', { session : false });
const  passportJwtOAuth = passport.authenticate('jwt', { session : false });

router.route('/account')
.get(accountController.getAccounts);

router.route('/signup')
.post(validateBody(schemas.authSchema),accountController.signUp);

router.route('/signin')
.post(validateBody(schemas.authSchema), passportLocalOAuth , accountController.signIn);

router.route('/secret')
.get(passportJwtOAuth, accountController.secret);

module.exports = router;
import {Router} from 'express';
import {verifyJwt} from "../middleware/auth";
import UserController from "../controllers/user.controller";
import express from "express";
import {body, validationResult, ValidationChain} from 'express-validator';

const router: Router = Router();
const userController = new UserController();

const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            //@ts-ignore
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({errors: errors.array()});
    };
};


router.post('/login',
    validate([
        body('email').notEmpty().trim().isEmail(),
        body('password').isString().isLength({min: 5, max: 20})
    ]),
    userController.login);

router.post('/register',
    validate([
        body('name').notEmpty().trim().isString().isLength({min: 2, max: 20}),
        body('email').notEmpty().trim().isEmail(),
        body('password').notEmpty().trim().isString().isLength({min: 5, max: 20})
    ]),
    userController.register);
router.post('/form', verifyJwt, userController.form);

export const Users: Router = router;
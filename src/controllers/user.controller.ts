import {Request, Response, NextFunction} from 'express';
//import * as userServices from '../services/user.service';
import jwt, {Secret, JwtPayload} from 'jsonwebtoken';

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

import * as bcrypt from 'bcrypt';

class UserController {
    constructor() {

    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {

            const {email, password} = req.body;

            //TODO Всю работу с пользователями вынести в сервис

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                return res.status(400).send("Invalid Credentials");
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(400).send("Invalid Credentials");
            }

            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            return res.status(200).json(user);

        } catch (err) {
            return res.status(500).send("Error");
        }

    }

    public async register(req: Request, res: Response) {

        try {

            const {name, email, password} = req.body;

            const oldUser = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    name: name,
                    password: encryptedPassword
                },
            })

            user.token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            res.status(201).json(user);
        } catch (err) {
            return res.status(500).send("Error");
        }
    }

    public async form(req: Request, res: Response) {
        try {
            res.status(200).json({ans: true});
        } catch (e) {
            return res.status(500).send("Error");
        }
    }
}

export default UserController;
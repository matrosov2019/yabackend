import {Request, Response, NextFunction} from 'express';
//import * as userServices from '../services/user.service';
import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
import axios from "axios";

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
            //bcrypt заменить на crypto

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                return res.status(400).json({
                    result: {},
                    error: {
                        code: "",
                        message: "Invalid Credentials",
                        data: {}
                    }
                });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(400).json({
                    result: {},
                    error: {
                        code: "",
                        message: "Invalid Credentials",
                        data: {}
                    }
                });
            }

            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;
            user.expiresIn = 2 * 60 * 60 * 1000;

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
            const {name, email, message} = req.body;
            const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
            const { data } = await axios.post(apiUrl, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: [name, email, message].join('\n')
            });
            res.status(200).json({ans: true});
        } catch (e) {
            return res.status(500).send("Error");
        }
    }
}

export default UserController;
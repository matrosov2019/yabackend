// @ts-ignore
import bcrypt from "bcrypt";

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

export async function login(user: any) {
    try {
        console.log('login: ', user);
        /*
        const foundUser = await UserModel.findOne({ name: user.name });

        if (!foundUser) {
            throw new Error('Name of user is not correct');
        }

        const isMatch = bcrypt.compareSync(user.password, foundUser.password);

        if (isMatch) {
            return foundUser
        } else {
            throw new Error('Password is not correct');
        }
         */
    } catch (error) {
        throw error;
    }
}

export async function register(user: any) {
    try {
        /*
        const foundUser = await UserModel.findOne({ name: user.name });

        if (!foundUser) {
            throw new Error('Name of user is not correct');
        }

        const isMatch = bcrypt.compareSync(user.password, foundUser.password);

        if (isMatch) {
            return foundUser
        } else {
            throw new Error('Password is not correct');
        }
         */
    } catch (error) {
        throw error;
    }
}
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';

const PRIVATE_KEY = 'CoderKeyQueFuncionaComoUnSecret';

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bycrypt.compareSync(password, user.password);

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.header.authorization;
    if (!authHeader) return res.status(401).send({ error: "Not authorized" 
    })
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Not authorized" });
        req.user = credentials.user;
        next();
    });
}

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
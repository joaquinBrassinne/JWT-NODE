import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.services";
import prisma from '../models/user'
import { generateToken } from "../services/auth";
import { error } from "console";


export const register = async (req: Request,res: Response):Promise<void> => {
    const {email, password} = req.body;

    try {

        if(!password ) {
            res.status(400).json({message: 'El password debe ser obligatorio!'})
            return
        }
        if(!email ) {
            res.status(400).json({message: 'El email debe ser obligatorio!'})
        }

        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);


        const user = await prisma.user.create(
            {
                data:{
                    email,
                    password:hashedPassword
                }
            }
        )

        const token = generateToken(user);
        res.status(201).json({token})
        
    } catch (error) {
        
        res.status(500).json({message: error})
    }
}

export const login = async (req: Request, res: Response):Promise<void> => {
    const {email, password} = req.body;

    try {


        if(!password ) {
            res.status(400).json({message: 'El password debe ser obligatorio!'})
            return
        }
        if(!email ) {
            res.status(400).json({message: 'El email debe ser obligatorio!'})
        }
        
        const user = await prisma.user.findUnique({ where: {email} })

        if(!user){
            res.status(404).json({message: 'El usuario no fue encontrado!'})
            return
        }

        const passwordMatch = await comparePassword(password, user.password)
        if(!passwordMatch){
            res.status(401).json({error: 'Constrasenia y usuario no coinciden'})
        }

        const token = generateToken(user)
        res.status(200).json({token})
    

    } catch (error) {
        console.log(error);
        
    }
}


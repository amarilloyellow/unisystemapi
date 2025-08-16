// Esquema de Validadion Para Crear Usuario
import Joi from "joi";

export const userCreateSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    documentId: Joi.string().required(),
    userRole: Joi.string().required(),
})

export const userUpdateSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    documentId: Joi.string()
})
// Importar Joi (libreria para validaciones)
import Joi from "joi";

// Esquema para validar la creacion de una nueva Carrera
export const CreateCareerSchema = Joi.object({
    name: Joi.string().required(),
    careerCode: Joi.string().required(),
    description: Joi.string(),
})
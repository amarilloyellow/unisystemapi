import { Router } from "express";
import { prisma } from "../config/prisma";
import { CreateCareerSchema } from "../schemas/career.schema";

// Iniciando career router
const careerRouter = Router()

// Ruta para Crear una carrera
careerRouter.post("/", async (req, res) => {

    try {
        // Iniciamos la verificacion y estraemos los datos verificaados (value) y el error (error)
        const { value, error } = CreateCareerSchema.validate(req.body)

        // Verificamos si fallo la verificacion de la libreria Joi
        if (error) {
            return void res.status(400).send({ message: error.message });
        }

        // Cremos la nueva carrera con los datos ya verificados
        const newCareer = await prisma.career.create({
            data: value
        })

        // Devolovemos la respuesta al cliente
        res.status(201).json(newCareer);

    } catch (error) {

        // Si falla la peticion
        res.status(500).send({ message: "No se pudo crear la carrera" });
        
    }

    
})

// Obtener Todas la Carreras
careerRouter.get("/", async (req, res) => {

    try {
        // Obtenemos todas las carreras
        const careers = await prisma.career.findMany()

        //Devolvemos la respuesta al cliente
        res.status(201).json(careers);

    } catch (error) {
        res.status(500).send({ message: "Error al obtener Carreras" });
    }

    
})

// Obtener carrera por su id
careerRouter.get("/:id",async (req, res) => {
    
    try {
        // Verificar si exixte la carrera en la base de datos
        const careerFound = await prisma.career.findUnique({
            where:{
                id: req.params.id
            }
        })
        if (!careerFound) {
            return void res.status(400).send({ message: "La carrera no existe en la base de datos" });
        }

        // Devolvemosla respuesta al Cliente
        res.status(200).json(careerFound);

    } catch (error) {
        res.status(500).send({ message: "Error al obtener Carrera" });
    }

})

export default careerRouter
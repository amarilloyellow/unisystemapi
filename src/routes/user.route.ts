// Importar Express.Router
import { Router } from "express";
import { prisma } from "../config/prisma";
import { userCreateSchema, userUpdateSchema } from "../schemas/user.schema";

// Inicializamos el Router
const userRouter = Router();

// /api/users <-- Ruta Anexa

// Obtener todos los usuarios
userRouter.get("/", async (req, res) => {
  try {
    const userFounds = await prisma.user.findMany();
    res.json(userFounds);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Your pija not found" });
  }
});

// Obtener un usuario por su id
userRouter.get("/:id", async (req, res) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!userFound) {
      return void res.status(400).send({ message: "Your Pija no fue encontrada"});
    }
    res.json(userFound);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "El Usuario no se encontro" });
  }
});

// Crear un nuevo usuario
userRouter.post("/", async (req, res) => {
  try {
    const { error, value } = userCreateSchema.validate(req.body);

    if (error) {
      return void res.status(400).send({ message: error.message });
    }

    const { firstName, lastName, email, password, documentId, userRole } = value;

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        documentId,
        roles: { connect: { name: userRole } },
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Your pija not found" });
  }
});

// Actualiza un solo dato del usuario por su id
userRouter.patch("/:id", async (req, res) => {
  try {
    const {error, value} = userUpdateSchema.validate(req.body)

    if (error) {
      return void res.status(400).send({ message: error.message });
    }

    // Validar si el usuario existe
    const userFound = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    })
    
    if (!!userFound) {
      const UpdateUser = await prisma.user.update({
        where: {
          id: req.params.id
        },
        data: value
      })
      res.status(201).json(UpdateUser);
    }

  } catch (error) {
    res.status(500).send({ message: "Your pija not found" });
  }
})


// Exportamos el Router
export default userRouter;

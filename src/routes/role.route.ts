// Importar Express.Router
import { Router } from "express";
import { prisma } from "../config/prisma";

// Inicializamos el Router
const roleRouter = Router();

// /api/roles <-- Ruta Anexa

// Obtener todos los roles
roleRouter.get("/", async (req, res) => {
  try {
    const userRoles = await prisma.role.findMany();
    res.json(userRoles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Your pija not found" });
  }
});

// Crear Roles de Usuario {name, level}
roleRouter.post("/", async (req, res) => {
  try {
    const { name, level } = req.body;
    const newRole = await prisma.role.create({
      data: {
        name,
        level,
      },
    });
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Your pija not found" });
  }
});
export default roleRouter;

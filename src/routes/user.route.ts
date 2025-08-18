// Importar Express.Router
import { Router } from "express";
import { prisma } from "../config/prisma";
import { addCoordinatorToCareer, addRoleToUser, userCreateSchema, userUpdateSchema } from "../schemas/user.schema";

// Inicializamos el Router
const userRouter = Router();

// /api/users <-- Ruta Anexa

// Obtener todos los usuarios
userRouter.get("/", async (req, res) => {
  try {
    const userFounds = await prisma.user.findMany({
      include: {roles:true, coordinatedCareers: true}
    });
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
      },
      include: {roles:true}
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
      include: {roles:true}
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

// Eliminar un usuario por su ID
userRouter.delete("/:id", async (req, res) => {
  try {
    // Validar si el usuario existe
    const userFound = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    })
    
    if (!!userFound) {
      const DeletedUser = await prisma.user.delete({
        where: {
          id: req.params.id
        }
      })
      res.status(201).json(DeletedUser);
    }
  } catch (error) {
    res.status(500).send({ message: "Your pija not found" });
  }
})

// Anadir un nuevo rol a un usuario
// Anadir un nuevo rol a un usuario
userRouter.post("/:id/roles", async (req, res) => {
  try {
    // 1. VALIDACIÓN (Esto ya estaba bien)
    const { error, value } = addRoleToUser.validate({
      userId: req.params.id,
      roleId: req.body.roleId,
    });

    if (error) {
      // Usamos .json() por consistencia y es más estándar para APIs
      return res.status(400).json({ message: error.message });
    }

    // 2. EJECUTAR LA TRANSACCIÓN
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Busca el usuario dentro de la transacción
      const userFound = await tx.user.findUnique({
        where: { id: value.userId },
      });

      // Si no existe, LANZA UN ERROR para revertir la transacción
      if (!userFound) {
        throw new Error('Usuario no encontrado');
      }

      // Busca el rol dentro de la transacción
      const roleFound = await tx.role.findUnique({
        where: { id: value.roleId },
      });

      // Si no existe, LANZA UN ERROR para revertir la transacción
      if (!roleFound) {
        throw new Error('Rol no encontrado');
      }
      
      // Si ambos existen, actualiza y RETORNA el resultado de la transacción
      return tx.user.update({
        where: { id: value.userId },
        data: {
          roles: {
            connect: { id: value.roleId },
          },
        },
        include: { roles: true },
      });
    });

    // 3. ENVIAR RESPUESTA EXITOSA
    // Si llegamos aquí, la transacción fue exitosa y 'updatedUser' tiene el resultado.
    return res.status(200).json(updatedUser);

  } catch (error) {
     // 4. MANEJAR ERRORES DE FORMA SEGURA CON TYPESCRIPT
    
    // Verificamos si 'error' es realmente un objeto de tipo Error
    if (error instanceof Error) {
      // Dentro de este bloque, TypeScript ya sabe que 'error' tiene la propiedad '.message'
      console.error(error.message); // Opcional: registrar el mensaje de error real

      // Ahora podemos usar 'error.message' de forma segura
      if (error.message === 'Usuario no encontrado' || error.message === 'Rol no encontrado') {
        return res.status(404).json({ message: error.message });
      }
    }

    // Para cualquier otro tipo de error (o si no es una instancia de Error),
    // enviamos una respuesta genérica.
    return res.status(500).json({ message: "Ocurrió un error inesperado en el servidor." });
  }
});

// Asignar Coordinator a una Carrera
userRouter.post("/:id/coordinatedCareer", async (req, res) => {

  try {
    // Validar datos con joi
    const {value, error} = addCoordinatorToCareer.validate({
      coordinatorId: req.params.id,
      careerId: req.body.careerId,
    })

    // Mostrar error si existe
    if (error) {
      return void res.status(400).send({ message: error.message });
    }

    // Espera a que la transacción se complete y guarda el resultado
    const updatedUser = await prisma.$transaction( async (tx) => {
      // ... Lógica de la transacción
      
      // Busca el usuario
      const userFound = await tx.user.findUnique({ where: { id: value.coordinatorId } });
      if (!userFound) { throw new Error('Usuario no encontrado'); } 

      // Busca la carrera
      const careerFound = await tx.career.findUnique({ where: { id: value.careerId } });
      if (!careerFound) { throw new Error('Carrera no encontrada'); } // Corregí el mensaje de error aquí también

      // Actualiza y devuelve el usuario
      return tx.user.update({
        where: { id: value.coordinatorId },
        data: {
          coordinatedCareers: {
            connect: { id: value.careerId },
          },
        },
        include: { coordinatedCareers: true },
      });
    });

    // Envía el resultado de la transacción al cliente
    res.status(200).json(updatedUser);

  } catch (error) {
    // 4. MANEJAR ERRORES DE FORMA SEGURA CON TYPESCRIPT
    
    // Verificamos si 'error' es realmente un objeto de tipo Error
    if (error instanceof Error) {
      // Dentro de este bloque, TypeScript ya sabe que 'error' tiene la propiedad '.message'
      console.error(error.message); // Opcional: registrar el mensaje de error real

      // Ahora podemos usar 'error.message' de forma segura
      if (error.message === 'Usuario no encontrado' || error.message === 'Carrera no encontrada') {
        return res.status(404).json({ message: error.message });
      }
    }

    // Para cualquier otro tipo de error (o si no es una instancia de Error),
    // enviamos una respuesta genérica.
    return res.status(500).json({ message: "Ocurrió un error inesperado en el servidor." });
  }


})


// Exportamos el Router
export default userRouter;

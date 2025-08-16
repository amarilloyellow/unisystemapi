/*
    --- ARCHIVO PRINCIPAL ---
*/

// Importamos los archivos y librerias del proyecto
import express from "express";
import roleRouter from "./routes/role.route"; // Ruta CRUD para los roles
import userRouter from "./routes/user.route";

// Inicializamos express
const app = express()

// Middleware para parsear Json
app.use(express.json())

// MIddleware para la ruta Role
app.use("/api/roles", roleRouter)
// MIddleware para la ruta User
app.use("/api/users", userRouter)

// Abrimos server http en el puerto 3000
app.listen(3000, () => {
    console.log("Hemos vuelto")
})
console.log("Hola")
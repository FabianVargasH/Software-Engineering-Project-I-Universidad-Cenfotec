const express = require('express');
const Registro = require('../models/Registro');
const router = express.Router()

//POST | Iniciar Sesión
// http://localhost:3000/api/login
router.post('/', async(req,res)=>{
    try {
        const {correoElectronico, contrasenna} = req.body;
        //Validacion de que los campos estén presentes
        if(!correoElectronico || !contrasenna){
            return res.status(400).json({
                msg:"Correo electrónico y contraseña son requeridos",
                loginExitoso: false
            })
        }
        //Buscar un usuario con correo y contraseña exactos
        const usuario = await Registro.findOne({
            correoElectronico: correoElectronico.toLowerCase().trim(),
            contrasenna:contrasenna
        })
        //En caso de no encontrar el usuario
        if(!usuario){
            return res.status(401).json({
                msg:"Credenciales incorrectos",
                loginExitoso: false
            })
        }
        //Login Existoso
        res.json({
            msg:"Login Exitoso",
            loginExitoso: true,
            usuario:{
                id: usuario._id,
                nombreCompleto:usuario.nombreCompleto,
                correoElectronico: usuario.correoElectronico,
                tipoUsuario: usuario.tipoUsuario
            }
        })
    } catch (error) {
        res.status(500).json({
            msg:"Error en el servidor", //Aqui es donde va explotar el error si fuera el caso
            error: error.message,
            loginExitoso:false
        }) 
    }
})
// GET | Verificar si un correo está registrado
// http://localhost:3000/api/login/verificar-correo/:email
router.get('/verificar-correo/:email', async(req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim()
        const usuario = await Registro.findOne({ correoElectronico: email })
        
        if (usuario) {
            res.json({
                existe: true,
                msg: "Correo registrado"
            })
        } else {
            res.json({
                existe: false,
                msg: "Correo no registrado"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Error al verificar correo",
            error: error.message
        })
    }
})

module.exports = router;
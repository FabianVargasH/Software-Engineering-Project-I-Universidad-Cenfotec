const express = require('express');
const Registro = require('../models/Registro');
const router = express.Router()

//POST | Crear Usuarios
// http://localhost:3000/api/registro
router.post('/',async(req, res) =>{
    try {
        const nuevoUsuario = new Registro(req.body); //req.body: datos enviados en el cuerpo de la petición HTTP
        await nuevoUsuario.save();

        res.json({
            usuario_creado: nuevoUsuario,
            msg: "Usuario creado correctamente"
        })
    } catch (error) {
        res.json({
            error,
            msg: "Error al crear el usuario"
        })
    }
})

//GET | listar Usuarios
// http://localhost:3000/api/registro
router.get('/', async(req,res) =>{
    try {
        const listaUsuarios = await Registro.find()
        res.json({
            lista: listaUsuarios,
            msg:"Listado de usuarios existoso"
        })
    } catch (error) {
        res.json({
            msg: "Error en el listado de usuarios",
            error    
        })  
    }
})

//GET | buscar usuario por ID
// http://localhost:3000/api/registro/:id
//:id hace referencia al ID especifico del usuario a buscar
router.get('/:id', async(req,res) =>{
    const id_usuario = req.params.id
    try {
        const usuarioRecuperado = await Registro.findById(id_usuario)
        if(!usuarioRecuperado){
            return res.json({
                msg:"Usuario no encontrado"
            })
        }
        res.json({
            info_usuario: usuarioRecuperado,
            msg:"Usuario encontrado existosamente"
        }) 
    } catch (error) {
        res.json({
            msg: "Error al buscar el usuario",
            error
        })
    }
})

//PUT | Modificar informacion de usuarios
// http://localhost:3000/api/registro/:id
//:id hace referencia al ID especifico del usuario a buscar
router.put('/:id', async(req,res)=>{
    const id_usuario = req.params.id
    try {
        const usuarioActualizado = await Registro.findByIdAndUpdate(
            id_usuario,
            req.body,
            { new: true, runValidators: true }
        )
        if(!usuarioActualizado){
            return res.json({
                msg: "Usuario no encotrado"
            })
        }
        res.json({
            usuario_actualizado:usuarioActualizado,
            msg:"Usuario actualizado correctamente"
        })
    } catch (error) {
        res.json({
            msg:"Ocurrió un error en la modificación",
            error
        })
        
    }
})

//DELETE | Eliminar usuarios
// http://localhost:3000/api/registro/:id
//:id hace referencia al ID especifico del usuario a buscar
router.delete('/:id', async(req,res)=>{
    const id_usuario = req.params.id
    try {
        const usuarioEliminado = await Registro.findByIdAndDelete(id_usuario)
        if(!usuarioEliminado){
            return res.json({
                msg:"usuario no encontrado"
            })
        }
        res.json({
            usuario_eliminado: usuarioEliminado,
            msg:"Usuario eliminado correctamente"
        })
    } catch (error) {
        res.json({
            msg:"Error al eliminar el usuario",
            error
        })
    } 
})

module.exports = router;
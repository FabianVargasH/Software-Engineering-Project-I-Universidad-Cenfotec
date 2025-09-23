// Función para registrar usuario (siguiendo tu estructura de servicioPersonas.js)
const registrar_usuario = async (tipoUsuario, nombreCompleto, telefono, fechaNacimiento, correoElectronico, contrasenna) => {
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:3000/api/registro",
            responseType: "json",
            data: {
                tipoUsuario: tipoUsuario,
                nombreCompleto: nombreCompleto,
                telefono: telefono,
                fechaNacimiento: fechaNacimiento,
                correoElectronico: correoElectronico,
                contrasenna: contrasenna
            }
        });

        console.log(res.data);

        // Evaluar si el usuario ya está registrado
        if (res.data.msg && res.data.usuario_creado) {
            Swal.fire({
                title: "Registro exitoso",
                text: "El usuario fue registrado exitosamente",
                icon: "success"
            }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../dashboard/dashboard.html";
            }
        });

        } else {
            // Error del servidor
            Swal.fire({
                title: "No se completó el registro",
                text: "Ocurrió un error en el servidor",
                icon: "error"
            });
        }
        
    } catch (error) {
        console.log(error);
        
        // Manejar error de correo duplicado
        if (error.response && error.response.data && error.response.data.error) {
            if (error.response.data.error.code === 11000) {
                Swal.fire({
                    title: "No se completó el registro",
                    text: "Ya existe un usuario con ese correo electrónico",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "No se completó el registro",
                    text: "Error en los datos proporcionados",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "No se completó el registro",
                text: "Error de conexión con el servidor",
                icon: "error"
            });
        }
    }
};
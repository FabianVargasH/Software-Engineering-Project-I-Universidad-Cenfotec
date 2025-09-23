// Función para iniciar sesión (siguiendo la estructura de controladorRegistro.js)
const iniciar_sesion = async (correoElectronico, contrasenna) => {
    try {
        const respuestaServidor = await axios({
            method: "post",
            url: "http://localhost:3000/api/login",
            responseType: "json",
            data: {
                correoElectronico: correoElectronico,
                contrasenna: contrasenna
            }
        });
        console.log(respuestaServidor.data);
        // Evaluar si el login fue exitoso
        if (respuestaServidor.data.loginExitoso && respuestaServidor.data.usuario) {
            const datosUsuarioLogueado = respuestaServidor.data.usuario
            // Guardar información del usuario en localStorage para mantener la sesión
            localStorage.setItem('usuarioActivo', JSON.stringify({
                id: datosUsuarioLogueado.id || datosUsuarioLogueado._id,
                nombreCompleto: datosUsuarioLogueado.nombreCompleto,
                correoElectronico: datosUsuarioLogueado.correoElectronico,
                tipoUsuario: datosUsuarioLogueado.tipoUsuario,
                fechaLogin: new Date().toISOString()
            }));
            Swal.fire({
                title: "Inicio de sesión exitoso",
                text: `¡Bienvenido de nuevo ${datosUsuarioLogueado.nombreCompleto}!`,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../dashboard/dashboard.html";
                }
            })
        } else {
            // Error en la respuesta del servidor
            Swal.fire({
                title: "Error de inicio de sesión",
                text: "No se pudo completar el inicio de sesión",
                icon: "error"
            });
        }   
        } catch (errorCapturado) {
        console.log(errorCapturado)        
        // Manejar diferentes tipos de errores
        if (errorCapturado.response && errorCapturado.response.data) {
            const respuestaError = errorCapturado.response
            
            if (respuestaError.status === 401) {
                // Credenciales incorrectas
                Swal.fire({
                    title: "Credenciales incorrectas",
                    text: "El correo electrónico o la contraseña son incorrectos",
                    icon: "warning"
                });
            } else if (respuestaError.status === 400) {
                Swal.fire({
                    title: "Datos incompletos",
                    text: "Debe ingresar correo electrónico y contraseña",
                    icon: "warning"
                });
            } else if (respuestaError.status === 500) {
                // Error del servidor
                Swal.fire({
                    title: "Error del servidor",
                    text: "Ocurrió un error en el servidor. Por favor, intente nuevamente",
                    icon: "error"
                });
            } else if (respuestaError.data.msg) {
                // Error personalizado del servidor
                Swal.fire({
                    title: "Error de inicio de sesión",
                    text: respuestaError.data.msg,
                    icon: "error"
                });
            } else {
                // Error genérico del servidor
                Swal.fire({
                    title: "Error del servidor",
                    text: "Ocurrió un error en el servidor. Por favor, intente nuevamente",
                    icon: "error"
                });
            }
        } else {
            // Error de conexión
            Swal.fire({
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor. Verifique su conexión a internet",
                icon: "error"
            });
        }
    }
};

// Verificar sesión activa al cargar la página de login
document.addEventListener('DOMContentLoaded', verificarSesionActiva)
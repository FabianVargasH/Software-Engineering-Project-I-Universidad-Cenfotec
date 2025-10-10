const formularioLogin = document.getElementById('formLogin');
const botonIniciarSesion = document.getElementById('btnIniciarSesion');
const campoEmail = document.getElementById('txtEmail');
const campoContrasena = document.getElementById('txtContrasenna');

const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mensajes de error
const mensajesError = {
    emailVacio: 'Por favor ingrese su correo electrónico',
    emailInvalido: 'Formato de correo inválido (ejemplo de formato: usuario@dominio.com)',
    contrasenaVacia: 'Por favor ingrese su contraseña'
};

//Funcion para mostrar el error al ususario
function mostrarError(campo, mensaje) {
    const grupo = campo.parentElement;
    let mensajeError = grupo.querySelector('.mensaje-error');
    
    if (mensajeError) {
        mensajeError.textContent = mensaje;
    }
    campo.classList.add('campo-invalido');
}

//Funcion para limpiar el error de los campos
function limpiarError(campo) {
    const grupo = campo.parentElement;
    const mensajeError = grupo.querySelector('.mensaje-error');
    if (mensajeError) {
        mensajeError.textContent = '';
    }
    campo.classList.remove('campo-invalido');
}

//Funcion para limpiar todos los campos del formulario
function limpiarCamposFormulario() {
    campoEmail.value = '';
    campoContrasena.value = '';
    limpiarError(campoEmail);
    limpiarError(campoContrasena);
    campoEmail.focus();
}

//Funcion para validar el Email
function validarEmail() {
    const email = campoEmail.value.trim();
    if (!email) {
        mostrarError(campoEmail, mensajesError.emailVacio);
        return false;
    }
    if (!expresionEmail.test(email)) {
        mostrarError(campoEmail, mensajesError.emailInvalido);
        return false;
    }
    limpiarError(campoEmail);
    return true;
}

function validarContrasena() {
    const contrasena = campoContrasena.value;
    if (!contrasena) {
        mostrarError(campoContrasena, mensajesError.contrasenaVacia);
        return false;
    }
    limpiarError(campoContrasena);
    return true;
}

//Funcion para validar formulario
function validarFormulario() {
    let primerError = null;
    
    // Validar email
    const email = campoEmail.value.trim();
    if (!email) {
        mostrarError(campoEmail, mensajesError.emailVacio);
        if (!primerError) {
            primerError = { 
                campo: campoEmail, 
                mensaje: mensajesError.emailVacio 
            };
        }
    } else if (!expresionEmail.test(email)) {
        mostrarError(campoEmail, mensajesError.emailInvalido);
        if (!primerError) {
            primerError = { 
                campo: campoEmail, 
                mensaje: mensajesError.emailInvalido 
            };
        }
    } else {
        limpiarError(campoEmail);
    }
    
    // Validar contraseña
    const contrasena = campoContrasena.value;
    if (!contrasena) {
        mostrarError(campoContrasena, mensajesError.contrasenaVacia);
        if (!primerError) {
            primerError = { 
                campo: campoContrasena, 
                mensaje: mensajesError.contrasenaVacia 
            };
        }
    } else {
        limpiarError(campoContrasena);
    }  
    
    return primerError;
}

async function manejarEnvio(evento) {
    evento.preventDefault();
    const error = validarFormulario();
    
    if (error) {
        // Mostrar error de validación frontend
        Swal.fire({
            title: "¡ERROR! datos incorrectos",
            text: error.mensaje,
            icon: "error",
            confirmButtonColor: '#dc3545'
        }).then(() => {
            // Limpiar los campos después de cerrar el alert
            limpiarCamposFormulario();
        });
        return;
    }

    // Si las validaciones frontend pasaron, llamar al backend
    try {
        // Deshabilitar el botón mientras se procesa la petición
        botonIniciarSesion.disabled = true;
        botonIniciarSesion.textContent = 'Iniciando sesión...';

        const email = campoEmail.value.trim();
        const contrasena = campoContrasena.value;

        // Llamar a la función del backend para autenticar
        await iniciar_sesion(email, contrasena);

    } catch (error) {
        console.error('Error en el proceso de login:', error);

        Swal.fire({
            title: "Error inesperado",
            text: "Datos incorrectos. Por favor, intente nuevamente.",
            icon: "error",
            confirmButtonColor: '#dc3545'
        }).then(() => {
            // Limpiar los campos después de cerrar el alert
            limpiarCamposFormulario();
        });
    } finally {
        // Re-habilitar el botón
        botonIniciarSesion.disabled = false;
        botonIniciarSesion.textContent = 'Iniciar Sesión';
    }
}

function configurarEventos() {
    // Validaciones en tiempo real (al salir del campo)
    campoEmail.addEventListener('blur', validarEmail);
    campoContrasena.addEventListener('blur', validarContrasena);
    
    // Evento del botón de iniciar sesión
    botonIniciarSesion.addEventListener('click', manejarEnvio);
    
    // También permitir envío con Enter
    formularioLogin.addEventListener('submit', manejarEnvio);
    
    // Limpiar errores cuando el usuario empiece a escribir
    campoEmail.addEventListener('input', function() {
        if (this.classList.contains('campo-invalido')) {
            limpiarError(this);
        }
    });
    
    campoContrasena.addEventListener('input', function() {
        if (this.classList.contains('campo-invalido')) {
            limpiarError(this);
        }
    });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    configurarEventos();
});
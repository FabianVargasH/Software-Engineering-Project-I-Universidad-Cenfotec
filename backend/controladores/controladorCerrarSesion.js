// Función para cerrar sesión
const cerrarSesion = () => {
    try {
        // Mostrar confirmación antes de cerrar sesión
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que quieres cerrar tu sesión?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar datos del usuario del localStorage
                localStorage.removeItem('usuarioActivo');
                
                // Opcional: Limpiar todo el localStorage si es necesario
                // localStorage.clear();
                
                // Mostrar mensaje de confirmación con botón OK
                Swal.fire({
                    title: 'Sesión cerrada',
                    text: 'Redirigiendo al inicio',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redireccionar al index (página de inicio/login)
                        window.location.href = "../../index.html";
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // En caso de error, intentar redireccionar de todas formas
        localStorage.removeItem('usuarioActivo');
        window.location.href = "../../index.html";
    }
};

// Función alternativa sin confirmación (más directa)
const cerrarSesionDirecto = () => {
    try {
        // Eliminar datos del usuario del localStorage
        localStorage.removeItem('usuarioActivo');
        
        // Mostrar mensaje de confirmación con botón OK
        Swal.fire({
            title: 'Sesión cerrada',
            text: 'Redirigiendo al inicio',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redireccionar al index
                window.location.href = "../../index.html";
            }
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // En caso de error, intentar redireccionar de todas formas
        localStorage.removeItem('usuarioActivo');
        window.location.href = "../../index.html";
    }
};

// Función para verificar si hay una sesión activa
const verificarSesionActiva = () => {
    const datosUsuarioGuardado = localStorage.getItem('usuarioActivo');
    if (datosUsuarioGuardado) {
        try {
            const informacionUsuario = JSON.parse(datosUsuarioGuardado);
            const fechaInicioSesion = new Date(informacionUsuario.fechaLogin);
            const fechaActual = new Date();
            
            // Verificar si la sesión no ha expirado 
            const tiempoLimiteExpiracion = 24 * 60 * 60 * 1000; // 24 horas en millisegundos
            if (fechaActual - fechaInicioSesion >= tiempoLimiteExpiracion) {
                // Sesión expirada, limpiar localStorage y redireccionar
                localStorage.removeItem('usuarioActivo');
                
                Swal.fire({
                    title: 'Sesión expirada',
                    text: 'Redirigiendo al inicio',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "../../index.html";
                    }
                });
            }
        } catch (errorParseo) {
            // Error al parsear los datos, limpiar localStorage
            localStorage.removeItem('usuarioActivo');
            
            Swal.fire({
                title: 'Error de sesión',
                text: 'Redirigiendo al inicio',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../../index.html";
                }
            });
        }
    } else {
        // No hay sesión activa, redireccionar al login
        Swal.fire({
            title: 'Sesión cerrada',
            text: 'Redirigiendo al inicio',
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../../index.html";
            }
        });
    }
};

// Ejecutar verificación de sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    verificarSesionActiva();
});
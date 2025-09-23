document.addEventListener('DOMContentLoaded', async function() {
    // Cargar datos inicialmente
    await cargarRutaActual();
    
    // Configurar actualización automática cada 30 segundos
    setInterval(cargarRutaActual, 30000);
});

async function cargarRutaActual() {
    try {
        // Hacer petición a la API para obtener todas las rutas
        const response = await axios.get('http://localhost:3000/api/administracion');
        
        if (response.data && response.data.rutas && response.data.rutas.length > 0) {
            // Obtener la ruta más reciente (última en el array)
            const rutas = response.data.rutas;
            const rutaMasReciente = rutas[rutas.length - 1];
            
            // Actualizar la página con la información de la ruta más reciente
            actualizarInformacionRuta(rutaMasReciente);
            actualizarTablaHorarios(rutaMasReciente);
            actualizarContacto(rutaMasReciente);
            actualizarUltimaActualizacion();
            
        } else {
            mostrarSinDatos();
        }
            } catch (error) {
        console.error('Error en la petición:', error);
        mostrarError(error);
    }
}

function actualizarInformacionRuta(ruta) {
    // Actualizar título de la ruta
    const tituloRuta = document.querySelector('.titulo_ruta');
    if (tituloRuta) {
        tituloRuta.textContent = ruta.ruta || 'Sin nombre de ruta';
    }
    
    // Actualizar recorrido (sin duplicar el título)
    const recorridoTexto = document.querySelector('.recorrido-texto');
    if (recorridoTexto) {
        recorridoTexto.textContent = ruta.recorrido || 'Información no disponible';
    }
    
    // Actualizar tarifa
    const tarifaPrecio = document.querySelector('.tarifa-precio');
    if (tarifaPrecio) {
        tarifaPrecio.textContent = ruta.tarifa ? `$${ruta.tarifa}` : 'No definida';
    }
}

function actualizarTablaHorarios(ruta) {
    const tbody = document.querySelector('.tabla-horarios tbody');
    if (!tbody) return;
    
    // Formatear la fecha para mostrar el día
    let fechaFormateada = 'Fecha no disponible';
    if (ruta.dia) {
        try {
            const fecha = new Date(ruta.dia);
            const opcionesFecha = { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            };
            fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
        } catch (error) {
            console.warn('Error al formatear fecha:', error);
        }
    }
    
    // Limpiar tabla actual
    tbody.innerHTML = '';
    
    // Crear nueva fila con los datos de la ruta
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${fechaFormateada}</td>
        <td>${ruta.horaPrimerBus || 'No definido'}</td>
        <td>${ruta.horaUltimoBus || 'No definido'}</td>
        <td>${ruta.frecuencia || 'No definida'}</td>
    `;
    
    tbody.appendChild(fila);
}

function actualizarContacto(ruta) {
    // Actualizar teléfono
    const telefonoElement = document.getElementById('telefono-contacto');
    if (telefonoElement) {
        telefonoElement.textContent = ruta.telefono || 'No disponible';
    }
    
    // Actualizar email
    const emailElement = document.getElementById('email-contacto');
    if (emailElement) {
        emailElement.textContent = ruta.correoElectronico || 'No disponible';
    }
}

function actualizarUltimaActualizacion() {
    const ultimaActualizacion = document.getElementById('ultima-actualizacion');
    if (ultimaActualizacion) {
        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        ultimaActualizacion.textContent = `Última actualización: ${horaFormateada}`;
    }
}

function mostrarSinDatos() {
    // Mostrar mensaje cuando no hay datos
    const tituloRuta = document.querySelector('.titulo_ruta');
    if (tituloRuta) {
        tituloRuta.textContent = 'No hay rutas disponibles';
    }
    
    const recorridoTexto = document.querySelector('.recorrido-texto');
    if (recorridoTexto) {
        recorridoTexto.textContent = 'No hay información de recorrido disponible';
    }
    
    const tarifaPrecio = document.querySelector('.tarifa-precio');
    if (tarifaPrecio) {
        tarifaPrecio.textContent = 'No definida';
    }
    
    // Limpiar tabla
    const tbody = document.querySelector('.tabla-horarios tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" class="sin-datos">No hay horarios disponibles</td></tr>';
    }
    
    // Limpiar contactos
    const telefonoElement = document.getElementById('telefono-contacto');
    const emailElement = document.getElementById('email-contacto');
    if (telefonoElement) telefonoElement.textContent = 'No disponible';
    if (emailElement) emailElement.textContent = 'No disponible';
    
    mostrarMensaje('No hay rutas de transporte registradas', 'info');
}

function mostrarError(error) {
    let mensaje = 'Error al cargar la información de transporte';
    
    if (error.response) {
        mensaje = `Error del servidor: ${error.response.status}`;
    } else if (error.request) {
        mensaje = 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
    
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonColor: '#d33'
    });
}

function mostrarMensaje(mensaje, tipo = 'info') {
    Swal.fire({
        icon: tipo,
        title: 'Información',
        text: mensaje,
        confirmButtonColor: '#3085d6'
    });
}

// Función para obtener una ruta específica por ID (mantener por compatibilidad)
async function mostrarRutaPorId(id) {
    try {
        const response = await axios.get(`http://localhost:3000/api/administracion/${id}`);
        
        if (response.data && response.data.ruta) {
            actualizarInformacionRuta(response.data.ruta);
            actualizarTablaHorarios(response.data.ruta);
            actualizarContacto(response.data.ruta);
            actualizarUltimaActualizacion();
        }
    } catch (error) {
        console.error('Error al cargar ruta específica:', error);
        mostrarError(error);
    }
}
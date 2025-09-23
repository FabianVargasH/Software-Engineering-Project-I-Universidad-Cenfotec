const API_BASE_URL = 'http://localhost:3000/api'; //Variable para que sea mas sencillo el tema de las rutas

const TransporteController = {
    
    // Crear nueva ruta de transporte
    crearRuta: async (datosFormulario) => {
        try {
            console.log('Enviando datos al servidor:', datosFormulario);
            
            const response = await axios.post(`${API_BASE_URL}/administracion`, datosFormulario, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 segundos de timeout
            });
            
            console.log('Respuesta exitosa del servidor:', response.data);
            
            return {
                exito: true,
                datos: response.data,
                mensaje: response.data.msg || 'Ruta creada exitosamente'
            };
            
        } catch (error) {
            console.error('Error en crearRuta:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Obtener todas las rutas
    obtenerRutas: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/administracion`, {
                timeout: 8000
            });
            
            return {
                exito: true,
                datos: response.data,
                rutas: response.data.rutas || []
            };
            
        } catch (error) {
            console.error('Error en obtenerRutas:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Obtener ruta más reciente
    obtenerRutaReciente: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/administracion/reciente`, {
                timeout: 8000
            });
            
            return {
                exito: true,
                datos: response.data,
                ruta: response.data.ruta
            };
            
        } catch (error) {
            console.error('Error en obtenerRutaReciente:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Obtener ruta por ID
    obtenerRutaPorId: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/administracion/${id}`, {
                timeout: 8000
            });
            
            return {
                exito: true,
                datos: response.data,
                ruta: response.data.ruta
            };
            
        } catch (error) {
            console.error('Error en obtenerRutaPorId:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Actualizar ruta existente
    actualizarRuta: async (id, datosFormulario) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/administracion/${id}`, datosFormulario, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            return {
                exito: true,
                datos: response.data,
                mensaje: response.data.msg || 'Ruta actualizada exitosamente'
            };
            
        } catch (error) {
            console.error('Error en actualizarRuta:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Eliminar ruta
    eliminarRuta: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/administracion/${id}`, {
                timeout: 10000
            });
            
            return {
                exito: true,
                datos: response.data,
                mensaje: response.data.msg || 'Ruta eliminada exitosamente'
            };
            
        } catch (error) {
            console.error('Error en eliminarRuta:', error);
            return TransporteController.manejarError(error);
        }
    },
    
    // Manejo centralizado de errores
    manejarError: (error) => {
        let mensajeError = "Error inesperado. Intente nuevamente.";
        let tipoError = 'desconocido';
        
        if (error.response) {
            // Error de respuesta del servidor
            tipoError = 'servidor';
            const status = error.response.status;
            const errorData = error.response.data;
            
            console.log('Error de respuesta del servidor:', {
                status,
                data: errorData
            });
            
            // Manejar diferentes códigos de estado
            switch (status) {
                case 400:
                    tipoError = 'validacion';
                    if (errorData && errorData.msg) {
                        mensajeError = errorData.msg;
                    } else if (errorData && errorData.error) {
                        if (errorData.error.detalles && Array.isArray(errorData.error.detalles)) {
                            mensajeError = `Errores de validación: ${errorData.error.detalles.join(', ')}`;
                        } else {
                            mensajeError = errorData.error.message || "Error de validación";
                        }
                    }
                    break;
                    
                case 404:
                    tipoError = 'no_encontrado';
                    mensajeError = "Recurso no encontrado";
                    break;
                    
                case 500:
                    tipoError = 'servidor_interno';
                    mensajeError = "Error interno del servidor. Contacte al administrador.";
                    break;
                    
                default:
                    mensajeError = `Error del servidor (${status}): ${errorData?.msg || 'Error desconocido'}`;
            }
            
        } else if (error.request) {
            // Error de conexión
            tipoError = 'conexion';
            mensajeError = "No se pudo conectar con el servidor. Verifique su conexión a internet.";
            
        } else if (error.code === 'ECONNABORTED') {
            // Error de timeout
            tipoError = 'timeout';
            mensajeError = "La solicitud tardó demasiado tiempo. Intente nuevamente.";
        }
        
        return {
            exito: false,
            error: {
                mensaje: mensajeError,
                tipo: tipoError,
                original: error.message
            }
        };
    }
};

const UIHelpers = {
    
    // Mostrar mensaje de éxito
    mostrarExito: (titulo, mensaje) => {
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: titulo,
                text: mensaje,
                icon: "success",
                confirmButtonColor: '#28a745',
                confirmButtonText: 'Continuar'
            });
        } else {
            alert(`${titulo}: ${mensaje}`);
            return Promise.resolve();
        }
    },
    
    // Mostrar mensaje de error
    mostrarError: (titulo, mensaje) => {
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: titulo,
                text: mensaje,
                icon: "error",
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Entendido'
            });
        } else {
            alert(`${titulo}: ${mensaje}`);
            return Promise.resolve();
        }
    },
    
    // Mostrar confirmación
    mostrarConfirmacion: (titulo, mensaje, textoConfirmar = 'Sí, continuar') => {
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: titulo,
                text: mensaje,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                confirmButtonText: textoConfirmar,
                cancelButtonText: 'Cancelar'
            });
        } else {
            return Promise.resolve({
                isConfirmed: confirm(`${titulo}\n${mensaje}`)
            });
        }
    },
    
    // Mostrar indicador de carga en botón
    activarCargaBoton: (boton, textoOriginal, textoCarga = 'Cargando...') => {
        if (boton) {
            boton.disabled = true;
            boton.textContent = textoCarga;
            boton.dataset.textoOriginal = textoOriginal;
        }
    },
    
    // Restaurar botón después de carga
    desactivarCargaBoton: (boton) => {
        if (boton) {
            boton.disabled = false;
            boton.textContent = boton.dataset.textoOriginal || 'Enviar';
        }
    }
};

const FormularioTransporte = {
    
    // Procesar envío del formulario
    procesarEnvio: async (datosFormulario, botonEnvio) => {
        // Activar indicador de carga
        UIHelpers.activarCargaBoton(botonEnvio, botonEnvio.textContent, 'Enviando...');
        
        try {
            // Llamar al controlador
            const resultado = await TransporteController.crearRuta(datosFormulario);
            
            if (resultado.exito) {
                // Mostrar éxito y limpiar formulario
                await UIHelpers.mostrarExito('¡Ruta creada exitosamente!', resultado.mensaje);
                return { exito: true };
            } else {
                // Mostrar error
                await UIHelpers.mostrarError('Error al guardar', resultado.error.mensaje);
                return { exito: false, error: resultado.error };
            }
            
        } catch (error) {
            console.error('Error inesperado en procesarEnvio:', error);
            await UIHelpers.mostrarError('Error inesperado', 'Ocurrió un error inesperado. Intente nuevamente.');
            return { exito: false, error: { mensaje: 'Error inesperado' } };
            
        } finally {
            // Restaurar botón
            UIHelpers.desactivarCargaBoton(botonEnvio);
        }
    },
    
    // Crear objeto de datos desde el formulario
    crearObjetoDatos: (camposFormulario) => {
        return {
            ruta: camposFormulario.ruta.value.trim(),
            recorrido: camposFormulario.recorrido.value.trim(),
            tarifa: parseFloat(camposFormulario.tarifa.value.trim()),
            dia: camposFormulario.dia.value,
            horaPrimerBus: camposFormulario.horaPrimerBus.value,
            horaUltimoBus: camposFormulario.horaUltimoBus.value,
            frecuencia: camposFormulario.frecuencia.value.trim(),
            telefono: camposFormulario.telefono.value.trim(),
            correoElectronico: camposFormulario.correo.value.trim()
        };
    }
};

// Hacer disponibles globalmente
window.TransporteController = TransporteController;
window.UIHelpers = UIHelpers;
window.FormularioTransporte = FormularioTransporte;
// Funciones para manejar localStorage de ofertas
const STORAGE_KEY_OFERTAS = 'ofertas_descuentos';

function guardarOfertas(ofertas) {
    localStorage.setItem(STORAGE_KEY_OFERTAS, JSON.stringify(ofertas));
}

function cargarOfertas() {
    const ofertasGuardadas = localStorage.getItem(STORAGE_KEY_OFERTAS);
    return ofertasGuardadas ? JSON.parse(ofertasGuardadas) : [];
}

// Variable global para ofertas
let misOfertas = cargarOfertas();

// Función para calcular fecha de vencimiento
function calcularFechaVencimiento(duracionDias) {
    const fechaActual = new Date();
    const fechaVencimiento = new Date(fechaActual);
    fechaVencimiento.setDate(fechaActual.getDate() + parseInt(duracionDias));
    return fechaVencimiento;
}

// Función para formatear fecha
function formatearFecha(fecha) {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para verificar si una oferta está vigente
function esOfertaVigente(fechaVencimiento) {
    const hoy = new Date();
    // Convertir fecha del formato dd/mm/yyyy a objeto Date
    const partes = fechaVencimiento.split('/');
    const vencimiento = new Date(partes[2], partes[1] - 1, partes[0]); // año, mes-1, día
    
    // Resetear horas para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    vencimiento.setHours(0, 0, 0, 0);
    
    return vencimiento >= hoy;
}

// Función para crear HTML de una tarjeta de oferta
function crearTarjetaOfertaHTML(oferta) {
    const esVigente = esOfertaVigente(oferta.fechaVencimiento);
    const claseVigencia = esVigente ? 'vigente' : 'vencida';
    const estadoTexto = esVigente ? '' : '(VENCIDA)';
    
    return `
        <div class="tarjeta ${claseVigencia}">
            <p>
                <strong>${oferta.producto}</strong> ${estadoTexto}<br>
                <strong>Oferta:</strong> ${oferta.oferta}<br>
                <strong>Descripción:</strong> ${oferta.descripcionOferta}<br>
                <strong>Condiciones:</strong> ${oferta.condiciones}<br>
                <strong>Válida hasta:</strong> ${oferta.fechaVencimiento}
            </p>
        </div>
    `;
}

// Función para renderizar ofertas en las tarjetas
function renderizarOfertas() {
    const contenedorTarjetas = document.querySelector('.contenedor_tarjetas');
    if (!contenedorTarjetas) return;
    
    // Filtrar solo ofertas vigentes para mostrar públicamente
    const ofertasVigentes = misOfertas.filter(oferta => esOfertaVigente(oferta.fechaVencimiento));
    
    // Limpiar contenido actual
    contenedorTarjetas.innerHTML = '';
    
    if (ofertasVigentes.length === 0) {
        contenedorTarjetas.innerHTML = `
            <div class="tarjeta">
                <p style="text-align: center; color: #666; font-style: italic;">
                    No hay ofertas disponibles en este momento
                </p>
            </div>
        `;
    } else {
        // Agregar cada oferta vigente (las más recientes primero)
        ofertasVigentes.slice().reverse().forEach(oferta => {
            contenedorTarjetas.innerHTML += crearTarjetaOfertaHTML(oferta);
        });
    }
}

// Función para agregar una nueva oferta
function agregarOferta(datosOferta) {
    const fechaVencimiento = calcularFechaVencimiento(datosOferta.duracion);
    
    const nuevaOferta = {
        producto: datosOferta.producto,
        descripcion: datosOferta.descripcion,
        oferta: datosOferta.oferta,
        descripcionOferta: datosOferta.descripcionOferta,
        condiciones: datosOferta.condiciones,
        duracion: datosOferta.duracion,
        fechaCreacion: formatearFecha(new Date()),
        fechaVencimiento: formatearFecha(fechaVencimiento),
        id: Date.now() // ID único basado en timestamp
    };
    
    misOfertas.push(nuevaOferta);
    guardarOfertas(misOfertas);
    renderizarOfertas();
}

// Agregar estilos CSS para las ofertas
function agregarEstilosOfertas() {
    const estilosAdicionales = `
        <style id="estilos-ofertas">
        .tarjeta.vigente {
            border-left: 4px solid #28a745;
        }

        .tarjeta.vencida {
            border-left: 4px solid #dc3545;
            opacity: 0.7;
        }

        .tarjeta p {
            line-height: 1.4;
            margin: 0;
        }

        .tarjeta strong {
            color: #333;
        }

        .contenedor_tarjetas {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
        }

        .tarjeta {
            flex: 1;
            min-width: 280px;
            max-width: 350px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        </style>
    `;
    
    // Solo agregar estilos si no existen
    if (!document.getElementById('estilos-ofertas')) {
        document.head.insertAdjacentHTML('beforeend', estilosAdicionales);
    }
}

// Referencias a elementos del formulario
const formulario = document.getElementById("formOferta");
const camposFormulario = {
    producto: document.getElementById("txtProducto"),
    descripcion: document.getElementById("txtDescripcion"),
    oferta: document.getElementById("txtOferta"),
    descripcionOferta: document.getElementById("txtDescripcionOferta"),
    condiciones: document.getElementById("txtCondiciones"),
    duracion: document.getElementById("txtDuracion")
};

// Reglas de validación estructuradas (sin emprendimiento)
const reglasValidacion = {
    producto: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "El nombre del producto es obligatorio";
        }
        
        if (valorIngresado.length < 2) {
            return "El nombre del producto debe tener al menos 2 caracteres";
        }
        
        if (valorIngresado.length > 50) {
            return "El nombre del producto debe tener máximo 50 caracteres";
        }
        
        return true;
    },
    
    descripcion: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "La descripción del producto es obligatoria";
        }
        
        if (valorIngresado.length < 10) {
            return "La descripción del producto debe tener al menos 10 caracteres";
        }
        
        if (valorIngresado.length > 200) {
            return "La descripción del producto debe tener máximo 200 caracteres";
        }
        
        return true;
    },
    
    oferta: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "La oferta o descuento es obligatorio";
        }
        
        if (valorIngresado.length < 2) {
            return "La oferta debe tener al menos 2 caracteres";
        }
        
        if (valorIngresado.length > 30) {
            return "La oferta o descuento debe tener máximo 30 caracteres";
        }
        
        return true;
    },
    
    descripcionOferta: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "La descripción de la oferta es obligatoria";
        }
        
        if (valorIngresado.length < 10) {
            return "La descripción de la oferta debe tener al menos 10 caracteres";
        }
        
        if (valorIngresado.length > 150) {
            return "La descripción de la oferta debe tener máximo 150 caracteres";
        }
        
        return true;
    },
    
    condiciones: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Las condiciones son obligatorias";
        }
        
        if (valorIngresado.length < 5) {
            return "Las condiciones deben tener al menos 5 caracteres";
        }
        
        if (valorIngresado.length > 120) {
            return "Las condiciones deben tener máximo 120 caracteres";
        }
        
        return true;
    },
    
    duracion: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "La duración es obligatoria";
        }
        
        if (!/^\d+$/.test(valorIngresado)) {
            return "La duración debe ser un número entero";
        }
        
        const duracionNum = parseInt(valorIngresado);
        
        if (duracionNum < 1) {
            return "La duración debe ser mayor a 0 días";
        }
        
        if (duracionNum > 365) {
            return "La duración no puede ser mayor a 365 días";
        }
        
        return true;
    }
};

// Función para marcar campo con error 
const marcarCampoConError = (elementoInput, tieneError) => {
    if (tieneError) {
        elementoInput.classList.add("error");
        elementoInput.style.borderColor = 'red';
    } else {
        elementoInput.classList.remove('error');
        elementoInput.style.borderColor = '';
    }
};

// Función principal de validación
const ejecutarValidacionCompleta = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;
    
    // Validar campos del formulario en orden
    for (const nombreCampo in reglasValidacion) {
        const elementoCampo = camposFormulario[nombreCampo];
        
        if (elementoCampo) {
            const resultadoValidacion = reglasValidacion[nombreCampo](elementoCampo);
            
            if (resultadoValidacion !== true) {
                marcarCampoConError(elementoCampo, true);
                formularioEsValido = false;
                if (!primerErrorEncontrado) {
                    primerErrorEncontrado = { referenciaHTML: elementoCampo, mensaje: resultadoValidacion };
                }
            } else {
                marcarCampoConError(elementoCampo, false);
            }
        }
    }
    
    return formularioEsValido ? null : primerErrorEncontrado;
};

// Función para limpiar el formulario
const limpiarCampos = () => {
    // Limpiar los inputs
    Object.values(camposFormulario).forEach(elementoCampo => {
        if (elementoCampo) {
            elementoCampo.value = '';
            marcarCampoConError(elementoCampo, false);
        }
    });
    
    // Resetear el formulario completo
    if (formulario) {
        formulario.reset();
    }
    
    // Limpiar también cualquier mensaje de error que pudiera quedar
    document.querySelectorAll(".error-message").forEach(msg => msg.remove());
};

// ===== INICIALIZACIÓN =====
// Cuando se carga el DOM, inicializar funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS para las ofertas
    agregarEstilosOfertas();
    
    // Renderizar ofertas existentes
    renderizarOfertas();
    
    // Desactivar validaciones HTML5 nativas
    if (formulario) {
        formulario.setAttribute('novalidate', 'true');
        
        // Event listener principal del formulario
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const errorEncontrado = ejecutarValidacionCompleta();
            
            if (errorEncontrado) {
                // Usar SweetAlert2 para mostrar errores
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: "Error en el formulario",
                        text: errorEncontrado.mensaje,
                        icon: "error",
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    alert("Error: " + errorEncontrado.mensaje);
                }
                
                // Hacer scroll al primer campo con error si existe
                if (errorEncontrado.referenciaHTML) {
                    errorEncontrado.referenciaHTML.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorEncontrado.referenciaHTML.focus();
                }
            } else {
                // ===== NUEVA FUNCIONALIDAD: Agregar oferta antes de mostrar mensaje =====
                const datosOferta = {
                    producto: camposFormulario.producto.value.trim(),
                    descripcion: camposFormulario.descripcion.value.trim(),
                    oferta: camposFormulario.oferta.value.trim(),
                    descripcionOferta: camposFormulario.descripcionOferta.value.trim(),
                    condiciones: camposFormulario.condiciones.value.trim(),
                    duracion: camposFormulario.duracion.value.trim()
                };
                
                // Agregar la oferta a las tarjetas
                agregarOferta(datosOferta);
                
                // Si no hay errores: mensaje de éxito y reinicio del formulario
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "La oferta ha sido registrada correctamente y aparece en las ofertas disponibles.",
                        icon: "success",
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continuar'
                    }).then(() => {
                        limpiarCampos();
                    });
                } else {
                    alert("¡Éxito! La oferta ha sido registrada correctamente.");
                    limpiarCampos();
                }
            }
        });
    }
});

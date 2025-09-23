// Referencias a elementos del formulario
const formulario = document.getElementById("formReporte");
const camposFormulario = {
    fecha: document.getElementById("fechaReporte"),
    descripcion: document.getElementById("descripcion"),
    prioridad: document.getElementById("prioridad")
};

// Referencia al contenedor de tarjetas
const contenedorTarjetas = document.querySelector(".contenedor_tarjetas");

// Variable para generar IDs únicos
let contadorID = 1; // Empezamos en 1 porque no hay tarjetas existentes

// Reglas de validación estructuradas
const reglasValidacion = {
    fecha: (campoInput) => {
    const valorIngresado = campoInput.value.trim();
    
    if (!valorIngresado) {
        return "Debe seleccionar una fecha";
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const partesFecha = valorIngresado.split("-");
    const fechaSeleccionada = new Date(
        parseInt(partesFecha[0]), 
        parseInt(partesFecha[1]) - 1, 
        parseInt(partesFecha[2])
    );
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (isNaN(fechaSeleccionada.getTime())) {
        return "La fecha ingresada no es válida";
    }
    
    if (fechaSeleccionada < hoy) {
        return "La fecha no puede ser anterior a hoy";
    }

    return true;
    },
    
    descripcion: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "La descripción es obligatoria";
        }
        
        if (valorIngresado.length > 100) {
            return "La descripción no debe superar los 100 caracteres";
        }
        
        return true;
    },
    
    prioridad: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Debe seleccionar un nivel de prioridad";
        }
        
        return true;
    }
};

// Función para marcar campo con error (sin mostrar texto)
const marcarCampoConError = (elementoInput, tieneError) => {
    if (tieneError) {
        elementoInput.classList.add("error");
        elementoInput.style.borderColor = 'red';
    } else {
        elementoInput.classList.remove('error');
        elementoInput.style.borderColor = '';
    }
};

// Función para validar la selección de visibilidad
const validarSeleccionVisibilidad = () => {
    const visibilidadSeleccionada = document.querySelector('input[name="visibilidad"]:checked');
    return visibilidadSeleccionada ? true : false;
};

// Función para ocultar la tarjeta vacía cuando se agrega el primer reporte
const ocultarTarjetaVacia = () => {
    const tarjetaVacia = document.getElementById('tarjeta-vacia');
    if (tarjetaVacia) {
        tarjetaVacia.style.display = 'none';
    }
};

// Función para mostrar la tarjeta vacía si no hay reportes
const mostrarTarjetaVacia = () => {
    const tarjetaVacia = document.getElementById('tarjeta-vacia');
    const tarjetasReportes = contenedorTarjetas.querySelectorAll('.tarjeta:not(#tarjeta-vacia)');
    
    if (tarjetaVacia && tarjetasReportes.length === 0) {
        tarjetaVacia.style.display = 'block';
    }
};

// Función para crear una nueva tarjeta con los datos del formulario
const crearNuevaTarjeta = (datosReporte) => {
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'tarjeta';
    
    // Formatear el nivel de prioridad
    const prioridadTexto = datosReporte.prioridad.charAt(0).toUpperCase() + datosReporte.prioridad.slice(1);
    const prioridadFormateada = prioridadTexto.replace('nivel', 'Nivel ');
    
    // Formatear la visibilidad
    const visibilidadTexto = datosReporte.visibilidad === 'publico' ? 'Público' : 'Privado';
    
    nuevaTarjeta.innerHTML = `
        <p>
            <strong>ID:</strong> ${String(datosReporte.id).padStart(2, '0')}<br>
            <strong>Descripción:</strong> ${datosReporte.descripcion}<br>
            <strong>Prioridad:</strong> ${prioridadFormateada}<br>
            <strong>Visible:</strong> ${visibilidadTexto}
        </p>
    `;
    
    return nuevaTarjeta;
};

// Función para obtener los datos del formulario
const obtenerDatosFormulario = () => {
    const visibilidadSeleccionada = document.querySelector('input[name="visibilidad"]:checked');
    
    return {
        id: contadorID,
        fecha: camposFormulario.fecha.value,
        descripcion: camposFormulario.descripcion.value.trim(),
        prioridad: camposFormulario.prioridad.value,
        visibilidad: visibilidadSeleccionada ? visibilidadSeleccionada.value : null
    };
};

// Función principal de validación
const ejecutarValidacionCompleta = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;
    
    // Validar visibilidad
    if (!validarSeleccionVisibilidad()) {
        formularioEsValido = false;
        if (!primerErrorEncontrado) {
            primerErrorEncontrado = { mensaje: "Debe seleccionar una opción de visibilidad" };
        }
    }
    
    // Validar campos del formulario
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
    
    // Limpiar selección de visibilidad
    const botonesRadioVisibilidad = document.querySelectorAll('input[name="visibilidad"]');
    botonesRadioVisibilidad.forEach(botonRadio => {
        botonRadio.checked = false;
    });
    
    // Resetear el formulario completo
    formulario.reset();
};

// Función para mostrar la alerta según la visibilidad
const mostrarAlertaVisibilidad = (visibilidad) => {
    const esPrivado = visibilidad === 'privado';
    const titulo = esPrivado ? "Reporte Privado" : "Reporte Público";
    const mensaje = esPrivado 
        ? "Este reporte solo lo puede ver el administrador" 
        : "Se publicó en la vista pública";
    const icono = esPrivado ? "info" : "success";
    const colorBoton = esPrivado ? '#17a2b8' : '#28a745';
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: icono,
            confirmButtonColor: colorBoton,
            confirmButtonText: 'Entendido'
        });
    } else {
        alert(`${titulo}: ${mensaje}`);
    }
};

// Desactivar validaciones HTML5 nativas
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
        // Si no hay errores: obtener datos y crear nueva tarjeta
        const datosReporte = obtenerDatosFormulario();
        
        // Crear y agregar la nueva tarjeta
        const nuevaTarjeta = crearNuevaTarjeta(datosReporte);
        
        // Ocultar la tarjeta vacía al agregar el primer reporte
        ocultarTarjetaVacia();
        
        // Agregar la nueva tarjeta
        contenedorTarjetas.appendChild(nuevaTarjeta);
        
        // Incrementar el contador de ID para el próximo reporte
        contadorID++;
        
        // Mostrar mensaje de éxito
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: "¡Éxito!",
                text: "Tu reporte ha sido enviado correctamente.",
                icon: "success",
                confirmButtonColor: '#28a745',
                confirmButtonText: 'Continuar'
            }).then(() => {
                // Mostrar alerta específica según visibilidad
                mostrarAlertaVisibilidad(datosReporte.visibilidad);
                // Limpiar formulario
                limpiarCampos();
            });
        } else {
            alert("¡Éxito! Tu reporte ha sido enviado correctamente.");
            mostrarAlertaVisibilidad(datosReporte.visibilidad);
            limpiarCampos();
        }
    }
});

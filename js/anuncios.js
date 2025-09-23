// Funciones para manejar localStorage de anuncios
const STORAGE_KEY = 'anuncios_comunitarios';

function guardarAnuncios(anuncios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(anuncios));
}

function cargarAnuncios() {
    const anunciosGuardados = localStorage.getItem(STORAGE_KEY);
    return anunciosGuardados ? JSON.parse(anunciosGuardados) : [];
}

// Variable global para anuncios
let misAnuncios = cargarAnuncios();

// ===== FUNCIONES COMUNES =====
// Función para formatear fecha a dd/mm/yyyy
function formatearFecha(fecha) {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
}

// Función para obtener fecha actual formateada
function obtenerFechaActual() {
    return formatearFecha(new Date());
}

// Función para determinar el estado del anuncio
function determinarEstado(fechaCaducidad) {
    const hoy = new Date();
    const caducidad = new Date(fechaCaducidad.split('/').reverse().join('-')); // Convertir dd/mm/yyyy a yyyy-mm-dd
    
    // Resetear horas para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    caducidad.setHours(0, 0, 0, 0);
    
    if (caducidad < hoy) {
        return 'Vencido';
    } else if (caducidad.getTime() - hoy.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        return 'Por vencer';
    } else {
        return 'Activo';
    }
}

// Función para crear HTML de un anuncio
function crearAnuncioHTML(anuncio, mostrarEstado = true) {
    const estado = determinarEstado(anuncio.fechaCaducidad);
    const claseEstado = estado === 'Vencido' ? 'vencido' : 
                       estado === 'Por vencer' ? 'por-vencer' : 'activo';
    
    const estadoHTML = mostrarEstado ? `<div class="estado_anuncio ${claseEstado}">${estado}</div>` : '';
    
    return `
        <div class="seccion_formulario">
            <div class="anuncio_item">
                <strong>${anuncio.titulo}</strong><br />
                ${anuncio.descripcion}
            </div>
            <div class="anuncio_meta">
                <span>Fecha: ${anuncio.fechaCreacion}</span>
                <span>Caducidad: ${anuncio.fechaCaducidad}</span>
            </div>
            ${estadoHTML}
        </div>
    `;
}

// Función para agregar estilos CSS para los estados de anuncios
function agregarEstilosAnuncios() {
    const estilosAdicionales = `
        <style id="estilos-anuncios">
        .estado_anuncio.activo {
            color: #28a745;
            font-weight: bold;
        }

        .estado_anuncio.por-vencer {
            color: #ffc107;
            font-weight: bold;
        }

        .estado_anuncio.vencido {
            color: #dc3545;
            font-weight: bold;
        }

        .anuncio_item {
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .anuncio_meta {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }

        .anuncio_meta span {
            margin-right: 15px;
        }

        .estado_anuncio {
            font-size: 0.9em;
            text-align: right;
            margin-top: 5px;
        }
        </style>
    `;
    
    // Solo agregar estilos si no existen
    if (!document.getElementById('estilos-anuncios')) {
        document.head.insertAdjacentHTML('beforeend', estilosAdicionales);
    }
}

// ===== FUNCIONES ESPECÍFICAS PARA PÁGINA DE CREAR ANUNCIOS =====
// Función para renderizar "Mis Anuncios" en la página de crear
function renderizarMisAnuncios() {
    const contenedor = document.querySelector('.contenedor_formulario_grande');
    if (!contenedor) return;
    
    const titulo = contenedor.querySelector('.titulo_seccion');
    const botonExpandir = contenedor.querySelector('.boton_expandir');
    
    // Verificar si es la sección "Mis Anuncios"
    if (!titulo || !titulo.textContent.includes('👤 Mis Anuncios')) return;
    
    // Limpiar contenido actual (excepto título y botón expandir)
    contenedor.innerHTML = '';
    contenedor.appendChild(titulo);
    
    if (misAnuncios.length === 0) {
        contenedor.innerHTML += `
            <div class="seccion_formulario">
                <div class="anuncio_item" style="text-align: center; color: #666; font-style: italic;">
                    No tienes anuncios creados aún
                </div>
            </div>
        `;
    } else {
        // Agregar cada anuncio (los más recientes primero)
        misAnuncios.slice().reverse().forEach(anuncio => {
            contenedor.innerHTML += crearAnuncioHTML(anuncio, true);
        });
    }
    
    // Agregar botón expandir al final
    if (botonExpandir) {
        contenedor.appendChild(botonExpandir);
    }
}

// Función para agregar un nuevo anuncio
function agregarAnuncio(titulo, descripcion, fechaCaducidad) {
    const nuevoAnuncio = {
        titulo: titulo,
        descripcion: descripcion,
        fechaCaducidad: formatearFecha(fechaCaducidad),
        fechaCreacion: obtenerFechaActual(),
        id: Date.now() // ID único basado en timestamp
    };
    
    misAnuncios.push(nuevoAnuncio);
    guardarAnuncios(misAnuncios);
    renderizarMisAnuncios();
}

// ===== FUNCIONES ESPECÍFICAS PARA PÁGINA DE ANUNCIOS ACTIVOS =====
// Función para renderizar anuncios comunitarios activos
function renderizarAnunciosActivos() {
    const contenedor = document.querySelector('.contenedor_formulario_grande');
    if (!contenedor) return;
    
    const titulo = contenedor.querySelector('.titulo_seccion');
    const botonExpandir = contenedor.querySelector('.boton_expandir');
    
    // Verificar si es la sección "Anuncios Comunitarios activos"
    if (!titulo || !titulo.textContent.includes('Anuncios Comunitarios activos')) return;
    
    // Filtrar solo anuncios activos (no vencidos)
    const anunciosActivos = misAnuncios.filter(anuncio => {
        const estado = determinarEstado(anuncio.fechaCaducidad);
        return estado !== 'Vencido';
    });
    
    // Limpiar contenido actual (excepto título y botón expandir)
    contenedor.innerHTML = '';
    contenedor.appendChild(titulo);
    
    if (anunciosActivos.length === 0) {
        contenedor.innerHTML += `
            <div class="seccion_formulario">
                <div class="anuncio_item" style="text-align: center; color: #666; font-style: italic;">
                    No hay anuncios activos en este momento
                </div>
            </div>
        `;
    } else {
        // Agregar cada anuncio activo (los más recientes primero)
        anunciosActivos.slice().reverse().forEach(anuncio => {
            contenedor.innerHTML += crearAnuncioHTML(anuncio, false);
        });
    }
    
    // Agregar botón expandir al final
    if (botonExpandir) {
        contenedor.appendChild(botonExpandir);
    }
}

// ===== CÓDIGO ESPECÍFICO PARA FORMULARIO (solo en crear_anuncios.html) =====
// Verificar si estamos en la página de crear anuncios
if (document.getElementById('txtTitulo')) {
    const formulario = document.querySelector(".formulario_principal");
    const btnCrearAnuncio = document.getElementById("btnCrearAnuncio");
    const btnLimpiar = document.getElementById("btnLimpiar");

    const camposFormulario = {
        titulo: document.getElementById("txtTitulo"),
        descripcion: document.getElementById("txtDescripcion"),
        fechaCaducidad: document.getElementById("txtFechaCaducidad")
    };

    //Validaciones
    const reglasValidacion = {
        titulo: (campoInput) => {
            const valorIngresado = campoInput.value.trim();
            if (!valorIngresado) {
                return "Debe ingresar un título para el anuncio";
            }
            if (valorIngresado.length < 5) {
                return "El título debe tener al menos 5 caracteres";
            }
            if (valorIngresado.length > 100) {
                return "El título no puede exceder los 100 caracteres";
            }
            return true;
        },
        descripcion: (campoInput) => {
            const valorIngresado = campoInput.value.trim();
            if (!valorIngresado) {
                return "Debe ingresar una descripción para el anuncio";
            }
            if (valorIngresado.length < 10) {
                return "La descripción debe tener al menos 10 caracteres";
            }
            if (valorIngresado.length > 500) {
                return "La descripción no puede exceder los 500 caracteres";
            }
            return true;
        },
        fechaCaducidad: (campoInput) => {
            const valorIngresado = campoInput.value;
            if (!valorIngresado) {
                return "Debe ingresar una fecha de caducidad";
            }
            const fechaSeleccionada = new Date(valorIngresado);
            const fechaActual = new Date();
            
            // Resetear horas para comparar solo fechas
            fechaSeleccionada.setHours(0, 0, 0, 0);
            fechaActual.setHours(0, 0, 0, 0);
            
            if (isNaN(fechaSeleccionada.getTime())) {
                return "La fecha ingresada no es válida";
            }
            
            // Validar que no sea una fecha pasada
            if (fechaSeleccionada <= fechaActual) {
                return "La fecha de caducidad debe ser futura";
            }
            const fechaMaxima = new Date();
            fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 1);
            if (fechaSeleccionada > fechaMaxima) {
                return "La fecha de caducidad no puede ser mayor a un año";
            }
            
            return true;
        }
    };

    btnCrearAnuncio.addEventListener("click", (eventoClick) => {
        eventoClick.preventDefault();
        const errorEncontrado = ejecutarValidacionCompleta();
        if (errorEncontrado) {
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
            // Agregar anuncio antes de mostrar mensaje
            const titulo = camposFormulario.titulo.value.trim();
            const descripcion = camposFormulario.descripcion.value.trim();
            const fechaCaducidad = camposFormulario.fechaCaducidad.value;
            
            // Agregar el anuncio a "Mis Anuncios"
            agregarAnuncio(titulo, descripcion, fechaCaducidad);
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: "¡Anuncio creado exitosamente!",
                    text: "Su anuncio ha sido enviado a revisión y será publicado una vez aprobado.",
                    icon: "success",
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Continuar' 
                }).then(() => {
                    limpiarCampos();
                });
            } else {
                alert("¡Anuncio creado exitosamente! Su anuncio ha sido enviado a revisión y será publicado una vez aprobado.");
                limpiarCampos();
            }
        }
    });

    btnLimpiar.addEventListener("click", (eventoClick) => {
        eventoClick.preventDefault();
        limpiarCampos();
    });

    //Funcion principal para validar el formulario
    const ejecutarValidacionCompleta = () => {
        let primerErrorEncontrado = null;
        let formularioEsValido = true;

        //Validar campos del formulario
        for (const nombreCampo in reglasValidacion) {
            const elementoCampo = camposFormulario[nombreCampo];

            if (elementoCampo) {
                const resultadoValidacion = reglasValidacion[nombreCampo](elementoCampo);
                
                if (resultadoValidacion !== true) {
                    // Remover estilos de error previos
                    limpiarEstilosError(elementoCampo);
                    formularioEsValido = false;
                    if (!primerErrorEncontrado) {
                        primerErrorEncontrado = { referenciaHTML: elementoCampo, mensaje: resultadoValidacion };
                    }
                } else {
                    // Remover estilos de error si la validación es exitosa
                    limpiarEstilosError(elementoCampo);
                }
            }
        }
        return formularioEsValido ? null : primerErrorEncontrado;
    };

    //Funcion para limpiar estilos de error
    const limpiarEstilosError = (elementoInput) => {
        elementoInput.classList.remove('error');
        elementoInput.style.borderColor = '';
        
        // Eliminar mensaje de error si existe
        const spanError = elementoInput.parentElement.querySelector('.error-message');
        if (spanError) {
            spanError.remove();
        }
    };

    //Funcion para limpiar el formulario
    const limpiarCampos = () => {
        //limpiar los inputs
        Object.values(camposFormulario).forEach(elementoCampo => {
            if (elementoCampo) {
                elementoCampo.value = '';
                limpiarEstilosError(elementoCampo);
            }
        });
    };
}

// ===== INICIALIZACIÓN =====
// Cuando se carga el DOM, inicializar funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS para los anuncios
    agregarEstilosAnuncios();
    
    // Determinar qué página estamos viendo y renderizar apropiadamente
    const titulo = document.querySelector('.titulo_seccion');
    if (titulo) {
        if (titulo.textContent.includes('👤 Mis Anuncios')) {
            // Estamos en la página de crear anuncios
            renderizarMisAnuncios();
        } else if (titulo.textContent.includes('Anuncios Comunitarios activos')) {
            // Estamos en la página de anuncios activos
            renderizarAnunciosActivos();
        }
    }
    
    // Event listener para el botón expandir (si existe)
    const botonExpandir = document.querySelector('.boton_expandir button');
    if (botonExpandir) {
        botonExpandir.addEventListener('click', function() {
            // Funcionalidad opcional para expandir/contraer
            console.log('Botón expandir clickeado');
        });
    }
});

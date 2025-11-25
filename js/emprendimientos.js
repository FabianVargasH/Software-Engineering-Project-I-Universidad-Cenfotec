// Elementos del formulario de crear emprendimiento
const formularioEmprendimiento = document.getElementById("formulario_principal");
const btnCrearEmprendimiento = document.getElementById("btnRegistrarse");

// Elementos del formulario de productos
const formularioProducto = document.getElementById("formulario_principal1");
const btnAgregarProducto = document.getElementById("btnRegistrarse1");

const camposFormularioEmprendimiento = {
    nombreNegocio: document.getElementById("txtNombreCompleto"),
    descripcionNegocio: document.getElementById("descripcion_negocio")
};

const camposFormularioProducto = {
    nombreProducto: document.getElementById("txtNombreCompleto1"),
    descripcionProducto: document.getElementById("descripcion_producto"),
    precio: document.getElementById("precio")
};

// Array para almacenar emprendimientos y productos
let emprendimientos = [];
let productos = [];
let emprendimientoIdCounter = 1;
let productoIdCounter = 1;

// Reglas de validación para crear emprendimiento
const reglasValidacionEmprendimiento = {
    nombreNegocio: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Debe ingresar el nombre del negocio";
        }
        
        if (valorIngresado.length < 3) {
            return "El nombre del negocio debe tener al menos 3 caracteres";
        }
        
        if (valorIngresado.length > 100) {
            return "El nombre del negocio no puede exceder los 100 caracteres";
        }
        
        return true;
    },
    
    descripcionNegocio: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (valorIngresado && valorIngresado.length < 10) {
            return "La descripción debe tener al menos 10 caracteres";
        }
        
        if (valorIngresado.length > 500) {
            return "La descripción no puede exceder los 500 caracteres";
        }
        
        return true;
    }
};

// Reglas de validación para productos
const reglasValidacionProducto = {
    nombreProducto: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Debe ingresar el nombre del producto";
        }
        
        if (valorIngresado.length < 3) {
            return "El nombre del producto debe tener al menos 3 caracteres";
        }
        
        if (valorIngresado.length > 50) {
            return "El nombre del producto no puede exceder los 50 caracteres";
        }
        
        return true;
    },
    
    descripcionProducto: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Debe ingresar la descripción del producto";
        }
        
        if (valorIngresado.length < 20) {
            return "La descripción debe tener al menos 20 caracteres";
        }
        
        if (valorIngresado.length > 300) {
            return "La descripción no puede exceder los 300 caracteres";
        }
        
        return true;
    },
    
    precio: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        
        if (!valorIngresado) {
            return "Debe ingresar el precio del producto";
        }
        
        const precio = parseFloat(valorIngresado);
        
        if (isNaN(precio)) {
            return "El precio debe ser un número válido";
        }
        
        if (precio <= 0) {
            return "El precio debe ser mayor a 0";
        }
        
        return true;
    }
};

// Función para guardar datos en localStorage - CORREGIDA
const guardarDatos = () => {
    try {
        console.log('Guardando datos en localStorage...');
        console.log('Emprendimientos a guardar:', emprendimientos);
        console.log('Productos a guardar:', productos);
        
        localStorage.setItem('emprendimientos', JSON.stringify(emprendimientos));
        localStorage.setItem('productos', JSON.stringify(productos));
        localStorage.setItem('emprendimientoIdCounter', emprendimientoIdCounter.toString());
        localStorage.setItem('productoIdCounter', productoIdCounter.toString());
        
        console.log('Datos guardados exitosamente en localStorage');
        
        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(new CustomEvent('datosActualizados', {
            detail: { emprendimientos, productos }
        }));
        
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
};

// Función para cargar datos desde localStorage - CORREGIDA
const cargarDatosGuardados = () => {
    try {
        console.log('Cargando datos desde localStorage...');
        
        const emprendimientosGuardados = JSON.parse(localStorage.getItem('emprendimientos') || '[]');
        const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]');
        const ultimoIdEmprendimiento = parseInt(localStorage.getItem('emprendimientoIdCounter') || '1');
        const ultimoIdProducto = parseInt(localStorage.getItem('productoIdCounter') || '1');
        
        emprendimientos = emprendimientosGuardados;
        productos = productosGuardados;
        emprendimientoIdCounter = ultimoIdEmprendimiento;
        productoIdCounter = ultimoIdProducto;
        
        console.log('Emprendimientos cargados:', emprendimientos);
        console.log('Productos cargados:', productos);
        
        actualizarSelectsEmprendimiento();
        actualizarListaPublica();
        
        console.log('Datos cargados exitosamente');
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
    }
};

// Función para actualizar los selects de emprendimiento
const actualizarSelectsEmprendimiento = () => {
    const selects = [
        document.querySelector('#formulario_principal1 select'), // Select del formulario de productos
        document.querySelector('.contenedor_formulario:last-child select') // Select de "Mis productos"
    ];

    selects.forEach(select => {
        if (select) {
            // Mantener la opción por defecto
            select.innerHTML = '<option value="" selected disabled>Emprendimiento</option>';
            
            // Agregar los emprendimientos creados
            emprendimientos.forEach(emprendimiento => {
                const option = document.createElement('option');
                option.value = emprendimiento.id;
                option.textContent = emprendimiento.nombre;
                select.appendChild(option);
            });
        }
    });
};

// Función para guardar emprendimiento 
const guardarEmprendimiento = (nombre, descripcion) => {
    console.log('🏢 Creando nuevo emprendimiento...');
    
    const nuevoEmprendimiento = {
        id: emprendimientoIdCounter++,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        fechaCreacion: new Date().toISOString()
    };
    
    emprendimientos.push(nuevoEmprendimiento);
    
    console.log('✅ Emprendimiento creado:', nuevoEmprendimiento);
    
    // IMPORTANTE: Guardar inmediatamente en localStorage
    guardarDatos();
    
    actualizarSelectsEmprendimiento();
    actualizarListaPublica();
    
    return nuevoEmprendimiento;
};

// Función para guardar producto 
const guardarProducto = (emprendimientoId, nombreProducto, descripcionProducto, precio) => {
    console.log('🛍️ Creando nuevo producto...');
    
    const nuevoProducto = {
        id: productoIdCounter++,
        emprendimientoId: parseInt(emprendimientoId),
        nombre: nombreProducto.trim(),
        descripcion: descripcionProducto.trim(),
        precio: parseFloat(precio),
        fechaCreacion: new Date().toISOString(),
        estado: 'Pendiente'
    };
    
    productos.push(nuevoProducto);
    
    console.log('✅ Producto creado:', nuevoProducto);
    
    // IMPORTANTE: Guardar inmediatamente en localStorage
    guardarDatos();
    
    actualizarMisProductos();
    actualizarListaPublica();
    
    return nuevoProducto;
};

// Función para actualizar la sección "Mis productos"
const actualizarMisProductos = () => {
    const selectMisProductos = document.querySelector('.contenedor_formulario:last-child select');
    if (selectMisProductos) {
        // Cuando cambie la selección, renderizar las tarjetas dinámicamente
        selectMisProductos.addEventListener('change', function() {
            // Renderizar tarjetas filtradas por emprendimiento
            renderizarTarjetasMisProductos();
        });

        // Render inicial (por si ya hay una selección)
        renderizarTarjetasMisProductos();
    }
};

// Función para mostrar productos de un emprendimiento específico
const mostrarProductosDeEmprendimiento = (emprendimientoId, textarea) => {
    const productosDelEmprendimiento = productos.filter(p => p.emprendimientoId === emprendimientoId);
    
    if (productosDelEmprendimiento.length === 0) {
        textarea.value = 'No hay productos registrados para este emprendimiento.';
        return;
    }
    
    let contenido = '';
    productosDelEmprendimiento.forEach((producto, index) => {
        if (index > 0) contenido += '\n\n';
        contenido += `[${producto.nombre}]\n`;
        contenido += `${producto.descripcion}\n`;
        contenido += `₡${producto.precio.toLocaleString()}\n`;
        contenido += `Estado: ${producto.estado}`;
    });
    
    textarea.value = contenido;
};

// Función para actualizar la lista pública (para usar en lista_publica.html)
const actualizarListaPublica = () => {
    // Esta función se ejecutará si estamos en la página de lista pública
    const contenedorListaPublica = document.querySelector('.contenedor_formulario_lista_publica .seccion_formulario');
    
    if (contenedorListaPublica) {
        console.log('🔄 Actualizando lista pública desde el archivo principal...');
        
        // Limpiar contenido existente excepto el párrafo y enlace final
        const elementosAConservar = contenedorListaPublica.querySelectorAll('p, a');
        contenedorListaPublica.innerHTML = '';
        
        // Generar textareas con la información de emprendimientos y productos
        emprendimientos.forEach(emprendimiento => {
            const productosDelEmprendimiento = productos.filter(p => p.emprendimientoId === emprendimiento.id);
            
            if (productosDelEmprendimiento.length > 0) {
                productosDelEmprendimiento.forEach(producto => {
                    const textarea = document.createElement('textarea');
                    textarea.className = 'txt_campo_jc';
                    textarea.setAttribute('readonly', true);
                    textarea.setAttribute('rows', '5');
                    
                    const contenido = `[${emprendimiento.nombre}]\n${emprendimiento.descripcion}\n[${producto.nombre}]\n${producto.descripcion}\n₡${producto.precio.toLocaleString()}`;
                    textarea.value = contenido;
                    
                    contenedorListaPublica.appendChild(textarea);
                });
            } else {
                // Mostrar emprendimiento sin productos
                const textarea = document.createElement('textarea');
                textarea.className = 'txt_campo_jc';
                textarea.setAttribute('readonly', true);
                textarea.setAttribute('rows', '5');
                
                const contenido = `[${emprendimiento.nombre}]\n${emprendimiento.descripcion}\n[Sin productos disponibles]\nEste emprendimiento aún no tiene productos registrados.\n`;
                textarea.value = contenido;
                
                contenedorListaPublica.appendChild(textarea);
            }
        });
        
        // Restaurar elementos conservados
        elementosAConservar.forEach(elemento => {
            contenedorListaPublica.appendChild(elemento);
        });
        
        // Si no hay emprendimientos, mostrar mensaje
        if (emprendimientos.length === 0) {
            const textarea = document.createElement('textarea');
            textarea.className = 'txt_campo_jc';
            textarea.setAttribute('readonly', true);
            textarea.setAttribute('rows', '3');
            textarea.value = 'Aún no hay emprendimientos registrados.\n¡Sé el primero en crear uno!';
            contenedorListaPublica.appendChild(textarea);
            
            // Restaurar elementos conservados
            elementosAConservar.forEach(elemento => {
                contenedorListaPublica.appendChild(elemento);
            });
        }
    }
};

// Event listener para el botón de crear emprendimiento
if (btnCrearEmprendimiento) {
    btnCrearEmprendimiento.addEventListener("click", (eventoClick) => {
        eventoClick.preventDefault();
        const errorEncontrado = ejecutarValidacionEmprendimiento();
        
        if (errorEncontrado) {
            // Usar SweetAlert2 para mostrar el error
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
            
            if (errorEncontrado.referenciaHTML) {
                errorEncontrado.referenciaHTML.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorEncontrado.referenciaHTML.focus();
            }
        } else {
            // Guardar emprendimiento
            const nombreNegocio = camposFormularioEmprendimiento.nombreNegocio.value;
            const descripcionNegocio = camposFormularioEmprendimiento.descripcionNegocio.value;
            
            const emprendimientoCreado = guardarEmprendimiento(nombreNegocio, descripcionNegocio);
            
            // Emprendimiento creado exitosamente
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: "¡Emprendimiento creado exitosamente!",
                    text: `"${emprendimientoCreado.nombre}" ha sido registrado y está pendiente de aprobación.`,
                    icon: "success",
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    limpiarCamposEmprendimiento();
                });
            } else {
                alert(`¡Emprendimiento "${emprendimientoCreado.nombre}" creado exitosamente! Está pendiente de aprobación.`);
                limpiarCamposEmprendimiento();
            }
        }
    });
}

// Event listener para el botón de agregar producto
if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener("click", (eventoClick) => {
        eventoClick.preventDefault();
        const errorEncontrado = ejecutarValidacionProducto();
        
        if (errorEncontrado) {
            // Usar SweetAlert2 para mostrar el error
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
            // Guardar producto
            const selectEmprendimiento = document.querySelector('#formulario_principal1 select');
            const emprendimientoId = selectEmprendimiento.value;
            const nombreProducto = camposFormularioProducto.nombreProducto.value;
            const descripcionProducto = camposFormularioProducto.descripcionProducto.value;
            const precio = camposFormularioProducto.precio.value;
            
            const productoCreado = guardarProducto(emprendimientoId, nombreProducto, descripcionProducto, precio);
            
            // Producto agregado exitosamente
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: "¡Producto agregado exitosamente!",
                    text: `"${productoCreado.nombre}" ha sido registrado y está pendiente de aprobación.`,
                    icon: "success",
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    limpiarCamposProducto();
                });
            } else {
                alert(`¡Producto "${productoCreado.nombre}" agregado exitosamente! Está pendiente de aprobación.`);
                limpiarCamposProducto();
            }
        }
    });
}

// Función para mostrar o esconder errores en emprendimientos
const mostrarMensajeErrorEmprendimiento = (elementoInput, mensajeError) => {
    let spanError = elementoInput.parentElement.querySelector('.error-message');
    
    if (!spanError) {
        spanError = document.createElement('span');
        spanError.className = 'error-message';
        spanError.style.color = 'red';
        spanError.style.fontSize = '12px';
        spanError.style.display = 'block';
        spanError.style.marginTop = '5px';
        elementoInput.parentElement.appendChild(spanError);
    }
    
    if (mensajeError) {
        elementoInput.classList.add("error");
        elementoInput.style.borderColor = 'red';
        spanError.textContent = mensajeError;
        spanError.style.display = 'block';
    } else {
        elementoInput.classList.remove('error');
        elementoInput.style.borderColor = '';
        spanError.textContent = '';
        spanError.style.display = 'none';
    }
};

// Función para mostrar o esconder errores en productos
const mostrarMensajeErrorProducto = (elementoInput, mensajeError) => {
    let spanError = elementoInput.parentElement.querySelector('.error-message');
    
    if (!spanError) {
        spanError = document.createElement('span');
        spanError.className = 'error-message';
        spanError.style.color = 'red';
        spanError.style.fontSize = '12px';
        spanError.style.display = 'block';
        spanError.style.marginTop = '5px';
        elementoInput.parentElement.appendChild(spanError);
    }
    
    if (mensajeError) {
        elementoInput.classList.add("error");
        elementoInput.style.borderColor = 'red';
        spanError.textContent = mensajeError;
        spanError.style.display = 'block';
    } else {
        elementoInput.classList.remove('error');
        elementoInput.style.borderColor = '';
        spanError.textContent = '';
        spanError.style.display = 'none';
    }
};

// Función principal para validar el formulario de emprendimiento
const ejecutarValidacionEmprendimiento = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;

    // Validar campos del formulario de emprendimiento
    for (const nombreCampo in reglasValidacionEmprendimiento) {
        const elementoCampo = camposFormularioEmprendimiento[nombreCampo];

        if (elementoCampo) {
            const resultadoValidacion = reglasValidacionEmprendimiento[nombreCampo](elementoCampo);
            
            if (resultadoValidacion !== true) {
                mostrarMensajeErrorEmprendimiento(elementoCampo, resultadoValidacion);
                formularioEsValido = false;
                if (!primerErrorEncontrado) {
                    primerErrorEncontrado = { referenciaHTML: elementoCampo, mensaje: resultadoValidacion };
                }
            } else {
                mostrarMensajeErrorEmprendimiento(elementoCampo, null);
            }
        }
    }
    
    return formularioEsValido ? null : primerErrorEncontrado;
};

// Función para validar el dropdown de emprendimiento
const validarSeleccionEmprendimiento = () => {
    const selectEmprendimiento = document.querySelector('#formulario_principal1 select');
    if (!selectEmprendimiento) return true;
    
    const contenedorSelect = selectEmprendimiento.parentElement;
    let contenedorError = contenedorSelect.querySelector('.error-message');

    if (!contenedorError) {
        contenedorError = document.createElement('div');
        contenedorError.className = 'error-message';
        contenedorError.style.color = '#e74c3c';
        contenedorError.style.fontSize = '12px';
        contenedorError.style.marginTop = '5px';
        contenedorSelect.appendChild(contenedorError);
    }

    if (!selectEmprendimiento.value || selectEmprendimiento.value === "") {
        contenedorError.textContent = 'Debe seleccionar un emprendimiento';
        contenedorError.style.display = 'block';
        selectEmprendimiento.style.borderColor = 'red';
        return false;
    } else {
        contenedorError.textContent = '';
        contenedorError.style.display = 'none';
        selectEmprendimiento.style.borderColor = '';
        return true;
    }
};

// Función principal para validar el formulario de productos
const ejecutarValidacionProducto = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;

    // Validar selección de emprendimiento
    if (!validarSeleccionEmprendimiento()) {
        formularioEsValido = false;
        if (!primerErrorEncontrado) {
            primerErrorEncontrado = { mensaje: "Debe seleccionar un emprendimiento" };
        }
    }

    // Validar campos del formulario de productos
    for (const nombreCampo in reglasValidacionProducto) {
        const elementoCampo = camposFormularioProducto[nombreCampo];

        if (elementoCampo) {
            const resultadoValidacion = reglasValidacionProducto[nombreCampo](elementoCampo);
            
            if (resultadoValidacion !== true) {
                mostrarMensajeErrorProducto(elementoCampo, resultadoValidacion);
                formularioEsValido = false;
                if (!primerErrorEncontrado) {
                    primerErrorEncontrado = { referenciaHTML: elementoCampo, mensaje: resultadoValidacion };
                }
            } else {
                mostrarMensajeErrorProducto(elementoCampo, null);
            }
        }
    }
    
    return formularioEsValido ? null : primerErrorEncontrado;
};

// Función para limpiar el formulario de emprendimiento
const limpiarCamposEmprendimiento = () => {
    // Limpiar los inputs
    Object.values(camposFormularioEmprendimiento).forEach(elementoCampo => {
        if (elementoCampo) {
            elementoCampo.value = '';
            mostrarMensajeErrorEmprendimiento(elementoCampo, null);
        }
    });
};

// Función para limpiar el formulario de productos
const limpiarCamposProducto = () => {
    // Limpiar los inputs
    Object.values(camposFormularioProducto).forEach(elementoCampo => {
        if (elementoCampo) {
            if (elementoCampo.type === 'number') {
                elementoCampo.value = '0.000';
            } else {
                elementoCampo.value = '';
            }
            mostrarMensajeErrorProducto(elementoCampo, null);
        }
    });

    // Limpiar selección de emprendimiento
    const selectEmprendimiento = document.querySelector('#formulario_principal1 select');
    if (selectEmprendimiento) {
        selectEmprendimiento.selectedIndex = 0;
        selectEmprendimiento.style.borderColor = '';
        
        // Limpiar error del select
        const contenedorError = selectEmprendimiento.parentElement.querySelector('.error-message');
        if (contenedorError) {
            contenedorError.style.display = 'none';
        }
    }
};

// Funcionalidad para el botón "Eliminar" en la sección "Mis productos"
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema de emprendimientos...');
    
    // Cargar datos guardados al inicio
    cargarDatosGuardados();
    
    // Configurar contadores de caracteres
    const nombreProductoInput = document.getElementById("txtNombreCompleto1");
    const descripcionProductoInput = document.getElementById("descripcion_producto");
    
    // Actualizar placeholder con contador para nombre del producto
    if (nombreProductoInput) {
        nombreProductoInput.addEventListener('input', function() {
            const longitudActual = this.value.length;
            this.placeholder = `${longitudActual}/50 caracteres`;
        });
    }
    
    // Actualizar placeholder con contador para descripción
    if (descripcionProductoInput) {
        descripcionProductoInput.addEventListener('input', function() {
            const longitudActual = this.value.length;
            this.placeholder = `${longitudActual}/300 caracteres`;
        });
    }
    
    // Configurar la sección "Mis productos"
    actualizarMisProductos();

    // Render inicial de tarjetas en la sección "Mis productos"
    renderizarTarjetasMisProductos();
    
    // Botón eliminar
    const btnEliminar = document.querySelector('.btn_secundario');
    const textareaMisProductos = document.querySelector('.contenedor_formulario:last-child textarea[readonly]');
    const selectMisProductos = document.querySelector('.contenedor_formulario:last-child select');
    
    if (btnEliminar && textareaMisProductos && selectMisProductos) {
        btnEliminar.addEventListener('click', function() {
            const emprendimientoId = parseInt(selectMisProductos.value);
            
            if (!emprendimientoId) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Selecciona un emprendimiento',
                        text: "Primero debes seleccionar un emprendimiento para eliminar sus productos",
                        icon: 'warning',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    alert('Primero debes seleccionar un emprendimiento para eliminar sus productos');
                }
                return;
            }
            
            // Usar SweetAlert2 para confirmar la eliminación
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción eliminará todos los productos del emprendimiento seleccionado",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc3545',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Eliminar productos del emprendimiento seleccionado
                        const productosIniciales = productos.length;
                        productos = productos.filter(p => p.emprendimientoId !== emprendimientoId);
                        const productosEliminados = productosIniciales - productos.length;
                        
                        // Guardar cambios
                        guardarDatos();
                        
                        // Limpiar el textarea
                        textareaMisProductos.value = '';
                        
                        // Actualizar la lista pública
                        actualizarListaPublica();
                        
                        // Mostrar mensaje de éxito
                        Swal.fire({
                            title: '¡Eliminados!',
                            text: `Se eliminaron ${productosEliminados} producto(s) del emprendimiento.`,
                            icon: 'success',
                            confirmButtonColor: '#28a745'
                        });
                    }
                });
            } else {
                // Fallback si no hay SweetAlert2
                if (confirm('¿Estás seguro de que quieres eliminar todos los productos del emprendimiento seleccionado?')) {
                    const productosIniciales = productos.length;
                    productos = productos.filter(p => p.emprendimientoId !== emprendimientoId);
                    const productosEliminados = productosIniciales - productos.length;
                    
                    guardarDatos();
                    textareaMisProductos.value = '';
                    actualizarListaPublica();
                    alert(`Se eliminaron ${productosEliminados} producto(s) del emprendimiento.`);
                }
            }
        });
    }

    // Validación en tiempo real para el select de emprendimiento
    const selectEmprendimiento = document.querySelector('#formulario_principal1 select');
    if (selectEmprendimiento) {
        selectEmprendimiento.addEventListener('change', function() {
            if (this.value) {
                const contenedorError = this.parentElement.querySelector('.error-message');
                if (contenedorError) {
                    contenedorError.style.display = 'none';
                }
                this.style.borderColor = '';
            }
        });
    }
});

// Renderizar tarjetas dinámicamente en el contenedor #misProductosGrid
function renderizarTarjetasMisProductos() {
    const grid = document.getElementById('misProductosGrid');
    if (!grid) return;

    // Limpiar grid
    grid.innerHTML = '';

    // Obtener emprendimiento seleccionado en la sección "Mis productos"
    const selectMis = document.querySelector('.contenedor_formulario:last-child select');
    const emprendimientoId = selectMis ? parseInt(selectMis.value) : null;

    // Filtrar productos a mostrar
    let productosAMostrar = productos;
    if (emprendimientoId) {
        productosAMostrar = productos.filter(p => p.emprendimientoId === emprendimientoId);
    }

    if (productosAMostrar.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'No se encontraron productos para este emprendimiento.';
        aviso.style.color = '#6B7280';
        grid.appendChild(aviso);
        return;
    }

    productosAMostrar.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.style.width = '48%';
        tarjeta.style.minWidth = '260px';
        tarjeta.style.boxSizing = 'border-box';
        tarjeta.style.padding = '18px';
        tarjeta.style.textAlign = 'left';

        tarjeta.innerHTML = `
            <h3>${escapeHtml(producto.nombre)}</h3>
            <p style="color:#6B7280; margin:8px 0;">${escapeHtml(producto.descripcion)}</p>
            <p style="font-weight:700; color:#111827; margin:6px 0;">Precio: <span style="color:#1E3A8A;">₡${producto.precio.toLocaleString()}</span></p>
            <p style="margin:6px 0; color:#374151;">Condición: ${escapeHtml(producto.estado || 'Pendiente')}</p>
            <div style="margin-top:12px; display:flex; gap:12px; justify-content:center;">
                <button class="btn_primario" style="width:45%;" data-id="${producto.id}">Editar</button>
                <button class="btn_secundario" style="width:45%;" data-id="${producto.id}">Eliminar</button>
            </div>
        `;

        // Delegar eventos en los botones
        const btnEditar = tarjeta.querySelector('.btn_primario');
        const btnEliminar = tarjeta.querySelector('.btn_secundario');

        btnEditar.addEventListener('click', () => handleEditarProducto(producto.id));
        btnEliminar.addEventListener('click', () => handleEliminarProducto(producto.id));

        grid.appendChild(tarjeta);
    });
}

// Manejar edición de producto
function handleEditarProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    // Usar SweetAlert2 si está disponible para un formulario bonito
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Editar producto',
            html:
                `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${escapeHtml(producto.nombre)}">` +
                `<textarea id="swal-desc" class="swal2-textarea" placeholder="Descripción">${escapeHtml(producto.descripcion)}</textarea>` +
                `<input id="swal-precio" class="swal2-input" placeholder="Precio" value="${producto.precio}">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value.trim();
                const desc = document.getElementById('swal-desc').value.trim();
                const precio = parseFloat(document.getElementById('swal-precio').value);

                if (!nombre || nombre.length < 3) {
                    Swal.showValidationMessage('Nombre debe tener al menos 3 caracteres');
                    return false;
                }
                if (!desc || desc.length < 10) {
                    Swal.showValidationMessage('Descripción debe tener al menos 10 caracteres');
                    return false;
                }
                if (isNaN(precio) || precio <= 0) {
                    Swal.showValidationMessage('Precio debe ser un número mayor a 0');
                    return false;
                }

                return { nombre, desc, precio };
            }
        }).then(result => {
            if (result.isConfirmed && result.value) {
                producto.nombre = result.value.nombre;
                producto.descripcion = result.value.desc;
                producto.precio = result.value.precio;

                guardarDatos();
                renderizarTarjetasMisProductos();
                actualizarListaPublica();

                Swal.fire('Guardado', 'El producto ha sido actualizado.', 'success');
            }
        });
    } else {
        // Fallback: usar prompts
        const nuevoNombre = prompt('Nombre', producto.nombre);
        if (nuevoNombre === null) return;
        const nuevaDesc = prompt('Descripción', producto.descripcion);
        if (nuevaDesc === null) return;
        const nuevoPrecio = prompt('Precio', producto.precio);
        if (nuevoPrecio === null) return;

        const precioNum = parseFloat(nuevoPrecio);
        if (!nuevoNombre || nuevoNombre.length < 3 || !nuevaDesc || nuevaDesc.length < 10 || isNaN(precioNum) || precioNum <= 0) {
            alert('Datos inválidos. Operación cancelada.');
            return;
        }

        producto.nombre = nuevoNombre.trim();
        producto.descripcion = nuevaDesc.trim();
        producto.precio = precioNum;

        guardarDatos();
        renderizarTarjetasMisProductos();
        actualizarListaPublica();
        alert('Producto actualizado');
    }
}

// Manejar eliminación de producto
function handleEliminarProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: `Se eliminará "${producto.nombre}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                productos = productos.filter(p => p.id !== productoId);
                guardarDatos();
                renderizarTarjetasMisProductos();
                actualizarListaPublica();
                Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            }
        });
    } else {
        if (confirm(`¿Eliminar "${producto.nombre}"?`)) {
            productos = productos.filter(p => p.id !== productoId);
            guardarDatos();
            renderizarTarjetasMisProductos();
            actualizarListaPublica();
            alert('Producto eliminado');
        }
    }
}

// Util: escapar HTML en strings para evitar inyección simple
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Validación en tiempo real para remover errores cuando el usuario corrige
Object.values(camposFormularioEmprendimiento).forEach(campo => {
    if (campo) {
        campo.addEventListener('input', function() {
            const nombreCampo = Object.keys(camposFormularioEmprendimiento).find(key => camposFormularioEmprendimiento[key] === campo);
            if (nombreCampo && reglasValidacionEmprendimiento[nombreCampo]) {
                const resultado = reglasValidacionEmprendimiento[nombreCampo](campo);
                if (resultado === true) {
                    mostrarMensajeErrorEmprendimiento(campo, null);
                }
            }
        });
    }
});

// Validación en tiempo real para formulario de productos
Object.values(camposFormularioProducto).forEach(campo => {
    if (campo) {
        campo.addEventListener('input', function() {
            const nombreCampo = Object.keys(camposFormularioProducto).find(key => camposFormularioProducto[key] === campo);
            if (nombreCampo && reglasValidacionProducto[nombreCampo]) {
                const resultado = reglasValidacionProducto[nombreCampo](campo);
                if (resultado === true) {
                    mostrarMensajeErrorProducto(campo, null);
                }
            }
        });
    }
});

// Funciones auxiliares para debugging (disponibles en la consola)
window.exportarDatos = function() {
    console.log('📤 Exportando datos actuales...');
    const datos = {
        emprendimientos: emprendimientos,
        productos: productos,
        emprendimientoIdCounter: emprendimientoIdCounter,
        productoIdCounter: productoIdCounter
    };
    console.log('📊 Datos exportados:', datos);
    return datos;
};

window.importarDatos = function(datos) {
    console.log('📥 Importando datos...');
    if (datos.emprendimientos) emprendimientos = datos.emprendimientos;
    if (datos.productos) productos = datos.productos;
    if (datos.emprendimientoIdCounter) emprendimientoIdCounter = datos.emprendimientoIdCounter;
    if (datos.productoIdCounter) productoIdCounter = datos.productoIdCounter;
    
    actualizarSelectsEmprendimiento();
    actualizarListaPublica();
    guardarDatos();
    
    console.log('Datos importados exitosamente');
};

window.limpiarTodosLosDatos = function() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los emprendimientos y productos?')) {
        emprendimientos = [];
        productos = [];
        emprendimientoIdCounter = 1;
        productoIdCounter = 1;
        
        actualizarSelectsEmprendimiento();
        actualizarListaPublica();
        guardarDatos();
        
        console.log('🗑️ Todos los datos han sido eliminados');
        alert('Todos los datos han sido eliminados.');
    }
};

window.verEstadoActual = function() {
    console.log('=== ESTADO ACTUAL DEL SISTEMA ===');
    console.log('Emprendimientos:', emprendimientos);
    console.log('Productos:', productos);
    console.log('Contador emprendimientos:', emprendimientoIdCounter);
    console.log('Contador productos:', productoIdCounter);
    console.log('localStorage emprendimientos:', localStorage.getItem('emprendimientos'));
    console.log('localStorage productos:', localStorage.getItem('productos'));
    return {
        emprendimientos,
        productos,
        emprendimientoIdCounter,
        productoIdCounter,
        localStorage: {
            emprendimientos: localStorage.getItem('emprendimientos'),
            productos: localStorage.getItem('productos')
        }
    };
};


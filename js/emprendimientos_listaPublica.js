// Variables para almacenar los datos
let emprendimientos = [];
let productos = [];

// Función para cargar datos desde localStorage
const cargarDatosGuardados = () => {
    try {
        console.log('Intentando cargar datos desde localStorage...');
        
        const emprendimientosGuardados = localStorage.getItem('emprendimientos');
        const productosGuardados = localStorage.getItem('productos');
        
        console.log('Datos en localStorage - emprendimientos:', emprendimientosGuardados);
        console.log('Datos en localStorage - productos:', productosGuardados);
        
        if (emprendimientosGuardados) {
            emprendimientos = JSON.parse(emprendimientosGuardados);
        }
        
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
        }
        
        console.log('Emprendimientos cargados:', emprendimientos);
        console.log('Productos cargados:', productos);
        
        actualizarListaPublica();
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
        mostrarMensajeSinDatos();
    }
};

// Función para limpiar completamente la sección antes de cargar datos
const limpiarSeccionCompleta = () => {
    const contenedorListaPublica = document.querySelector('.contenedor_formulario_lista_publica .seccion_formulario');
    
    if (contenedorListaPublica) {
        // Conservar solo el párrafo y enlace del final
        const parrafo = contenedorListaPublica.querySelector('p.enlace_navegacion');
        const enlace = contenedorListaPublica.querySelector('a.enlace_navegacion');
        
        // Limpiar todo el contenido
        contenedorListaPublica.innerHTML = '';
        
        // Restaurar solo los elementos de navegación
        if (parrafo) contenedorListaPublica.appendChild(parrafo);
        if (enlace) contenedorListaPublica.appendChild(enlace);
        
        console.log('🧹 Sección limpiada completamente');
    }
};

// Función para actualizar la lista pública
const actualizarListaPublica = () => {
    console.log('Actualizando lista pública...');
    
    const contenedorListaPublica = document.querySelector('.contenedor_formulario_lista_publica .seccion_formulario');
    
    if (!contenedorListaPublica) {
        console.error('No se encontró el contenedor de lista pública');
        return;
    }
    
    // Limpiar completamente antes de actualizar
    limpiarSeccionCompleta();
    
    // Obtener referencias actualizadas después de limpiar
    const parrafo = contenedorListaPublica.querySelector('p.enlace_navegacion');
    
    // Si no hay emprendimientos, mostrar mensaje
    if (!emprendimientos || emprendimientos.length === 0) {
        console.log('No hay emprendimientos para mostrar');
        mostrarMensajeSinDatos();
        return;
    }
    
    console.log(`Mostrando ${emprendimientos.length} emprendimientos`);
    
    // Generar textareas con la información de emprendimientos y productos
    emprendimientos.forEach((emprendimiento, index) => {
        console.log(`Procesando emprendimiento ${index + 1}:`, emprendimiento);
        
        const productosDelEmprendimiento = productos.filter(p => p.emprendimientoId === emprendimiento.id);
        console.log(`Productos encontrados para emprendimiento ${emprendimiento.id}:`, productosDelEmprendimiento);
        
        if (productosDelEmprendimiento.length > 0) {
            // Mostrar cada producto del emprendimiento
            productosDelEmprendimiento.forEach((producto, prodIndex) => {
                console.log(`Creando textarea para producto ${prodIndex + 1}:`, producto);
                const textarea = crearTextareaEmprendimiento(emprendimiento, producto);
                // Insertar antes del párrafo
                if (parrafo) {
                    contenedorListaPublica.insertBefore(textarea, parrafo);
                } else {
                    contenedorListaPublica.appendChild(textarea);
                }
            });
        } else {
            // Mostrar emprendimiento sin productos
            console.log('Creando textarea para emprendimiento sin productos');
            const textarea = crearTextareaEmprendimientoSinProductos(emprendimiento);
            // Insertar antes del párrafo
            if (parrafo) {
                contenedorListaPublica.insertBefore(textarea, parrafo);
            } else {
                contenedorListaPublica.appendChild(textarea);
            }
        }
    });
    
    console.log('Lista pública actualizada exitosamente');
};

// Función para crear textarea con información del emprendimiento y producto
const crearTextareaEmprendimiento = (emprendimiento, producto) => {
    console.log('Creando card para:', { emprendimiento, producto });
    
    const card = document.createElement('div');
    card.className = 'emprendimiento-card';
    
    // Crear header del emprendimiento
    const header = document.createElement('div');
    header.className = 'emprendimiento-header';
    header.innerHTML = `
        <div class="emprendimiento-nombre">${emprendimiento.nombre}</div>
        <div class="emprendimiento-categoria">${emprendimiento.categoria || 'Sin categoría'}</div>
    `;
    
    // Crear sección de información del emprendimiento
    const infoSection = document.createElement('div');
    infoSection.className = 'emprendimiento-info';
    infoSection.innerHTML = `
        <div class="info-item">
            <div class="info-label">Descripción</div>
            <div class="info-value">${emprendimiento.descripcion || 'Sin descripción disponible'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Ubicación</div>
            <div class="info-value">${emprendimiento.ubicacion || 'No especificada'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Horario</div>
            <div class="info-value">${emprendimiento.horario || 'No especificado'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Contacto</div>
            <div class="info-value">${emprendimiento.contacto || 'No disponible'}</div>
        </div>
    `;
    
    // Crear sección de producto
    const productoSection = document.createElement('div');
    productoSection.className = 'producto-section';
    productoSection.innerHTML = `
        <div class="producto-title">Producto Destacado</div>
        <div class="producto-details">
            <div class="producto-item">
                <div class="producto-label">Nombre</div>
                <div class="info-value">${producto.nombre}</div>
            </div>
            <div class="producto-item">
                <div class="producto-label">Precio</div>
                <div class="info-value">₡${producto.precio.toLocaleString('es-CR')}</div>
            </div>
            <div class="producto-item" style="grid-column: span 2;">
                <div class="producto-label">Descripción</div>
                <div class="info-value">${producto.descripcion || 'Sin descripción'}</div>
            </div>
        </div>
    `;
    
    // Ensamblar la tarjeta
    card.appendChild(header);
    card.appendChild(infoSection);
    card.appendChild(productoSection);
    
    return card;
};

// Función para crear textarea de emprendimiento sin productos
const crearTextareaEmprendimientoSinProductos = (emprendimiento) => {
    const card = document.createElement('div');
    card.className = 'emprendimiento-card';
    
    // Crear header del emprendimiento
    const header = document.createElement('div');
    header.className = 'emprendimiento-header';
    header.innerHTML = `
        <div class="emprendimiento-nombre">${emprendimiento.nombre}</div>
        <div class="emprendimiento-categoria">${emprendimiento.categoria || 'Sin categoría'}</div>
    `;
    
    // Crear sección de información del emprendimiento
    const infoSection = document.createElement('div');
    infoSection.className = 'emprendimiento-info';
    infoSection.innerHTML = `
        <div class="info-item">
            <div class="info-label">Descripción</div>
            <div class="info-value">${emprendimiento.descripcion || 'Sin descripción disponible'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Ubicación</div>
            <div class="info-value">${emprendimiento.ubicacion || 'No especificada'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Horario</div>
            <div class="info-value">${emprendimiento.horario || 'No especificado'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Contacto</div>
            <div class="info-value">${emprendimiento.contacto || 'No disponible'}</div>
        </div>
    `;
    
    // Mensaje de no productos
    const noProductosSection = document.createElement('div');
    noProductosSection.className = 'producto-section';
    noProductosSection.innerHTML = `
        <div class="producto-title" style="color: #6B7280;">No hay productos registrados</div>
    `;
    
    // Ensamblar la tarjeta
    card.appendChild(header);
    card.appendChild(infoSection);
    card.appendChild(noProductosSection);
    
    return card;
};

// Función para mostrar mensaje cuando no hay datos
const mostrarMensajeSinDatos = () => {
    const contenedorListaPublica = document.querySelector('.contenedor_formulario_lista_publica .seccion_formulario');
    const parrafo = contenedorListaPublica?.querySelector('p.enlace_navegacion');
    
    if (contenedorListaPublica) {
        // Buscar si ya existe un mensaje de "sin datos" para evitar duplicados
        const mensajeExistente = contenedorListaPublica.querySelector('div[data-sin-datos="true"]');
        if (mensajeExistente) {
            return; // Ya existe el mensaje
        }
        
        // Crear tarjeta de mensaje
        const mensajeCard = document.createElement('div');
        mensajeCard.className = 'emprendimiento-card';
        mensajeCard.setAttribute('data-sin-datos', 'true');
        mensajeCard.style.textAlign = 'center';
        mensajeCard.style.padding = '40px 20px';
        
        mensajeCard.innerHTML = `
            <div class="emprendimiento-nombre" style="color: #6B7280; margin-bottom: 20px;">
                No hay emprendimientos registrados
            </div>
            <p style="color: #4B5563; margin-bottom: 20px;">
                ¡Sé el primero en crear uno!
            </p>
            <p style="color: #6B7280; font-size: 0.9rem;">
                Ve a "Creación de Emprendimientos" para comenzar
            </p>
        `;
        
        // Insertar antes del párrafo si existe
        if (parrafo) {
            contenedorListaPublica.insertBefore(mensajeCard, parrafo);
        } else {
            contenedorListaPublica.appendChild(mensajeCard);
        }
    }
};

// Función para escuchar cambios en localStorage (para actualizaciones en tiempo real)
const escucharCambiosLocalStorage = () => {
    // Escuchar eventos de storage (cuando otra pestaña modifica localStorage)
    window.addEventListener('storage', function(e) {
        if (e.key === 'emprendimientos' || e.key === 'productos') {
            console.log('Detectado cambio en localStorage:', e.key);
            cargarDatosGuardados();
        }
    });
    
    // También verificar periódicamente por cambios (útil para la misma pestaña)
    setInterval(() => {
        const emprendimientosActuales = localStorage.getItem('emprendimientos');
        const productosActuales = localStorage.getItem('productos');
        
        const emprendimientosString = JSON.stringify(emprendimientos);
        const productosString = JSON.stringify(productos);
        
        if (emprendimientosActuales !== emprendimientosString || 
            productosActuales !== productosString) {
            console.log('Detectados cambios en los datos, recargando...');
            cargarDatosGuardados();
        }
    }, 2000); // Verificar cada 2 segundos
};

// Función para refrescar manualmente los datos
const refrescarDatos = () => {
    console.log('Refrescando datos manualmente...');
    cargarDatosGuardados();
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO LISTA PÚBLICA DE EMPRENDIMIENTOS ===');
    console.log('Página cargada, inicializando...');
    
    // Verificar que el contenedor existe
    const contenedor = document.querySelector('.contenedor_formulario_lista_publica .seccion_formulario');
    if (!contenedor) {
        console.error('ERROR: No se encontró el contenedor de lista pública');
        return;
    }
    
    console.log('Contenedor encontrado:', contenedor);
    
    // Cargar y mostrar datos
    cargarDatosGuardados();
    
    // Iniciar listener para cambios
    escucharCambiosLocalStorage();
    
    // Agregar botón de refresco para debugging (opcional)
    if (window.location.search.includes('debug=true')) {
        const btnRefresh = document.createElement('button');
        btnRefresh.textContent = 'Refrescar Datos';
        btnRefresh.style.position = 'fixed';
        btnRefresh.style.top = '10px';
        btnRefresh.style.right = '10px';
        btnRefresh.style.zIndex = '9999';
        btnRefresh.onclick = refrescarDatos;
        document.body.appendChild(btnRefresh);
    }
});

// Funciones auxiliares para debugging (disponibles en la consola)
window.verDatos = function() {
    console.log('=== ESTADO ACTUAL DE LOS DATOS ===');
    console.log('Emprendimientos en memoria:', emprendimientos);
    console.log('Productos en memoria:', productos);
    console.log('Emprendimientos en localStorage:', localStorage.getItem('emprendimientos'));
    console.log('Productos en localStorage:', localStorage.getItem('productos'));
    return { 
        emprendimientos, 
        productos,
        localStorage: {
            emprendimientos: localStorage.getItem('emprendimientos'),
            productos: localStorage.getItem('productos')
        }
    };
};

window.limpiarListaPublica = function() {
    console.log('Limpiando lista pública manualmente...');
    limpiarSeccionCompleta();
    mostrarMensajeSinDatos();
};

window.forzarActualizacion = function() {
    console.log('Forzando actualización de la lista pública...');
    cargarDatosGuardados();
};

// Exportar funciones principales para uso global
window.refrescarListaPublica = refrescarDatos;
window.cargarDatosEmprendimientos = cargarDatosGuardados;
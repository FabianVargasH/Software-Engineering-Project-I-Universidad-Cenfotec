// variables
let lugares = []; // almacena los lugares registrados
let marcadores = []; // almacena los marcadores en el mapa
let mapa;
let datosTemporales = null;
let marcadorSeleccionado = null; // Para resaltar el marcador buscado

// Referencias para la búsqueda
const inputBusqueda = document.getElementById("buscar-lugar");
const btnBuscar = document.getElementById("btn-buscar");

// Referencias al formulario
const inputNombre = document.getElementById("Nombre del marcador");
const inputTipo = document.getElementById("Tipo de marcador");
const inputFecha = document.getElementById("fecha");
const inputDescripcion = document.getElementById("Descripcion");
const btn_enviar = document.getElementById("btn_enviar");

// Configurar el select personalizado
const selectPersonalizado = document.querySelector('.select-personalizado');
const selectSeleccionado = selectPersonalizado.querySelector('.select-seleccionado');
const selectOpciones = selectPersonalizado.querySelector('.select-opciones');
const inputHidden = document.getElementById('Tipo de marcador');

// Función para cerrar el select cuando se hace clic fuera
document.addEventListener('click', (e) => {
  if (!selectPersonalizado.contains(e.target)) {
    selectPersonalizado.classList.remove('abierto');
  }
});

// Abrir/cerrar el menú de opciones
selectSeleccionado.addEventListener('click', () => {
  selectPersonalizado.classList.toggle('abierto');
});

// Manejar la selección de opciones
selectOpciones.addEventListener('click', (e) => {
  const opcion = e.target.closest('.select-opcion');
  if (!opcion) return;

  const valor = opcion.dataset.value;
  const texto = opcion.querySelector('strong').textContent;
  
  // Actualizar el texto mostrado
  selectSeleccionado.querySelector('span').textContent = texto;
  
  // Actualizar el valor del input hidden
  inputHidden.value = valor;
  
  // Cerrar el menú
  selectPersonalizado.classList.remove('abierto');
});

// Permitir navegación con teclado
selectSeleccionado.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectPersonalizado.classList.toggle('abierto');
  }
});

// Referencia a la tabla
const tabla = document.getElementById("tabla-lugares");

// Límites de Costa Rica
const costaRicaBounds = {
  north: 11.2167, // Límite norte
  south: 8.0333,  // Límite sur
  east: -82.5556, // Límite este
  west: -85.9506  // Límite oeste
};

// Inicializar el mapa
function inicializarMapa() {
  mapa = L.map("mapa", {
    center: [9.93, -84.08], // Centro de Costa Rica
    zoom: 8,
    minZoom: 7, // Evita que se aleje demasiado
    maxZoom: 18,
    maxBounds: [
      [costaRicaBounds.south - 0.5, costaRicaBounds.west - 0.5], // Añadimos un pequeño margen
      [costaRicaBounds.north + 0.5, costaRicaBounds.east + 0.5]
    ]
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapa);

  // Dibuja el rectángulo de Costa Rica (opcional, para visualizar los límites)
  L.rectangle([
    [costaRicaBounds.south, costaRicaBounds.west],
    [costaRicaBounds.north, costaRicaBounds.east]
  ], {
    color: "#5093e6",
    weight: 2,
    fill: false,
    dashArray: '5, 10'
  }).addTo(mapa);

  mapa.on("click", onMapaClick);

  // Configurar eventos de búsqueda
  btnBuscar.addEventListener("click", buscarLugar);
  inputBusqueda.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      buscarLugar();
    }
  });
}

// Función para buscar lugares
async function buscarLugar() {
  const termino = inputBusqueda.value.trim();
  
  if (termino === "") {
    alert("Por favor, ingrese un lugar para buscar");
    return;
  }

  try {
    // Agregar ", Costa Rica" a la búsqueda para mejorar la precisión
    const consulta = `${termino}, Costa Rica`;
    
    // Usar el servicio de geocodificación de Nominatim
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(consulta)}&countrycodes=cr&limit=1`);
    const data = await response.json();

    if (data && data.length > 0) {
      const lugar = data[0];
      const lat = parseFloat(lugar.lat);
      const lng = parseFloat(lugar.lon);

      // Verificar si el lugar está dentro de Costa Rica
      if (estaDentroDeCR(lat, lng)) {
        // Crear un marcador temporal para mostrar la ubicación
        if (marcadorSeleccionado) {
          mapa.removeLayer(marcadorSeleccionado);
        }

        marcadorSeleccionado = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(mapa);

        // Agregar un popup con la información del lugar
        marcadorSeleccionado.bindPopup(`
          <strong>${lugar.display_name.split(',')[0]}</strong><br>
          <small>${lugar.display_name}</small><br>
          <button onclick="agregarMarcadorAqui(${lat}, ${lng})" class="btn-agregar-marcador">
            Agregar marcador aquí
          </button>
        `).openPopup();

        // Centrar el mapa en la ubicación encontrada
        mapa.setView([lat, lng], 16);
      } else {
        alert("El lugar encontrado está fuera de Costa Rica. Por favor, sea más específico en su búsqueda.");
      }
    } else {
      alert("No se encontró el lugar. Intente con una búsqueda más específica.");
    }
  } catch (error) {
    console.error('Error al buscar el lugar:', error);
    alert("Hubo un error al buscar el lugar. Por favor, intente de nuevo.");
  }
}

// Función para agregar un marcador en la ubicación encontrada
function agregarMarcadorAqui(lat, lng) {
  // Limpiar el marcador temporal de búsqueda
  if (marcadorSeleccionado) {
    mapa.removeLayer(marcadorSeleccionado);
    marcadorSeleccionado = null;
  }

  // Simular un clic en el mapa en esta ubicación
  const e = { latlng: { lat: lat, lng: lng } };
  onMapaClick(e);
}

// Función para crear el icono del marcador según el tipo
function crearIconoMarcador(tipo) {
  const colores = {
    'comercio': 'blue',
    'servicios': 'green',
    'eventos': 'orange',
    'comunidad': 'violet'
  };

  const color = colores[tipo.toLowerCase()] || 'blue';

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Registrar datos y esperar el click
function registrarLugar() {
  const nombre = inputNombre.value;
  const tipo = inputTipo.value;
  const fecha = inputFecha.value;
  const descripcion = inputDescripcion.value;

  // Verificar si estamos editando o creando
  if (btn_enviar.dataset.editando === "true") {
    const index = parseInt(btn_enviar.dataset.editIndex);
    const lugar = lugares[index];
    
    // Actualizar los datos del lugar
    lugar.nombre = nombre;
    lugar.tipo = tipo;
    lugar.fecha = fecha;
    lugar.descripcion = descripcion;

    // Actualizar el marcador en el mapa
    marcadores[index].setPopupContent(
      `<strong>${lugar.nombre}</strong><br>(${lugar.tipo})<br>${lugar.fecha}<br>${lugar.descripcion}`
    );

    // Actualizar la tabla
    mostrarLugares();

    // Resetear el formulario
    limpiarFormulario();
    btn_enviar.textContent = "Agregar Marcador";
    btn_enviar.dataset.editando = "false";
    delete btn_enviar.dataset.editIndex;

  } else if (nombre && tipo && fecha && descripcion) {
    datosTemporales = { nombre, tipo, fecha, descripcion };
    alert("¡Por favor, haga click en el mapa para registrar el marcador!");
  }
}

// Función para verificar si un punto está dentro de Costa Rica
function estaDentroDeCR(lat, lng) {
  return lat >= costaRicaBounds.south &&
         lat <= costaRicaBounds.north &&
         lng >= costaRicaBounds.west &&
         lng <= costaRicaBounds.east;
}

// Click en el mapa
function onMapaClick(e) {
  if (!datosTemporales) return;

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  if (!estaDentroDeCR(lat, lng)) {
    alert("Por favor, seleccione un punto dentro del territorio de Costa Rica.");
    return;
  }

  const lugar = {
    nombre: datosTemporales.nombre,
    tipo: datosTemporales.tipo,
    fecha: datosTemporales.fecha,
    descripcion: datosTemporales.descripcion,
    lat: lat,
    lng: lng
  };

  lugares.push(lugar);
  agregarMarcador(lugar);
  mostrarLugares();

  datosTemporales = null;
  limpiarFormulario();
}

// Crear marcador en el mapa
function agregarMarcador(lugar) {
  const marcador = L.marker([lugar.lat, lugar.lng])
    .addTo(mapa)
    .bindPopup(
      `<strong>${lugar.nombre}</strong><br>(${lugar.tipo})<br>${lugar.fecha}<br>${lugar.descripcion}`
    );
  marcadores.push(marcador);
}

// Mostrar los lugares en la tabla
function mostrarLugares() {
  tabla.innerHTML = "";

  for (let i = 0; i < lugares.length; i++) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${lugares[i].nombre}</td>
      <td>${lugares[i].tipo}</td>
      <td>${lugares[i].fecha}</td>
      <td>${lugares[i].descripcion}</td>
      <td>
        <button type="button" data-accion="ver" data-index="${i}" class="btn_secundario">Ver</button>
        <button type="button" data-accion="editar" data-index="${i}" class="btn_secundario">Editar</button>
        <button type="button" data-accion="eliminar" data-index="${i}" class="btn_secundario">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  }
}

// Limpiar el formulario
function limpiarFormulario() {
  inputNombre.value = "";
  inputTipo.value = "";
  inputFecha.value = "";
  inputDescripcion.value = "";
}

// Eliminar lugar
function eliminarLugar(index) {
  lugares.splice(index, 1);
  mapa.removeLayer(marcadores[index]);
  marcadores.splice(index, 1);
  mostrarLugares();
}

//clicks en botones de la tabla
tabla.addEventListener("click", (eventoTabla) => {
  const boton = eventoTabla.target;

  if (boton.tagName !== "BUTTON") return;

  const accion = boton.dataset.accion;
  const index = parseInt(boton.dataset.index);

  switch (accion) {
    case "eliminar":
      eliminarLugar(index);
      break;
    case "ver":
      verLugar(index);
      break;
    case "editar":
      editarLugar(index);
      break;
  }
});

// Función para ver un lugar en el mapa
function verLugar(index) {
  const lugar = lugares[index];
  mapa.setView([lugar.lat, lugar.lng], 16);
  marcadores[index].openPopup();

  // Resaltar el marcador temporalmente
  const iconoOriginal = marcadores[index].getIcon();
  marcadores[index].setIcon(L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }));

  // Volver al icono original después de 3 segundos
  setTimeout(() => {
    marcadores[index].setIcon(iconoOriginal);
  }, 3000);
}

// Función para editar un lugar
function editarLugar(index) {
  const lugar = lugares[index];
  
  // Llenar el formulario con los datos actuales
  inputNombre.value = lugar.nombre;
  inputTipo.value = lugar.tipo;
  inputFecha.value = lugar.fecha;
  inputDescripcion.value = lugar.descripcion;
  
  // Cambiar el botón de enviar
  btn_enviar.textContent = "Actualizar Marcador";
  btn_enviar.dataset.editando = "true";
  btn_enviar.dataset.editIndex = index;

  // Hacer scroll al formulario
  document.querySelector('.contenedor_formulario').scrollIntoView({ behavior: 'smooth' });
}

btn_enviar.addEventListener("click", registrarLugar);

// Inicializar el mapa al cargar la página
inicializarMapa();
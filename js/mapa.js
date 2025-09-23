// variables
let lugares = []; // almacena los lugares registrados
let marcadores = []; // almacena los marcadores en el mapa
let mapa;
let datosTemporales = null;

// Referencias al formulario
const inputNombre = document.getElementById("Nombre del marcador");
const inputTipo = document.getElementById("Tipo de marcador");
const inputFecha = document.getElementById("fecha");
const inputDescripcion = document.getElementById("Descripcion");
const btn_enviar = document.getElementById("btn_enviar");

// Referencia a la tabla
const tabla = document.getElementById("tabla-lugares");

// Inicializar el mapa
function inicializarMapa() {
  mapa = L.map("mapa").setView([9.93, -84.08], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapa);

  mapa.on("click", onMapaClick);
}

// Registrar datos y esperar el click
function registrarLugar() {
  const nombre = inputNombre.value;
  const tipo = inputTipo.value;
  const fecha = inputFecha.value;
  const descripcion = inputDescripcion.value;

  if (nombre && tipo && fecha && descripcion) {
    datosTemporales = { nombre, tipo, fecha, descripcion };
    alert("¡Por favor, haga click en el mapa para registrar el marcador!");
  }
}

// Click en el mapa
function onMapaClick(e) {
  if (!datosTemporales) return;

  const lugar = {
    nombre: datosTemporales.nombre,
    tipo: datosTemporales.tipo,
    fecha: datosTemporales.fecha,
    descripcion: datosTemporales.descripcion,
    lat: e.latlng.lat,
    lng: e.latlng.lng
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

  if (accion === "eliminar") eliminarLugar(index);
});

btn_enviar.addEventListener("click", registrarLugar);

// Inicializar el mapa al cargar la página
inicializarMapa();
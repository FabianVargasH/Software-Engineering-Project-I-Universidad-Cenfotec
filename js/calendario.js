// --- Debug rápido: confirmar que axios está listo
console.log('[calendario.js] cargado. axios?', typeof axios !== 'undefined' ? 'OK' : 'NO');

// --- Helpers globales (fuera del DOMContentLoaded) ---

// Normaliza fechas si algún día viniera MM/DD/YYYY (ahora usas YYYY-MM-DD)
function toISODate(fechaStr) {
  if (!fechaStr) return fechaStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return fechaStr;
  const m = fechaStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;
  return fechaStr;
}

// Mapea documentos de la DB -> eventos de FullCalendar (SOLO aprobados)
function mapToFullCalendar(dbEventos) {
  return dbEventos
    .filter(e => e.estado === 'aprobado')
    .map(e => {
      const fechaISO = toISODate(e.fecha);
      const start = e.hora ? `${fechaISO}T${e.hora}` : fechaISO;
      return {
        id: e._id,
        title: e.titulo,
        start,
        extendedProps: {
          ubicacion: e.ubicacion,
          descripcion: e.descripcion
        }
      };
    });
}

// API calls
async function apiGetEventos() {
  const { data } = await axios.get('/api/eventos', {
    headers: { 'Cache-Control': 'no-cache' },
    params: { t: Date.now() } // rompe caché del navegador
  });
  console.log('[GET /api/eventos] items:', Array.isArray(data) ? data.length : 'N/A');
  return data;
}

async function apiPostEvento(payload) {
  return axios.post('/api/eventos', payload);
}

// Refrescar el calendario desde la API
async function refreshCalendar(calendar) {
  const data = await apiGetEventos();
  const eventos = mapToFullCalendar(data);
  calendar.removeAllEvents();
  calendar.addEventSource(eventos);
}


// ----------------- App -----------------
document.addEventListener("DOMContentLoaded", async function () {
  // Esperar a SweetAlert2 si hace falta
  const esperarSweetAlert = () =>
    new Promise((resolve) => {
      if (typeof Swal !== 'undefined') resolve();
      else setTimeout(() => esperarSweetAlert().then(resolve), 100);
    });

  await esperarSweetAlert();
  console.log("SweetAlert2 cargado correctamente");

  const calendarEl = document.getElementById("calendario");

  // Cargar eventos iniciales
  let eventosIniciales = [];
  try {
    const data = await apiGetEventos();
    eventosIniciales = mapToFullCalendar(data);
  } catch (err) {
    console.error('Error cargando eventos iniciales:', err);
  }

  // Instanciar calendario
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,listMonth"
    },
    events: eventosIniciales,
    eventClick: function (info) {
      Swal.fire({
        title: info.event.title,
        html: `
          <div style="text-align: left;">
            <p><strong>Inicio:</strong> ${info.event.start ? info.event.start.toLocaleString() : '—'}</p>
            <p><strong>Ubicación:</strong> ${info.event.extendedProps.ubicacion || '—'}</p>
            <p><strong>Descripción:</strong> ${(info.event.extendedProps.descripcion || '').replace(/\n/g,'<br>')}</p>
          </div>
        `,
        icon: "info",
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Cerrar'
      });
    }
  });

  calendar.render();

  // ----- Validaciones y submit del formulario -----
  const form = document.getElementById("formEvento");

  const reglasValidacion = {
    titulo: (v) => {
      const x = v.trim();
      if (!x) return "Debe ingresar un título para el evento";
      if (x.length < 5) return "El título debe tener al menos 5 caracteres";
      if (x.length > 100) return "El título no puede exceder 100 caracteres";
      return true;
    },
    fecha: (v) => v ? true : "Debe seleccionar una fecha para el evento",
    hora: (v) => {
      if (!v) return "Debe seleccionar una hora para el evento";
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(v)) return "La hora debe estar en formato 24 horas (HH:MM)";
      return true;
    },
    ubicacion: (v) => {
      const x = v.trim();
      if (!x) return "Debe ingresar una ubicación para el evento";
      if (x.length < 10) return "La ubicación debe tener al menos 10 caracteres";
      if (x.length > 200) return "La ubicación no puede exceder 200 caracteres";
      return true;
    },
    descripcion: (v) => {
      const x = v.trim();
      if (!x) return "Debe ingresar una descripción para el evento";
      if (x.length < 20) return "La descripción debe tener al menos 20 caracteres";
      if (x.length > 500) return "La descripción no puede exceder 500 caracteres";
      return true;
    }
  };

  const validarFormulario = () => {
    const titulo = document.getElementById("titulo").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const descripcion = document.getElementById("descripcion").value;

    const checks = [
      ['titulo', titulo],
      ['fecha', fecha],
      ['hora', hora],
      ['ubicacion', ubicacion],
      ['descripcion', descripcion],
    ];

    for (const [campo, valor] of checks) {
      const r = reglasValidacion[campo](valor);
      if (r !== true) return r;
    }

    const fechaEvento = new Date(`${fecha}T${hora}`);
    if (fechaEvento <= new Date()) {
      return "La fecha debe ser posterior a la fecha y hora actual";
    }

    // Conflicto local (con lo ya cargado)
    const hayConflicto = calendar.getEvents().some(ev => {
      const mismaFecha = ev.start && ev.start.toISOString().slice(0,16) === fechaEvento.toISOString().slice(0,16);
      const mismaUbicacion = (ev.extendedProps.ubicacion || '').toLowerCase() === ubicacion.trim().toLowerCase();
      return mismaFecha && mismaUbicacion;
    });
    if (hayConflicto) {
      return "Ya existe un evento programado en ese lugar y hora. Por favor elige otro horario o ubicación";
    }

    return true;
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const valid = validarFormulario();
    if (valid !== true) {
      Swal.fire({ title: "Error en el formulario", text: valid, icon: "error", confirmButtonColor: '#dc3545' });
      return;
    }

    const payload = {
      titulo: document.getElementById("titulo").value.trim(),
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      ubicacion: document.getElementById("ubicacion").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim()
    };

    try {
      await apiPostEvento(payload); // queda 'pendiente' en el backend
      await Swal.fire({ title: "¡Evento enviado!", text: "Su evento ha sido enviado para aprobación exitosamente.", icon: "success" });
      form.reset();

      // El calendario muestra SOLO aprobados; aparecerá cuando lo aprueben
      await refreshCalendar(calendar);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.mensaje || 'No se pudo guardar el evento';
      Swal.fire({ title: "Error", text: msg, icon: "error", confirmButtonColor: '#dc3545' });
    }
  };
});

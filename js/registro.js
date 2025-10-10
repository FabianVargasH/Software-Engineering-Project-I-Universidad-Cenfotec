const formulario = document.querySelector(".formulario_principal");
const btnRegistrarse = document.getElementById("btnRegistrarse");
const btnLimpiar = document.getElementById("btnLimpiar");

const camposFormulario = {
    nombre: document.getElementById("txtNombreCompleto"),
    telefono: document.getElementById("txtTelefono"),
    fechaNacimiento: document.getElementById("txtFechaNacimiento"),
    email: document.getElementById("txtCorreoElectronico"),
    password: document.getElementById("txtContrasenna")
}

//Validaciones
const reglasValidacion = {
    nombre: (campoInput) => {
        const valorIngresado = campoInput.value.trim(); //trim para quitar lo de los espacios en blanco y caracteres especiales
        const palabrasEncontradas = valorIngresado.split(/\s+/).filter(palabra => palabra.length > 0);
        if (!valorIngresado) {
            return "Debe digitar su nombre completo";
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valorIngresado)) {
            return "El nombre solo puede contener letras y espacios.";
        }
        if (palabrasEncontradas.length < 2) {
            return "Debe ingresar al menos 2 palabras (Nombre/Apellido)";
        }
        return true;
    },
    //validación para telefono
    telefono: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "Debe digitar su número completo";
        }
        //Con esto quitamos los guiones del numero
        const solamenteNumeros = valorIngresado.replace(/-/g, '');
        if (!/^\d{8}$/.test(solamenteNumeros)) {
            return "El teléfono debe tener 8 dígitos y solamente números";
        }
        return true;
    },
    //validacion para la fecha de nacimiento
    fechaNacimiento: (campoInput) => {
        const valorIngresado = campoInput.value;
    if (!valorIngresado) {
        return "Debes ingresar tu fecha de nacimiento";
    }
    const fechaSeleccionada = new Date(valorIngresado);
    const fechaActual = new Date();
    const fechaLimiteAntigua = new Date(fechaActual.getFullYear() - 120, fechaActual.getMonth(), fechaActual.getDate());
    
    if (isNaN(fechaSeleccionada.getTime())) {
        return "La fecha ingresada no es válida";
    }
    
    // Validar que no sea una fecha futura
    if (fechaSeleccionada > fechaActual) {
        return "La fecha de nacimiento digitada es futura";
    }
    
    // Validar que no sea muy antigua (más de 120 años)
    if (fechaSeleccionada < fechaLimiteAntigua) {
        return "La fecha de nacimiento no es válida por su longevidad";
    }
    
    return true;
    },
    //Validaciones para el correo
    email: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "Debes ingresar un correo electrónico";
        }
        //Validacion de los caracteres del correo
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorIngresado)) {
            return "El formato del correo electrónico no es válido";
        }
        return true;
    },
    //Validaciones para la contraseña
    password: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "Debes ingresar una contraseña";
        }
        if (valorIngresado.length < 8) {
            return "La contraseña debe tener un mínimo de 8 caracteres";
        }
        if (!/[A-Z]/.test(valorIngresado)) {
            return "La contraseña debe tener al menos 1 letra mayúscula";
        }
        if (!/[!@#$%^&*()_\-+=?<>{}[\]|\\:";'.,/~`]/.test(valorIngresado)) {
            return "La contraseña debe contener al menos 1 carácter especial";
        }
        return true;
    }
};
const obtenerTipoUsuario = () => {
    const tipoSeleccionado = document.querySelector('input[name="tipo_usuario_seleccionado"]:checked');
    return tipoSeleccionado ? tipoSeleccionado.value : null;
};

btnRegistrarse.addEventListener("click", (eventoClick) => {
    eventoClick.preventDefault();
    const errorEncontrado = ejecutarValidacionCompleta();
    if (errorEncontrado) {
        // Usar SweetAlert2 para que se vea más bonito
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
        // Obtener datos del formulario
        const tipoUsuario = obtenerTipoUsuario();
        const nombreCompleto = camposFormulario.nombre.value.trim();
        const telefono = camposFormulario.telefono.value.trim();
        const fechaNacimiento = camposFormulario.fechaNacimiento.value;
        const correoElectronico = camposFormulario.email.value.trim();
        const contrasenna = camposFormulario.password.value;

        // Llamar función para registrar usuario
        registrar_usuario(
            tipoUsuario,
            nombreCompleto,
            telefono,
            fechaNacimiento,
            correoElectronico,
            contrasenna
        );
    }
});

//Funcion para mostrar o esconder errores
const mostrarMensajeError = (elementoInput, mensajeError) => {
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

//Funcion para validar el tipo de usuario seleccionado
const validarSeleccionTipoUsuario = () => {
    const tipoUsuarioSeleccionado = document.querySelector('input[name="tipo_usuario_seleccionado"]:checked');
    const contenedorSeleccionUsuario = document.querySelector('.seccion_formulario');
    let contenedorError = contenedorSeleccionUsuario.querySelector('.error-message');

    if (!contenedorError) {
        contenedorError = document.createElement('div');
        contenedorError.className = 'error-message';
        contenedorError.style.color = '#e74c3c';
        contenedorError.style.fontSize = '12px';
        contenedorError.style.marginTop = '10px';
        contenedorSeleccionUsuario.appendChild(contenedorError);
    }
    if (!tipoUsuarioSeleccionado) {
        contenedorError.textContent = 'Debe seleccionar un tipo de usuario';
        contenedorError.style.display = 'block';
        return false;
    } else {
        contenedorError.textContent = '';
        contenedorError.style.display = 'none';
        return true;
    }
};

//Funcion principal para validar el formulario
const ejecutarValidacionCompleta = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;

    //Validar tipo de usuario
    if (!validarSeleccionTipoUsuario()) {
        formularioEsValido = false;
        if (!primerErrorEncontrado) {
            primerErrorEncontrado = { mensaje: "Debe seleccionar un tipo de usuario" };
        }
    }
    //Validar campos del formulario
    for (const nombreCampo in reglasValidacion) {
        const elementoCampo = camposFormulario[nombreCampo];

        if (elementoCampo) {
            const resultadoValidacion = reglasValidacion[nombreCampo](elementoCampo);
            
            if (resultadoValidacion !== true) {
                mostrarMensajeError(elementoCampo, resultadoValidacion);
                formularioEsValido = false;
                if (!primerErrorEncontrado) {
                    primerErrorEncontrado = { referenciaHTML: elementoCampo, mensaje: resultadoValidacion };
                }
            } else {
                mostrarMensajeError(elementoCampo, null);
            }
        }
    }
    return formularioEsValido ? null : primerErrorEncontrado;
};

//Funcion para limpiar el formulario
const limpiarCampos = () => {
    //Limpiar campos del formulario
    Object.values(camposFormulario).forEach(elementoCampo => {
        if (elementoCampo) {
            elementoCampo.value = '';
            mostrarMensajeError(elementoCampo, null);
        }
    });

    //Limpiar selección de tipo de usuario
    const botonesRadioTipoUsuario = document.querySelectorAll('input[name="tipo_usuario_seleccionado"]');
    botonesRadioTipoUsuario.forEach(botonRadio => {
        botonRadio.checked = false;
    });
    
    //Limpiar error de tipo de usuario
    const contenedorSeleccionUsuario = document.querySelector('.seccion_formulario');
    const contenedorErrorTipoUsuario = contenedorSeleccionUsuario.querySelector('.error-message');
    if (contenedorErrorTipoUsuario) {
        contenedorErrorTipoUsuario.style.display = 'none';
    }
    
    //Limpiar el color resaltado al seleccionar una opcion
    document.querySelectorAll('.tarjeta').forEach(tarjeta => {
        tarjeta.style.backgroundColor = '';
        tarjeta.style.borderColor = '';
    });
}

btnLimpiar.addEventListener("click", limpiarCampos);

// Función básica para marcar la opción seleccionada
document.querySelectorAll('input[name="tipo_usuario_seleccionado"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Quitar marca de todas las tarjetas
        document.querySelectorAll('.tarjeta').forEach(tarjeta => {
            tarjeta.style.backgroundColor = '';
            tarjeta.style.borderColor = '';
        });
        // Marcar la tarjeta seleccionada
        if (this.checked) {
            this.nextElementSibling.style.backgroundColor = '#60A5FA';
            this.nextElementSibling.style.borderColor = '#1E3A8A';
        }
    });
});

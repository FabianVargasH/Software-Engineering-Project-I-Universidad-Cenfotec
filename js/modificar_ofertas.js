// Referencias a elementos del formulario
const formulario = document.getElementById("formModificarOferta");
const camposFormulario = {
    emprendimiento: document.getElementById("selectEmprendimiento"),
    producto: document.getElementById("selectProducto"),
    nuevoDescuento: document.getElementById("txtNuevoDescuento"),
    descripcion: document.getElementById("txtDescripcion"),
    condiciones: document.getElementById("txtCondiciones"),
    duracion: document.getElementById("txtDuracion")
};

// Reglas de validación estructuradas
const reglasValidacion = {
    emprendimiento: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "Debe seleccionar un emprendimiento";
        }
        return true;
    },

    producto: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "Debe seleccionar un producto";
        }
        return true;
    },

    nuevoDescuento: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "El nuevo descuento es obligatorio";
        }
        if (valorIngresado.length < 2) {
            return "El descuento debe tener al menos 2 caracteres";
        }
        if (valorIngresado.length > 30) {
            return "El descuento debe tener máximo 30 caracteres";
        }
        return true;
    },

    descripcion: (campoInput) => {
        const valorIngresado = campoInput.value.trim();
        if (!valorIngresado) {
            return "La descripción es obligatoria";
        }
        if (valorIngresado.length < 10) {
            return "La descripción debe tener al menos 10 caracteres";
        }
        if (valorIngresado.length > 150) {
            return "La descripción debe tener máximo 150 caracteres";
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

        // Extraer número del texto (por ejemplo: "5 días")
        const numeroEncontrado = valorIngresado.match(/\d+/);
        if (!numeroEncontrado) {
            return "La duración debe contener al menos un número";
        }

        const duracionNum = parseInt(numeroEncontrado[0]);
        if (isNaN(duracionNum)) {
            return "La duración debe incluir un número válido";
        }
        if (duracionNum < 1) {
            return "La duración debe ser mayor a 0";
        }
        if (duracionNum > 365) {
            return "La duración no puede ser mayor a 365 días";
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

// Función principal de validación
const ejecutarValidacionCompleta = () => {
    let primerErrorEncontrado = null;
    let formularioEsValido = true;

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
    Object.values(camposFormulario).forEach(elementoCampo => {
        if (elementoCampo) {
            elementoCampo.value = '';
            marcarCampoConError(elementoCampo, false);
        }
    });

    formulario.reset();
    document.querySelectorAll(".error-message").forEach(msg => msg.remove());
    document.querySelectorAll(".txt_campo").forEach(campo => campo.style.borderColor = "");
};

// Desactivar validaciones HTML5 nativas
formulario.setAttribute('novalidate', 'true');

// Event listener principal del formulario
formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

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

        if (errorEncontrado.referenciaHTML) {
            errorEncontrado.referenciaHTML.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorEncontrado.referenciaHTML.focus();
        }
    } else {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: "¡Modificación exitosa!",
                text: "Los datos han sido actualizados correctamente.",
                icon: "success",
                confirmButtonColor: '#28a745',
                confirmButtonText: 'Continuar'
            }).then(() => {
                limpiarCampos();
            });
        } else {
            alert("¡Éxito! Los datos han sido actualizados correctamente.");
            limpiarCampos();
        }
    }
});

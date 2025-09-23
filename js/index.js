
// Variables globales
let slideActual = 0;
let totalSlides = 0;

// Función principal que se ejecuta cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const carouselSlides = document.getElementById('carouselSlides');
    const anteriorBtn = document.getElementById('anteriorBtn');
    const siguienteBtn = document.getElementById('siguienteBtn');
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Verificar que los elementos existan (Validar)
    if (!carouselSlides || !anteriorBtn || !siguienteBtn || slides.length === 0) {
        console.error('No se encontraron los elementos del carrusel');
        return;
    }
    
    totalSlides = slides.length;
    
    // Función para mostrar slide
    function mostrarSlide(index) {
        slideActual = index;
        const desplazamiento_horizontal = -slideActual * 100;
        carouselSlides.style.transform = `translateX(${desplazamiento_horizontal}%)`; //Se aplica una transformacion de forma horizontal
    }
    
    // Función para ir a la siguiente slide
    function siguienteSlide() {
        slideActual++;
        if (slideActual >= totalSlides) {
            slideActual = 0;
        }
        mostrarSlide(slideActual);
    }
    
    // Función para ir a la slide anterior
    function slideAnterior() {
        slideActual--;
        if (slideActual < 0) {
            slideActual = totalSlides - 1;
        }
        mostrarSlide(slideActual);
    }
    
    // Función para mostrar alerta de registro
    function mostrarAlertaRegistro() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¡Regístrate para continuar!',
                text: 'Debes registrarte para acceder a más contenido de la comunidad',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Registrarse',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirigir a la página de registro
                    window.location.href = './paginas/registro/registro.html';
                }
            });
        } else {
            // Fallback si SweetAlert no está disponible
            const confirmar = confirm('Debes registrarte para acceder a más contenido. ¿Quieres ir a la página de registro?');
            if (confirmar) {
                window.location.href = './paginas/registro/registro.html';
            }
        }
    }
    
    // Agregar event listeners a los enlaces del carousel
    const enlacesCarousel = document.querySelectorAll('.slide-text');
    enlacesCarousel.forEach(enlace => {
        enlace.addEventListener('click', function(evento) {
            evento.preventDefault(); // Prevenir la navegación por defecto
            mostrarAlertaRegistro();
        });
    });
    
    // Event listeners para los botones de navegación del carousel
    siguienteBtn.addEventListener('click', function() {
        siguienteSlide();
    });
    
    anteriorBtn.addEventListener('click', function() {
        slideAnterior();
    });
    
    // Inicializar carrusel
    mostrarSlide(0);
    console.log('Carrusel iniciado con validación de registro');
});
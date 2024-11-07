document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('entrarBtn').addEventListener('click', login);
    document.getElementById('password').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    });

    document.getElementById('fileInput').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            document.getElementById('cedulaContainer').classList.remove('hidden');
        } else {
            document.getElementById('cedulaContainer').classList.add('hidden');
        }
    });

    document.getElementById('buscarBtn').addEventListener('click', buscarPersona);
    document.getElementById('regresarBtn').addEventListener('click', function() {
        document.getElementById('cedulaContainer').classList.add('hidden');
        document.getElementById('fileInput').value = ''; // Reiniciar el input de archivo
        document.getElementById('resultado').classList.add('hidden');
    });

    document.getElementById('generateBtn').addEventListener('click', generarConstancia);

    document.getElementById('regresarConstanciaBtn').addEventListener('click', function() {
        document.getElementById('constanciaContainer').classList.add('hidden');
        document.getElementById('formContainer').classList.remove('hidden');
    });
});

function login() {
    const passwordInput = document.getElementById('password').value;
    if (passwordInput === 'Incess2024') {
        document.getElementById('formContainer').classList.remove('hidden');
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('passwordError').classList.add('hidden');
    } else {
        document.getElementById('passwordError').classList.remove('hidden');
    }
}

let personas = []; // Almacena los datos del CSV

function buscarPersona() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const cedulaInput = document.getElementById('cedulaInput').value.trim();

    if (!file) {
        alert('Por favor, selecciona un archivo CSV.');
        return;
    }

    if (!cedulaInput) {
        alert('Por favor, ingrese una Cédula o ID.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = event.target.result;
        const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
        personas = parsed.data;

        const persona = personas.find(p => p['Cedula'] === cedulaInput);
        if (persona) {
            document.getElementById('resultado').textContent = `Persona encontrada: ${persona['Nombre']} ${persona['Apellido']}`;
            document.getElementById('resultado').classList.remove('hidden');
            document.getElementById('generateBtn').classList.remove('hidden');
        } else {
            alert('No se encontró una persona con esa Cédula o ID.');
            document.getElementById('resultado').classList.add('hidden');
            document.getElementById('generateBtn').classList.add('hidden');
        }
    };

    reader.readAsText(file);
}

function generarConstancia() {
    const cedulaInput = document.getElementById('cedulaInput').value.trim();
    const persona = personas.find(p => p['Cedula'] === cedulaInput);

    if (persona) {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        const docWidth = doc.internal.pageSize.getWidth();
        const docHeight = doc.internal.pageSize.getHeight();

        // Configurar la fuente a Times New Roman
        doc.setFont("times", "normal");

        // --- ENCABEZADO --- 
        // Coloca aquí la ruta de tu imagen de encabezado
        const encabezadoRuta = 'images/imagen1.jpeg';  // Reemplaza con la ruta de tu imagen
        doc.addImage(encabezadoRuta, 'JPEG', margin, margin, docWidth - (2 * margin), 30); // Ajusta el tamaño y la posición

        // Título de la constancia (centrado y más cerca del texto)
        doc.setFontSize(18);
        doc.text('CONSTANCIA', docWidth / 2, margin + 40, { align: 'center' });  // Ajusté el título para que esté más cerca del texto

        // --- TEXTO DE LA CONSTANCIA ---
        const texto = `
        La Coordinación del Centro de Formación Socialista Carora, INCES Región-Lara hace constar, por medio de la presente, que el (a) ciudadano (a): ${persona['Nombre']} ${persona['Apellido']}, Portador(a) de la Cédula de Identidad V-${persona['Cedula']}, participó en la formación de la Unidad Curricular: ${persona['Determinacion de Formacion'] || 'No disponible'}, con una duración de ${persona['Horas']} horas, con fecha de inicio el: ${persona['Fecha de Inicio']} y fecha de término el: ${persona['Fecha de Cierre']}.
        
        Constancia que se expide a petición de parte interesada en el Municipio Torres,               Parroquia Trinidad Samuel,   Estado Lara a los 22 días del mes de mayo 2024.
        
                                                                  Atentamente,
                                                                  Jesus Campos
                                                                  Jefe de Centro
                         Según el orden administrativo N OA-2024-02-29 de fecha 15-02-2024
        `;

        // Ajustar el texto en la página
        doc.setFontSize(12);  // Tamaño de fuente para el texto
        const lines = doc.splitTextToSize(texto, docWidth - 2 * margin);
        let yOffset = margin + 70; // Empezamos un poco más abajo del margen superior (ajustado por el título)

        lines.forEach(line => {
            doc.text(line, margin, yOffset);
            yOffset += 10;
        });

        // --- PIE DE PÁGINA ---
        // Coloca aquí la ruta de tu imagen de pie de página
        const piePaginaRuta = 'images/imagen2.jpeg';  // Reemplaza con la ruta de tu imagen
        doc.addImage(piePaginaRuta, 'JPEG', margin, docHeight - margin - 30, docWidth - (2 * margin), 20); // Ajusta el tamaño y la posición

        // Guardar el PDF
        doc.save(`constancia_${persona['Nombre']}_${persona['Apellido']}.pdf`);
    } else {
        alert("No se ha encontrado la persona. Por favor, verifica la cédula.");
    }
}






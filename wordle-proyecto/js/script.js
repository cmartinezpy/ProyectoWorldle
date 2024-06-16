document.addEventListener('DOMContentLoaded', () => {

    var palabra_objetivo  = '';
    const maxIntentos       = 6;
    let count_intentos      = 0;

    const gameBoard       = document.getElementById('GameBoard');
    const input_adivinar  = document.getElementById('input_adivinar');
    const button_adivinar = document.getElementById('button_adivinar');
    const mensaje         = document.getElementById('mensaje');

    // Funcion asincrona para obtener una palabra aleatoria
    async function obtenerPalabra() {
        try {
            const response   = await fetch('https://random-word-api.herokuapp.com/word?length=5&lang=es');
            const data       = await response.json();
            palabra_objetivo = data[0].toUpperCase();
            cearGameBoard(); // llamamos a la función para crear el tablero de juego 
        } catch (error) {
            mensaje.textContent = 'Error al cargar la palabra';
        }
    }

    // Función para crear el tablero de juego GameBoard
    function cearGameBoard() {

        // Recorre el número de intentos y crea una fila de letras por cada intento
        for (let i = 0; i < maxIntentos; i++) {

            // Recorre la palabra objetivo y crea un div por cada letra
            for (let j = 0; j < palabra_objetivo.length; j++) {
                const letterDiv = document.createElement('div');
                letterDiv.classList.add('letterBox');
                gameBoard.appendChild(letterDiv);
            }

        }

    }

    // Función para verificar la palabra ingresada
    function checkPalabraIngresada( palabra_ingresada ) {

        const letras   = gameBoard.querySelectorAll('.letterBox');  // Obtiene todos los divs de las letras
        const offset    = count_intentos * palabra_objetivo.length; // Calcula el offset para la fila actual
        
        // Recorre la palabra objetivo y compara con la palabra ingresada
        for (let i = 0; i < palabra_objetivo.length; i++) {

            const letraDiv = letras[offset + i];
            const letra = palabra_ingresada[i].toUpperCase();


            if ( letra === palabra_objetivo[i] ) {
                // la letra es correcta y esta en el lugar correcto
                letraDiv.classList.add('correcto');
            } else if (palabra_objetivo.includes(letra)) {
                // la letra es correcta pero no esta en el lugar correcto
                letraDiv.classList.add('presente');
            } else {
                // la letra no se encuentra en la palabra objetivo
                letraDiv.classList.add('ausente');
            }

            letraDiv.textContent = letra; // Muestra la letra en el div letterBox
        }
    }

    // Evento onclick del botón adivinar
    button_adivinar.addEventListener('click', () => {

        const palabra_ingresada = input_adivinar.value.trim().toUpperCase();

        // Verifica si la palabra ingresada tiene 5 letras
        if ( palabra_ingresada.length !== palabra_objetivo.length ) {
            mensaje.textContent = 'La palabra debe tener 5 letras';
            return;
        }

        // si el número de intentos es menor al máximo
        if ( count_intentos < maxIntentos ) {

            checkPalabraIngresada(palabra_ingresada); // llama a la función para verificar la palabra ingresada
            count_intentos++; // incrementa el número de intentos

            if ( palabra_ingresada === palabra_objetivo ) {
                mensaje.textContent = '¡Felicidades! Has adivinado la palabra';
                button_adivinar.disabled = true;
            } else if ( count_intentos === maxIntentos ) {
                mensaje.textContent = `Has perdido. La palabra era: ${palabra_objetivo}`;
                button_adivinar.disabled = true;
            }
        }
    });

    obtenerPalabra();
});
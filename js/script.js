//🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸JavaScript dedicado a busqueda.html🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
//Esperamos que cargue todo el contenido
document.addEventListener('DOMContentLoaded', function() {
    //con esto accedemos al parametro de la URL esto principalmente es para poder hacer
    //la transicion del index.html al "busqueda.html" al presionar el icono de busqueda
    //buscamos lo que esté luego de "q" en la URL y se lo asignamos a searchTerm
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    //si existe entonces se obtiene y se asigna a "busqueda"
    //busqueda es el id que le damos en busqueda.html al campo donde ingresamos la busqueda
    if (searchTerm) {
        document.getElementById('busqueda').value = searchTerm;
        //llamamos a la funcion buscarJuegos con el parámetro searchTerm
        buscarJuegos(searchTerm);
    }
    //obtenemos los elementos asignados con el id busquedaFormulario
    const formulario = document.getElementById('busquedaFormulario');
    //añadimos un evento que escuche el boton de "submit"
    formulario.addEventListener('submit', function(event) {
        //evitamos que el formulario se envie y se recargue la página
        event.preventDefault(); 
        //obtenemos el valor de busqueda y con trim le quitamos los espacios
        const busqueda = document.getElementById('busqueda').value.trim();
        //si busqueda no está vacio entonces se construye una URL 
        //que nos redireccione a busqueda.html junto con el término que introdujimos 
        //en el input del index.html
        if (busqueda !== '') {
            window.location.href = `busqueda.html?q=${encodeURIComponent(busqueda)}`;
        }
    });

    //realizamos una solicitud a la API de RAWG junto con el nombre del juego que colocamos
    //en el input, recibimos el parámetro searchTerm en "Term" de nuestra funcion buscarJuegos
    function buscarJuegos(term) {
        fetch(`https://api.rawg.io/api/games?key=e37df91cfb7d4463bacb4b155a49e4e7&search=${encodeURIComponent(term)}`)
            .then(response => response.json())
            //convertimos nuestros datos en json
            .then(data => {
                //obtenemos los detalles del juego por su id
                const ids = data.results.map(juego => juego.id);
                //con esta promesa obtenemos multiples resultados por parte de la API
                //para cada juego disponible con el nombre introducido
                return Promise.all(ids.map(id =>
                    fetch(`https://api.rawg.io/api/games/${id}?key=e37df91cfb7d4463bacb4b155a49e4e7`)
                        .then(response => response.json())
                        //los convertimos a json
                ));
            })
            .then(juegosDetalles => {
                //al estar resueltas todas las promesas, entonces se pasan los detalles de los juegos
                //a la funcion mostrarResultados y en el array juegosDetalles se guardan todos los datos
                mostrarResultados(juegosDetalles);
            })
            //si hubo un error lo mostramos en consola
            .catch(error => {
                console.error('Error al buscar juegos:', error);
                mostrarError('Hubo un error al buscar juegos. Por favor, inténtalo de nuevo.');
            });
    }

    //recibimos juegosDetalles como parámetro
    function mostrarResultados(juegosDetalles) {
        //recibimos el contenedor del div en el html
        const resultadosDiv = document.getElementById('resultados');
        //borramos lo que haya antes en resultadosDiv
        resultadosDiv.innerHTML = '';

        //por cada elemento le creamos su div
        juegosDetalles.forEach(juego => {
            const juegoDiv = document.createElement('div');
            juegoDiv.classList.add('juego');
            //aplicamos estilo nuevamente con la clase juego
            //modificamos la forma para poder ver los datos del juego en el html con la descripción incluida
            juegoDiv.innerHTML = `
                <h3>${juego.name}</h3>
                <img src="${juego.background_image}" alt="${juego.name}" width="200">
                <p>${juego.description_raw ? juego.description_raw : 'Descripción no disponible'}</p>
            `;
            //agregamos los datos al elemento en el html (resultados) acá mencionado como resultadosDiv 
            resultadosDiv.appendChild(juegoDiv);
        });
    }

    //funcion que nos muestra un mensaje en caso de que buscarJuegos incurra en algun tipo de error
    function mostrarError(mensaje) {
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>${mensaje}</p>`;
    }
});
//🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸JavaScript dedicado a Index.html🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸

//Evento que llama a la funcion cargarJuegosPopulares apenas termina de ejecutar todo el DOM 
//en la página y ésta esté lista 
document.addEventListener('DOMContentLoaded', function() {
    cargarJuegosPopulares();
});

//Variable global que se inicializa como un array vacío acá guardaremos los juegos favoritos 
//junto con sus atributos
let favoritos = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que carga los juegos mas populares entre los 18 más populares
function cargarJuegosPopulares() {
    fetch('https://api.rawg.io/api/games?key=e37df91cfb7d4463bacb4b155a49e4e7&page_size=18')
    //con fetch obtenemos los juegos más populares pertenecientes a una lista de la API llamada RAWG
        .then(response => response.json())
        //lo convierte en un objeto json
        .then(data => {
            mostrarJuegosGenerales(data.results);
        //acá hacemos el llamado de la funcion mostrarJuegosGenerales
        })
        .catch(error => console.error('Error al cargar los datos:', error));
        //mostramos en consola un error si no logramos cargar bien los datos de la solicitud 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que muestra los juegos en la sección general
//El parámetro "juegos" es el parámetro recibido desde "data.results" en la funcion cargarJuegosPopulares
//pero acá lo llamaremos "juegos"
function mostrarJuegosGenerales(juegos) {
    //obtenemos el contenedor del elemento html con id "juegosGenerales"
    const juegosDiv = document.getElementById('juegosGenerales'); 
    //con esto nos aseguramos que el contedor esté vacio antes de agregar un nuevo elemento
    //para que no se dupliquen
    juegosDiv.innerHTML = '';

    //por cada juego le creamos el elemento div y agregamos
    juegos.forEach(juego => {
        const juegoDiv = document.createElement('div');
        juegoDiv.classList.add('juego');
        //le aplicamos estilo con la clase "juego"

    //con esto establecemos la forma en que queremos visualizarlo en el html y por cada juego marcamos
    //su atributo a mostrar
        juegoDiv.innerHTML = `
            <h3>${juego.name}</h3>
            <p>Fecha de lanzamiento: ${juego.released}</p>
            <img src="${juego.background_image}" alt="${juego.name}" width="200">
            <button class="favoritos" onclick="agregarAFavoritos('${juego.id}', '${juego.name}', '${juego.released}', '${juego.background_image}'); location.href='#abajo';">Agregar a Favoritos</button>
            `;
            //con el botón estamos llamando a la función agregarAFavoritos y le estamos pasando los parámetros
            //id name released y background_image para luego recibirlos en agregarAFavoritos()

        //añadimos cada div "juegoDiv" con su juego correspondiente "juegosDiv"
        //juegosDiv es la referencia al elemento que contiene el id juegosGenerales del index.html
        juegosDiv.appendChild(juegoDiv);
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
* Función para agregar un juego a la lista de favoritos.
* string id - ID del juego.
* string nombre - Nombre del juego.
* string fecha - Fecha de lanzamiento del juego.
* string imagen - URL de la imagen del juego.
*/

//recibimos los parametros id, nombre, fecha e imagen
function agregarAFavoritos(id, nombre, fecha, imagen) {
    //a modo de prueba mostramos por consola el favorito agregado
    //para verificar que no llegue con errores
    console.log(`Agregar a favoritos: ${nombre}`);

    //verificamos que no haya un favorito igual al que estamos por agregar 
    //para evitar duplicados
    if (!favoritos.some(fav => fav.id === id)) {
        favoritos.push({ id, nombre, fecha, imagen });
        //enviamos el favorito al array de favoritos e invocamos a la funcion mostrarFavoritos() para que 
        //inmediatamente muestre el favorito que agregamos y luego este se clasifique en la funcion "porFecha()"
        mostrarFavoritos();
        porFecha();
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que muestra la lista de juegos favoritos
function mostrarFavoritos() {
    //obtenemos el contenedor del elemento html con id "favoritos"
    const favoritosDiv = document.getElementById('favoritos');
    //borramos el contenido anterior para evitar duplicaciones
    favoritosDiv.innerHTML = '';

    //se itera por cada elemento del array favoritos 
    favoritos.forEach(fav => {
        //creamos un div para cada elemento
        const favDiv = document.createElement('div');
        //le damos clase con el id "juego"
        favDiv.classList.add('juego');
        
        //definimos el contenido que vamos a mostrar en el div
        favDiv.innerHTML = `
            <h3>${fav.nombre}</h3>
            <p>Fecha de lanzamiento: ${fav.fecha}</p>
            <img src="${fav.imagen}" alt="${fav.nombre}" width="200">
            <button onclick="eliminarDeFavoritos('${fav.id}')">Eliminar de Favoritos</button>
        `;
        //añadimos el div "favDiv" a favoritosDiv que referencia el elemento del html con el 
        //id "favoritos"
        favoritosDiv.appendChild(favDiv);
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Funcion que elimina un juego de la lista de favoritos.
 * string id - ID del juego a eliminar.
 */
//recibimos por parámetro el id del juego a eliminar
//el id lo recibimos de mostrarFavoritos. Este contiene un botón en el favDiv.innerHtml 
//el cual nos envia este id
function eliminarDeFavoritos(id) {
    //filtra los favoritos creando un nuevo array sin el elemento que eliminamos
    favoritos = favoritos.filter(fav => fav.id !== id);
    //actualizamos la lista de favoritos y tambien la lista donde se clasificó ese favorito(antes de 2010 o despues)
    mostrarFavoritos();
    porFecha();
}


 //Función que categoriza los juegos favoritos segun su fecha de lanzamiento.
function porFecha() {
    //obtenemos sus contenedores del html con mayor2010 y menor2010
    const mayor2010Div = document.getElementById('mayor-2010').querySelector('.categoria-lista');
    //selecciona el primer elemento dentro de "mayor-2010" que tiene la clase "categoria-lista". Esto permite 
    //seleccionar un elemento específico dentro de otro elemento identificado, en este caso lo identificamos
    //por sus atributo css de la clase .categoria-lista obteniendo asi el primer elemento con esa clase
    const menor2010Div = document.getElementById('menor-2010').querySelector('.categoria-lista');
    //borramos lo que tenia anteriormente para que no se duplique
    mayor2010Div.innerHTML = '';
    menor2010Div.innerHTML = '';
    //recorremos el array global favoritos
    favoritos.forEach(fav => {
        //por cada elemento creamos un div
        const juegoItem = document.createElement('div');
        //aplicamos estilo css
        juegoItem.classList.add('juego');

        //obtenemos el año y se lo atribuimos a la variable year
        const year = new Date(fav.fecha).getFullYear();
        //modificamos como queremos ver el elemento en nuestro html
        juegoItem.innerHTML = `
            <h3>${fav.nombre}</h3>
            <p>Fecha de lanzamiento: ${fav.fecha}</p>
            <img src="${fav.imagen}" alt="${fav.nombre}" width="200">
        `;
        //si es mayor a 2010 entonces lo atribuimos al elemento html con el id "mayor-2010" referenciado
        // como "mayor2010Div"

        //caso contrario lo atribuimos al id menor-2010 acá llamado "menor2010Div"
        if (year > 2010) {
            mayor2010Div.appendChild(juegoItem);
        } else {
            menor2010Div.appendChild(juegoItem);
        }
    });
}

//🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸 Fin gracias por leer ^^ 🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸

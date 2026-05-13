let todasLasEscuderias = [];

// Carga los datos del XML
function cargarDatos() {
    fetch("data/data.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const items = xml.getElementsByTagName("escuderia");

            todasLasEscuderias = [];
            for (let item of items) {
                todasLasEscuderias.push({
                    nombre: item.getElementsByTagName("nombre")[0].textContent,
                    descripcion: item.getElementsByTagName("descripcion")[0].textContent,
                    imagen: item.getElementsByTagName("imagen")[0].textContent
                });
            }
            mostrarTarjetas(todasLasEscuderias);
        });
}

// Muestra las tarjetas
function mostrarTarjetas(lista) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";
    
    lista.forEach(escuderia => {
        const divCard = document.createElement("div");
        divCard.className = "card";

        divCard.innerHTML = `
            <h3>${escuderia.nombre}</h3>
            <img src="${escuderia.imagen}" alt="${escuderia.nombre}">
            <p>${escuderia.descripcion}</p> `;
        resultado.appendChild(divCard);
    });
}

// Filtrador de la busqueda de tarjetas
document.getElementById("btnBuscar").addEventListener("click", () => {
    const texto = document.getElementById("buscarEscuderia").value.toLowerCase();
    const filtradas = todasLasEscuderias.filter(esc => 
        esc.nombre.toLowerCase().includes(texto)
    );
    mostrarTarjetas(filtradas);
});

// Boton para buscar las tarjetas y borrarlas del buscador
document.getElementById("borrarBusqueda").addEventListener("click", () => {
    document.getElementById("buscarEscuderia").value = "";
    mostrarTarjetas(todasLasEscuderias);
});

// Sistema para cambiar el color de fondo(claro, oscuro, personalizado)
document.getElementById("selectorTema").addEventListener("change", (e) => {
    const tema = e.target.value;
    if (tema === "personalizado") {
        document.getElementById("modalPersonalizado").style.display = "flex";
    } else {
        document.body.className = "modo-" + tema;
        document.querySelector(".header").style.backgroundColor = "";
        document.querySelector(".main-content").style.backgroundColor = "";
        document.querySelector(".footer").style.backgroundColor = "";
    }
});

// Aplicar los colores personalizados
document.getElementById("btnAplicarColores").addEventListener("click", () => {
    document.querySelector(".header").style.backgroundColor = document.getElementById("colorHeader").value;
    document.querySelector(".main-content").style.backgroundColor = document.getElementById("colorMain").value;
    document.querySelector(".footer").style.backgroundColor = document.getElementById("colorFooter").value;
    document.getElementById("modalPersonalizado").style.display = "none";
});

// Función para añadir una nueva tarjeta
const modalAdd = document.getElementById("modalAdd");

document.getElementById("btnAbrirAdd").addEventListener("click", () => {
    modalAdd.style.display = "flex";
});

document.getElementById("btnCancelarAdd").addEventListener("click", () => {
    modalAdd.style.display = "none";
});

document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = document.getElementById("nuevoNombre").value;
    const desc = document.getElementById("nuevaDesc").value;
    const archivoImg = document.getElementById("nuevaImg").files[0];

    if (nombre && desc && archivoImg) {
        let reader = new FileReader();
        reader.onload = function(e) {
            todasLasEscuderias.push({ 
                nombre: nombre, 
                descripcion: desc, 
                imagen: e.target.result 
            });
            mostrarTarjetas(todasLasEscuderias);
            modalAdd.style.display = "none";
        };
        reader.readAsDataURL(archivoImg);
    }
});

// Inicialización de la carga de datos
document.addEventListener("DOMContentLoaded", cargarDatos);
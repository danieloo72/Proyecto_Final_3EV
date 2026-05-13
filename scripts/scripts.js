let todasLasEscuderias = [];

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

function mostrarTarjetas(lista) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";
    
    lista.forEach(escuderia => {
        const divCard = document.createElement("div");
        divCard.className = "card";

        divCard.innerHTML = `
            <h3>${escuderia.nombre}</h3>
            <img src="${escuderia.imagen}" alt="${escuderia.nombre}">
            <button class="btn-info">Ver Detalles</button>
        `;

        divCard.querySelector(".btn-info").onclick = () => {
            document.getElementById("modalTitulo").innerText = escuderia.nombre;
            document.getElementById("modalDescripcion").innerText = escuderia.descripcion;
            document.getElementById("modalImagen").src = escuderia.imagen;
            document.getElementById("modalEscuderia").showModal();
        };

        resultado.appendChild(divCard);
    });
}

document.getElementById("buscarEscuderia").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtradas = todasLasEscuderias.filter(esc => 
        esc.nombre.toLowerCase().includes(texto)
    );
    mostrarTarjetas(filtradas);
});

document.getElementById("borrarBusqueda").addEventListener("click", () => {
    document.getElementById("buscarEscuderia").value = "";
    mostrarTarjetas(todasLasEscuderias);
});

document.getElementById("selectorTema").addEventListener("change", (e) => {
    const tema = e.target.value;
    if (tema !== "personalizado") {
        document.body.className = "modo-" + tema;
    }
});

const modalAdd = document.getElementById("modalAdd");

document.getElementById("btnAbrirModalAdd").addEventListener("click", () => {
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
            const nueva = {
                nombre: nombre,
                descripcion: desc,
                imagen: e.target.result
            };
            todasLasEscuderias.push(nueva);
            mostrarTarjetas(todasLasEscuderias);
            modalAdd.style.display = "none";
        };
        reader.readAsDataURL(archivoImg);
    }
});

document.getElementById("cerrarModal").onclick = () => document.getElementById("modalEscuderia").close();
document.addEventListener("DOMContentLoaded", cargarDatos);
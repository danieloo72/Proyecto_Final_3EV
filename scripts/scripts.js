let todasLasEscuderias = [];

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    fetch("data/data.xml")
        .then(res => res.text())
        .then(data => {
            const xml = new DOMParser().parseFromString(data, "text/xml");
            const items = xml.getElementsByTagName("escuderia");
            for (let item of items) {
                todasLasEscuderias.push({
                    nombre: item.getElementsByTagName("nombre")[0].textContent,
                    descripcion: item.getElementsByTagName("descripcion")[0].textContent,
                    imagen: item.getElementsByTagName("imagen")[0].textContent
                });
            }
            mostrarTarjetas(todasLasEscuderias);
        });
});

function mostrarTarjetas(lista) {
    const contenedor = document.getElementById("resultado");
    contenedor.innerHTML = "";
    lista.forEach(esc => {
        contenedor.innerHTML += `
            <div class="card h-100">
                <img src="${esc.imagen}" class="card-img-top" alt="${esc.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${esc.nombre}</h5>
                    <p class="card-text">${esc.descripcion}</p>
                </div>
            </div>`;
    });
}

// Buscador
document.getElementById("btnBuscar").addEventListener("click", () => {
    const texto = document.getElementById("buscarEscuderia").value.toLowerCase();
    mostrarTarjetas(todasLasEscuderias.filter(esc => esc.nombre.toLowerCase().includes(texto)));
});

document.getElementById("borrarBusqueda").addEventListener("click", () => {
    document.getElementById("buscarEscuderia").value = "";
    mostrarTarjetas(todasLasEscuderias);
});

// Gestión de Temas
document.querySelectorAll('.tema-option').forEach(opcion => {
    opcion.addEventListener('click', (e) => {
        e.preventDefault();
        const tema = e.target.getAttribute('data-value');
        document.getElementById("btnDropdownTema").textContent = e.target.textContent;

        if (tema === "personalizado") {
            document.getElementById("modalPersonalizado").style.display = "flex";
        } else {
            document.body.className = "modo-" + tema;
            [".header", ".main-content", ".footer"].forEach(sel => document.querySelector(sel).style.backgroundColor = "");
        }
    });
});

document.getElementById("btnAplicarColores").addEventListener("click", () => {
    document.querySelector(".header").style.backgroundColor = document.getElementById("colorHeader").value;
    document.querySelector(".main-content").style.backgroundColor = document.getElementById("colorMain").value;
    document.querySelector(".footer").style.backgroundColor = document.getElementById("colorFooter").value;
    document.getElementById("modalPersonalizado").style.display = "none";
});

// Añadir Escudería
document.getElementById("btnAbrirAdd").addEventListener("click", () => document.getElementById("modalAdd").style.display = "flex");
document.getElementById("btnCancelarAdd").addEventListener("click", () => document.getElementById("modalAdd").style.display = "none");

document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = document.getElementById("nuevoNombre").value;
    const desc = document.getElementById("nuevaDesc").value;
    const archivo = document.getElementById("nuevaImg").files[0];

    if (nombre && desc && archivo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            todasLasEscuderias.push({ nombre, descripcion: desc, imagen: e.target.result });
            mostrarTarjetas(todasLasEscuderias);
            document.getElementById("modalAdd").style.display = "none";
        };
        reader.readAsDataURL(archivo);
    }
});
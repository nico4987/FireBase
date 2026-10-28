import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const app = initializeApp({ databaseURL: "https://refugio-de-mascotas-dbb64-default-rtdb.firebaseio.com/" });
const db = getDatabase(app);

document.querySelector("#btnGuardar").onclick = function() {
    let nombre = document.querySelector("#nombre").value;

    if (nombre === "") {
        alert("El Nombre es obligatorio");
        return;
    }

    push(ref(db, 'mascotas'), {
        nombre: nombre,
        especie: document.querySelector("#especie").value,
        edad: document.querySelector("#edad").value,
        raza: document.querySelector("#raza").value,
        peso: document.querySelector("#peso").value
    }).then(() => {
        document.querySelector("#mensaje").innerHTML = "¡Guardado con clave automática!";
        console.log("Éxito al guardar con push");
    }).catch((error) => {
        alert("Error al guardar");
        console.log(error);
    });
};

onValue(ref(db, 'mascotas'), (snapshot) => {
    let datos = snapshot.val();
    let textoBusqueda = document.querySelector("#buscador").value.toLowerCase();
    let html = "";
    
    if (datos !== null) {
        let identificadores = Object.keys(datos);
        for (let i = 0; i < identificadores.length; i++) {
            let id = identificadores[i];
            let mascota = datos[id];
            
            let nom = mascota.nombre || "No cargado";
            let esp = mascota.especie || "No cargado";
            let eda = mascota.edad || "No cargado";
            let raz = mascota.raza || "No cargado";
            let pes = mascota.peso || "No cargado";

            if (nom.toLowerCase().includes(textoBusqueda)) {
                html += "<tr>";
                html += "<td>" + id + "</td>";
                html += "<td>" + nom + "</td>";
                html += "<td>" + esp + "</td>";
                html += "<td>" + eda + "</td>";
                html += "<td>" + raz + "</td>";
                html += "<td>" + pes + "</td>";
                html += "</tr>";
            }
        }
    }
    document.querySelector("#lista").innerHTML = html;
});

document.querySelector("#buscador").oninput = function() {
    onValue(ref(db, 'mascotas'), (snapshot) => {}, { onlyOnce: true });
};
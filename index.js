import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const app = initializeApp({ databaseURL: "https://refugio-de-mascotas-dbb64-default-rtdb.firebaseio.com/" });
const db = getDatabase(app);

document.querySelector("#btnGuardar").onclick = function() {
    let codigo = document.querySelector("#codigo").value;
    let nombre = document.querySelector("#nombre").value;

    if (codigo === "" || nombre === "") {
        alert("Código y Nombre obligatorios");
        return;
    }

    set(ref(db, 'mascotas/' + codigo), {
        nombre: nombre,
        especie: document.querySelector("#especie").value,
        edad: document.querySelector("#edad").value,
        raza: document.querySelector("#raza").value
    }).then(() => {
        document.querySelector("#mensaje").innerHTML = "¡Guardado!";
        console.log("Éxito al guardar");
    }).catch((error) => {
        alert("Error");
        console.log(error);
    });

    push(ref(db, 'historial'), { accion: "Registro añadido" });
};

onValue(ref(db, 'mascotas'), (snapshot) => {
    let datos = snapshot.val();
    let html = "";
    
    if (datos !== null) {
        let identificadores = Object.keys(datos);
        for (let i = 0; i < identificadores.length; i++) {
            let id = identificadores[i];
            let mascota = datos[id];
            
            html += "<tr>";
            html += "<td>" + id + "</td>";
            html += "<td>" + mascota.nombre + "</td>";
            html += "<td>" + mascota.especie + "</td>";
            html += "<td>" + mascota.edad + "</td>";
            html += "<td>" + mascota.raza + "</td>";
            html += "</tr>";
        }
    }
    document.querySelector("#lista").innerHTML = html;
});
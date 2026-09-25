import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://refugio-de-mascotas-dbb64-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const boton = document.querySelector("#btnGuardar");
const cajaMensaje = document.querySelector("#mensaje");
const cajaLista = document.querySelector("#lista");

boton.onclick = function() {
    let codigo = document.querySelector("#codigo").value;
    let nombre = document.querySelector("#nombre").value;
    let especie = document.querySelector("#especie").value;
    let edad = document.querySelector("#edad").value;
    let raza = document.querySelector("#raza").value;

    if (codigo === "" || nombre === "") {
        alert("El Código y el Nombre son obligatorios");
        return;
    }

    const referenciaMascota = ref(db, 'mascotas/' + codigo);

    set(referenciaMascota, {
        nombre: nombre,
        especie: especie,
        edad: edad,
        raza: raza
    }).then(() => {
        cajaMensaje.innerHTML = "¡Mascota guardada con éxito!";
        console.log("Registro de mascota guardado en Firebase");
    }).catch((error) => {
        alert("Ocurrió un error al guardar");
        console.log(error);
    });

    const referenciaHistorial = ref(db, 'historial_refugio');
    push(referenciaHistorial, { accion: "Nueva mascota ingresada al sistema" });
};

const referenciaLectura = ref(db, 'mascotas');
onValue(referenciaLectura, (snapshot) => {
    let datos = snapshot.val();
    let contenido = "<h3>Mascotas en el refugio:</h3>";
    
    if (datos !== null) {
        let identificadores = Object.keys(datos);
        for (let i = 0; i < identificadores.length; i++) {
            let mascota = datos[identificadores[i]];
            contenido += "<p>" + mascota.nombre + " (" + mascota.especie + ")</p>";
        }
    }
    cajaLista.innerHTML = contenido;
});
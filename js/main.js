

// Storage 

const STORAGE_KEY = "alumnos";

function guardarEnStorage(alumnos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
}

function leerDeStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


// Utilidades

function uid() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function normalizarNombre(nombre) {
  return String(nombre || "").trim();
}

function notaValida(n) {
  return Number.isFinite(n) && n >= 0 && n <= 10;
}

function calcularPromedio(alumno) {
  return (alumno.matematica + alumno.lengua + alumno.ciencias) / 3;
}

function estadoAlumno(promedio) {
  return promedio >= 6 ? "aprobado" : "riesgo";
}

function textoEstado(estado) {
  return estado === "aprobado" ? "Aprobado" : "En riesgo";
}


// Estado de la app

let alumnos = leerDeStorage();


// DOM 

const form = document.getElementById("formAlumno");
const inputNombre = document.getElementById("nombre");
const inputMat = document.getElementById("matematica");
const inputLen = document.getElementById("lengua");
const inputCie = document.getElementById("ciencias");

const feedback = document.getElementById("feedback");
const tbody = document.getElementById("tbodyAlumnos");
const resumen = document.getElementById("resumen");

const busqueda = document.getElementById("busqueda");
const filtroEstado = document.getElementById("filtroEstado");
const orden = document.getElementById("orden");

const btnVaciar = document.getElementById("btnVaciar");
const btnDemo = document.getElementById("btnDemo");


// Feedback UI

let feedbackTimer = null;

function setFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.classList.remove("is-ok", "is-bad");
  if (type === "ok") feedback.classList.add("is-ok");
  if (type === "bad") feedback.classList.add("is-bad");

  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedback.textContent = "";
    feedback.classList.remove("is-ok", "is-bad");
  }, 2500);
}


// Render DOM dinámico

function obtenerVistaAlumnos() {
  const q = busqueda.value.trim().toLowerCase();
  const f = filtroEstado.value;
  const o = orden.value;

  //  filter
  let vista = alumnos.filter((a) => {
    const matchNombre = a.nombre.toLowerCase().includes(q);
    if (f === "todos") return matchNombre;
    return matchNombre && a.estado === f;
  });

  //  sort
  vista = vista.slice().sort((a, b) => {
    if (o === "nombre-asc") return a.nombre.localeCompare(b.nombre);
    if (o === "nombre-desc") return b.nombre.localeCompare(a.nombre);
    if (o === "prom-desc") return b.promedio - a.promedio;
    if (o === "prom-asc") return a.promedio - b.promedio;
    return 0;
  });

  return vista;
}

function renderTabla() {
  const vista = obtenerVistaAlumnos();

  tbody.innerHTML = "";

  if (vista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="8">No hay alumnos para mostrar.</td>`;
    tbody.appendChild(tr);
    return;
  }

  for (let i = 0; i < vista.length; i++) {
    const a = vista[i];

    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td>${i + 1}</td>
  <td>${a.nombre}</td>

  <td>
    <input class="inp" data-edit="matematica" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.matematica}">
  </td>
  <td>
    <input class="inp" data-edit="lengua" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.lengua}">
  </td>
  <td>
    <input class="inp" data-edit="ciencias" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.ciencias}">
  </td>

  <td>${a.promedio.toFixed(1)}</td>
  <td>${a.estado === "aprobado" ? "Aprobado" : "En riesgo"}</td>

  <td>
    <div class="acciones">
      <button class="btn-acc" data-del="${a.id}">Eliminar</button>
    </div>
  </td>
`;


    tbody.appendChild(tr);
  }
}

function renderResumen() {
  if (alumnos.length === 0) {
    resumen.innerHTML = `
      <div class="cardMini"><div class="cardMini__label">Alumnos</div><div class="cardMini__value">0</div></div>
      <div class="cardMini"><div class="cardMini__label">Promedio general</div><div class="cardMini__value">0.0</div></div>
      <div class="cardMini"><div class="cardMini__label">Aprobados</div><div class="cardMini__value">0</div></div>
      <div class="cardMini"><div class="cardMini__label">En riesgo</div><div class="cardMini__value">0</div></div>
    `;
    return;
  }

  //  reduce
  const promedioGeneral = alumnos.reduce((acc, a) => acc + a.promedio, 0) / alumnos.length;
  const aprobados = alumnos.filter((a) => a.estado === "aprobado").length;
  const enRiesgo = alumnos.filter((a) => a.estado === "riesgo").length;

  resumen.innerHTML = `
    <div class="cardMini">
      <div class="cardMini__label">Alumnos</div>
      <div class="cardMini__value">${alumnos.length}</div>
    </div>
    <div class="cardMini">
      <div class="cardMini__label">Promedio general</div>
      <div class="cardMini__value">${promedioGeneral.toFixed(1)}</div>
    </div>
    <div class="cardMini">
      <div class="cardMini__label">Aprobados</div>
      <div class="cardMini__value">${aprobados}</div>
    </div>
    <div class="cardMini">
      <div class="cardMini__label">En riesgo</div>
      <div class="cardMini__value">${enRiesgo}</div>
    </div>
  `;
}

function renderTodo() {
  renderTabla();
  renderResumen();
}


// Alumnos al sistema

function agregarAlumno({ nombre, matematica, lengua, ciencias }) {
  const alumno = {
    id: uid(),
    nombre,
    matematica,
    lengua,
    ciencias,
  };

  alumno.promedio = calcularPromedio(alumno);
  alumno.estado = estadoAlumno(alumno.promedio);

  alumnos.push(alumno);
  guardarEnStorage(alumnos);
  renderTodo();
}

function eliminarAlumno(id) {
  alumnos = alumnos.filter((a) => a.id !== id);
  guardarEnStorage(alumnos);
  renderTodo();
}

function actualizarNota(id, materia, valor) {
  const nota = Number(valor);

  if (!notaValida(nota)) {
    setFeedback("Nota inválida (0 a 10).", "bad");
    renderTodo();
    return;
  }

  const idx = alumnos.findIndex((a) => a.id === id);
  if (idx === -1) return;

  alumnos[idx][materia] = nota;

  alumnos[idx].promedio = calcularPromedio(alumnos[idx]);
  alumnos[idx].estado = estadoAlumno(alumnos[idx].promedio);

  guardarEnStorage(alumnos);
  renderTodo();
}

function vaciarTodo() {
  alumnos = [];
  localStorage.removeItem(STORAGE_KEY);
  renderTodo();
}


// Demo carga

function cargarDemo() {
  const demo = [
    { nombre: "Luz", matematica: 8, lengua: 7, ciencias: 9 },
    { nombre: "Joaquín", matematica: 6, lengua: 5, ciencias: 7 },
    { nombre: "Lautaro", matematica: 3, lengua: 4, ciencias: 5 },
    { nombre: "Mariela", matematica: 5, lengua: 6, ciencias: 4 },
    { nombre: "Alan", matematica: 8, lengua: 5, ciencias: 7 },
    { nombre: "Thiago", matematica: 10, lengua: 9, ciencias: 10 },
  ];

  // map (transformación)
  alumnos = demo.map((d) => {
    const a = { id: uid(), ...d };
    a.promedio = calcularPromedio(a);
    a.estado = estadoAlumno(a.promedio);
    return a;
  });

  guardarEnStorage(alumnos);
  renderTodo();
  setFeedback("Demo cargado y guardado en localStorage.", "ok");
}


// Eventos

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = normalizarNombre(inputNombre.value);
  const matematica = Number(inputMat.value);
  const lengua = Number(inputLen.value);
  const ciencias = Number(inputCie.value);

  if (!nombre) {
    setFeedback("Ingresá un nombre válido.", "bad");
    return;
  }

  if (![matematica, lengua, ciencias].every(notaValida)) {
    setFeedback("Las notas deben estar entre 0 y 10.", "bad");
    return;
  }

  agregarAlumno({ nombre, matematica, lengua, ciencias });

  form.reset();
  inputNombre.focus();
  setFeedback("Alumno agregado y guardado.", "ok");
});

// Delegación de eventos para botones e inputs dentro de la tabla
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-del]");
  if (!btn) return;

  const id = btn.getAttribute("data-del");
  eliminarAlumno(id);
  setFeedback("Alumno eliminado.", "ok");
});

tbody.addEventListener("change", (e) => {
  const inp = e.target.closest("[data-edit]");
  if (!inp) return;

  const id = inp.getAttribute("data-id");
  const materia = inp.getAttribute("data-edit");
  actualizarNota(id, materia, inp.value);
  setFeedback("Nota actualizada.", "ok");
});

busqueda.addEventListener("input", renderTabla);
filtroEstado.addEventListener("change", renderTabla);
orden.addEventListener("change", renderTabla);

btnVaciar.addEventListener("click", () => {
  vaciarTodo();
  setFeedback("Datos vaciados (storage limpio).", "ok");
});

btnDemo.addEventListener("click", cargarDemo);


// Inicialización

if (alumnos.length > 0) {
  renderTodo();
} else {
  renderTodo();
}

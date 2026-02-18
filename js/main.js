
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


// Estado

let alumnos = leerDeStorage();


// DOM

const form = document.getElementById("formAlumno");
const inputNombre = document.getElementById("nombre");
const inputMat = document.getElementById("matematica");
const inputLen = document.getElementById("lengua");
const inputCie = document.getElementById("ciencias");


const tbody = document.getElementById("tbodyAlumnos");
const resumen = document.getElementById("resumen");

const busqueda = document.getElementById("busqueda");
const filtroEstado = document.getElementById("filtroEstado");
const orden = document.getElementById("orden");

const btnVaciar = document.getElementById("btnVaciar");
const btnDemo = document.getElementById("btnDemo");

// Notificaciones con SweetAlert2
function toastOk(title) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}

function toastBad(title) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}


// render

function obtenerVistaAlumnos() {
  const q = busqueda.value.trim().toLowerCase();
  const f = filtroEstado.value;
  const o = orden.value;

  let vista = alumnos.filter((a) => {
    const matchNombre = a.nombre.toLowerCase().includes(q);
    if (f === "todos") return matchNombre;
    return matchNombre && a.estado === f;
  });

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

  vista.forEach((a, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${a.nombre}</td>

      <td><input class="inp" data-edit="matematica" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.matematica}"></td>
      <td><input class="inp" data-edit="lengua" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.lengua}"></td>
      <td><input class="inp" data-edit="ciencias" data-id="${a.id}" type="number" min="0" max="10" step="1" value="${a.ciencias}"></td>

      <td>${a.promedio.toFixed(1)}</td>
      <td>${textoEstado(a.estado)}</td>

      <td>
        <div class="acciones">
          <button class="btn-acc" data-del="${a.id}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
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

  const promedioGeneral =
    alumnos.reduce((acc, a) => acc + a.promedio, 0) / alumnos.length;

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

// Operaciones sobre los datos
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
    toastBad("Nota inválida (0 a 10).");
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


// Fetch JSON (datos remotos)

async function cargarDemoDesdeJSON() {
  try {
    const resp = await fetch("./data/alumnos.json");
    if (!resp.ok) throw new Error("No se pudo cargar alumnos.json");
    const demo = await resp.json();

    alumnos = demo.map((d) => {
      const a = { id: uid(), ...d };
      a.promedio = calcularPromedio(a);
      a.estado = estadoAlumno(a.promedio);
      return a;
    });

    guardarEnStorage(alumnos);
    renderTodo();
    toastOk("Demo cargado desde JSON (Fetch).");
  } catch (err) {
    toastBad("Error cargando el demo (revisá /data/alumnos.json).");
  }
}


// Eventos

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = normalizarNombre(inputNombre.value);
  const matematica = Number(inputMat.value);
  const lengua = Number(inputLen.value);
  const ciencias = Number(inputCie.value);

  if (!nombre) {
    toastBad("Ingresá un nombre válido.");
    return;
  }

  if (![matematica, lengua, ciencias].every(notaValida)) {
    toastBad("Las notas deben estar entre 0 y 10.");
    return;
  }

  agregarAlumno({ nombre, matematica, lengua, ciencias });

  form.reset();
  inputNombre.focus();
  toastOk("Alumno agregado.");
});


tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-del]");
  if (!btn) return;

  const id = Number(btn.getAttribute("data-del")); 

  const res = await Swal.fire({
    title: "¿Eliminar alumno?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!res.isConfirmed) return;

  eliminarAlumno(id);
  toastOk("Alumno eliminado.");
});


tbody.addEventListener("change", (e) => {
  const inp = e.target.closest("[data-edit]");
  if (!inp) return;

  const id = Number(inp.getAttribute("data-id")); 
  const materia = inp.getAttribute("data-edit");
  actualizarNota(id, materia, inp.value);
  toastOk("Nota actualizada.");
});

busqueda.addEventListener("input", renderTabla);
filtroEstado.addEventListener("change", renderTabla);
orden.addEventListener("change", renderTabla);

// Vaciar todos los registros (con confirmación SweetAlert2)
btnVaciar.addEventListener("click", async () => {
  if (alumnos.length === 0) return toastBad("No hay datos para borrar.");

  const res = await Swal.fire({
    title: "¿Vaciar todo?",
    text: "Se borrarán alumnos y storage.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  });

  if (!res.isConfirmed) return;

  alumnos = [];
  limpiarStorage();
  renderTodo();
  toastOk("Datos vaciados.");
});

// Demo desde JSON + Fetch
btnDemo.addEventListener("click", cargarDemoDesdeJSON);


// Inicialización + precarga sugerida
renderTodo();

// Precarga 
inputNombre.value = "Ej: Luz";

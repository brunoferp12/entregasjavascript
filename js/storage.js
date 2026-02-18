
const STORAGE_KEY = "alumnos";

function guardarEnStorage(alumnos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
}

function leerDeStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function limpiarStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

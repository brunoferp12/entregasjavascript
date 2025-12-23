
const alumnos = [];

//Registro de alumnos.
function registrarAlumno(nombre, notaMat, notaLen, notaCie) {
  if (nombre === "" || nombre === null || nombre === undefined) {
    console.log("Nombre inválido. No se registró el alumno.");
    return;
  }

//Condición para notas válidas.
  if (
    notaMat < 0 || notaMat > 10 ||
    notaLen < 0 || notaLen > 10 ||
    notaCie < 0 || notaCie > 10
  ) {
    console.log("Notas inválidas para ${nombre}.");
    return;
  }
 
//Carga de alumnos con sus notas.

  alumnos.push({
    nombre: nombre,
    matematica: notaMat,
    lengua: notaLen,
    ciencias: notaCie
  });

  console.log(`Alumno registrado: ${nombre}`);
}


//Cálculo de promedios de notas.
function calcularPromedioAlumno(alumno) {
  return (alumno.matematica + alumno.lengua + alumno.ciencias) / 3;
}

//Parte de la construcción del resumen.
function mostrarResumenCurso() {
  if (alumnos.length === 0) {
    console.log("No hay alumnos cargados.");
    return;
  }

 
  
 

  let sumaPromedios = 0; 
  let aprobados = 0;
    let enRiesgo = 0;

  console.log("Alumnos y sus notas:");

  //Aplicación de Ciclo for que ejecuta el array índice por índice del total de los alumnos cargados.
  for (let i = 0; i < alumnos.length; i++) {
    const a = alumnos[i];
    const promedio = calcularPromedioAlumno(a);
    sumaPromedios = sumaPromedios + promedio;


    
   

//Estado del alumno con condiciones.
    let estado;
    if (promedio >= 6) {
      estado = "Aprobado";
      aprobados++;
    } else {
      estado = "En riesgo";
      enRiesgo++;
    }

    console.log(
      `${i + 1}) ${a.nombre} | Mat:${a.matematica} Len:${a.lengua} Cie:${a.ciencias} | Prom:${promedio.toFixed(
        1
      )} | ${estado}`
    );
  }

  //Cálculo del promedio de notas de todo el grado.
  const promedioGrado = sumaPromedios / alumnos.length;

  console.log("Resumen del Grado")
  console.log(`Alumnos cargados: ${alumnos.length}`);
  console.log(`Promedio general del grado: ${promedioGrado.toFixed(1)}`);
  console.log(`Aprobados: ${aprobados}`);
  console.log(`En riesgo: ${enRiesgo}`);
  
}

//Registro de algunos alumnos:


console.log("Registro de algunos:");

registrarAlumno("Luz", 8, 7, 9);
registrarAlumno("Joaquín", 6, 5, 7);
registrarAlumno("Lautaro", 3, 4, 5);
registrarAlumno("Mariela", 5, 6, 4);
registrarAlumno("Alan", 8, 5, 7);
registrarAlumno("Thiago", 10, 9, 10);

mostrarResumenCurso();

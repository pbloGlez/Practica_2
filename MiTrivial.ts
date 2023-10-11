alert("Mete true o false para contestar las preguntas (T/F)");

//Array para las preguntas y las respuestas
const preguntas: string[] = []
const resp: string[] = []
//almacenar ptos
type Resultado = {
    Jugadores: number[]
    Ptos: number[]
};

function sumarPtos(tipo: Resultado, posicion: number): Resultado{
    const cambioTipo: Resultado = {...tipo}
    if (posicion < 0 || posicion >= cambioTipo.Jugadores.length) {
        throw new Error("Pero si solo hay "+(tipo.Jugadores.length-1)+" jugadores ");
      }
        cambioTipo.Ptos[posicion] += 1;
      return cambioTipo;
}
function imprimirVectores(tipo: Resultado) {
    for (let i = 0; i < tipo.Jugadores.length; i++) {
      const elemento = tipo.Jugadores[i];
      console.log("Jugador"+i+" "+tipo.Ptos[i]+"\n");
    }
  }
function encontrarGanadores(resultados: Resultado): number[] {
    // Se obtiene la puntuación máxima
    const maxPuntos = Math.max(...resultados.Ptos); 
    const ganadores: number[] = [];
  
    for (let i = 0; i < resultados.Jugadores.length; i++) {
      if (resultados.Ptos[i] === maxPuntos) {
        ganadores.push(resultados.Jugadores[i]);
      }
    }
    return ganadores;
  }

const dif = prompt("Selecciona la dificultad de las preguntas aqui... (E/M/H)");
const input = prompt("Indica el numero de Jugadores:");
if (input === null) {
    console.log("No has escrito nada");
  } else {
    const numeroJugadores = parseInt(input, 10);
     let player1: Resultado = {
      Jugadores: [],
      Ptos: [],
    };
    for(let s=0;s<numeroJugadores;s++){
      player1.Jugadores.push(s);
      player1.Ptos.push(0);
    }
  const nPreg = prompt("¿Cuantas preguntas quieres por jugador? :");
  if(nPreg==null){
      console.log("Error, no hay preguntas");
  }else{
  const pTotales = parseInt(nPreg, 10)*numeroJugadores;
  
  fetch("https://opentdb.com/api.php?amount=" + pTotales + "&difficulty=" + dif + "&type=boolean").then((res) => {
    res.json().then((data: { results: { question: string; correct_answer: string }[] }) => { // Especifica el tipo de 'data'
      data.results.forEach((resultado) => {
        preguntas.push(resultado.question);
        resp.push(resultado.correct_answer);
      });

      function Turno(pregunta: string, respuesta: string, numero:number) {
        const respuestaJugador = prompt(pregunta);
        if (respuestaJugador === respuesta) {
          alert("¡Respuesta correcta!");
          player1=sumarPtos(player1,numero);
        } else {
          alert("¡Respuesta incorrecta!");
        }
        return player1;
      }
      let aux=0 ;
      for (let i = 0; i < preguntas.length; i++) {
        
        if(aux>numeroJugadores-1){
          aux=0;
        }
        const pregunta = preguntas[i];
        const respuesta = resp[i];
        player1=Turno(pregunta, respuesta,aux);
        aux++;
      }
      
      alert("Rondas terminadas,quereis ver quien gano?");
      imprimirVectores(player1);
      const ganadores = encontrarGanadores(player1);

      if (ganadores.length === 1) {
        alert("El jugador " + ganadores[0] + " es el ganador.");
       } else if (ganadores.length > 1) {
        alert("Los jugadores " + ganadores.join(", ") + " son ganadores.");
        } else {
        alert("No hay ganadores.");
      }
      
      alert("System delete...");
    });
})}}


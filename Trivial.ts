const apiUrl = 'https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple';
interface Pregunta {
    pregunta: string;
    opciones: string[];
    respuesta: number;
}

interface Jugador {
    nombre: string;
    aciertos: number;
}

async function obtenerPregunta(categoria: number, dificultad: string): Promise<Pregunta> {
    const url = `${apiUrl}?amount=1&category=${categoria}&difficulty=${dificultad}&type=multiple`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const pregunta = datos.results[0];

    const opciones = pregunta.incorrect_answers;
    const respuestaCorrectaIndex = Math.floor(Math.random() * (opciones.length + 1));
    opciones.splice(respuestaCorrectaIndex, 0, pregunta.correct_answer);

    return {
        pregunta: pregunta.question,
        opciones: opciones,
        respuesta: respuestaCorrectaIndex + 1,
    };
}

async function leerEntrada(mensaje: string): Promise<string> {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(mensaje));
    const n = <number> await Deno.stdin.read(buf);
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function jugarTrivia(jugadores: Jugador[], preguntasPorJugador: number) {
    for (let i = 0; i < jugadores.length; i++) {
        const jugador = jugadores[i];
        console.log(`\n${jugador.nombre}, es tu turno.`);

        for (let j = 0; j < preguntasPorJugador; j++) {
            const pregunta = await obtenerPregunta(2, 'medium'); // Categoría 9 es general knowledge y dificultad medium
            console.log(`\nPregunta ${j + 1}: ${pregunta.pregunta}`);
            pregunta.opciones.forEach((opcion, index) => {
                console.log(`${index + 1}. ${opcion}`);
            });

            const respuesta = parseInt(await leerEntrada('Tu respuesta: '));
            if (respuesta === pregunta.respuesta) {
                console.log('¡Correcto!\n');
                jugador.aciertos++;
            } else {
                console.log(`Respuesta incorrecta. La respuesta correcta era la opción ${pregunta.respuesta}\n`);
            }
        }
    }

    // Determinar el ganador
    let maxAciertos = 0;
    let ganadores: Jugador[] = [];

    for (const jugador of jugadores) {
        if (jugador.aciertos > maxAciertos) {
            maxAciertos = jugador.aciertos;
            ganadores = [jugador];
        } else if (jugador.aciertos === maxAciertos) {
            ganadores.push(jugador);
        }
    }

    if (ganadores.length === 1) {
        console.log(`\n¡${ganadores[0].nombre} es el ganador con ${ganadores[0].aciertos} aciertos!`);
    } else {
        const nombresGanadores = ganadores.map((ganador) => ganador.nombre).join(' y ');
        console.log(`\n¡Hay un empate! ${nombresGanadores} tienen ${maxAciertos} aciertos y son los ganadores.`);
    }
}

async function main() {
    const numeroJugadores = parseInt(await leerEntrada('Número de jugadores: '));
    const jugadores: Jugador[] = [];
    for (let i = 0; i < numeroJugadores; i++) {
        const nombre = await leerEntrada(`Nombre del jugador ${i + 1}: `);
        jugadores.push({ nombre: nombre, aciertos: 0 });
    }

    const preguntasPorJugador = parseInt(await leerEntrada('Número de preguntas por jugador: '));

    await jugarTrivia(jugadores, preguntasPorJugador);
}

await main();





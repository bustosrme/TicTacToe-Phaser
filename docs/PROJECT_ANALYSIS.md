# Análisis técnico y plan de mejoras

## Resumen

Este proyecto es un juego de Tic-Tac-Toe (Tres en línea) para dos personas que
comparten el mismo dispositivo. Está desarrollado con Phaser 3 y TypeScript,
usa Parcel como servidor y empaquetador, y presenta una interfaz vertical
orientada principalmente a dispositivos móviles.

No incluye inteligencia artificial, multijugador en red, marcador acumulado ni
persistencia. La elección de X u O determina qué símbolo realiza el primer turno;
no representa por sí misma la asignación de un jugador identificado.

## Tecnologías y configuración

- Phaser 3.87 para escenas, entrada, audio, animaciones y renderizado.
- TypeScript 5.7 con comprobación estricta.
- Parcel 1 como servidor de desarrollo y empaquetador de producción.
- `parcel-plugin-static-files-copy` para copiar los recursos estáticos.
- Resolución lógica de 360 x 640 píxeles.
- Escalado `FIT` y centrado horizontal y vertical del canvas.
- Fuentes Montserrat, imágenes PNG y audio MP3 almacenados localmente.

La entrada de Parcel es `index.html`. `src/index.ts` crea el juego, registra las
escenas y comienza la precarga.

## Estructura

```text
index.html                  Entrada de Parcel y declaración de fuentes
src/index.ts                Creación del juego y registro de escenas
src/config/config.ts        Configuración compartida de Phaser
src/scenes/PreloadScene.ts  Carga de recursos
src/scenes/MainScene.ts     Menú principal
src/scenes/SelectScene.ts   Selección del símbolo inicial
src/scenes/GameScene.ts     Tablero, turnos, reloj y resultado
src/scenes/WinnerScene.ts   Presentación del resultado y navegación
static/assets/              Imágenes, sonidos y fuentes
```

## Flujo de escenas

```text
Preload -> Main -> Select -> Game -> Winner
                    ^                  |
                    |---- reiniciar ---|

Winner -> Main (botón de inicio)
```

1. `Preload` carga todos los recursos y abre `Main`.
2. `Main` muestra el título y un botón para jugar.
3. `Select` pregunta qué símbolo juega primero.
4. `Game` recibe el símbolo mediante `buttonPressed` e inicia la partida.
5. `Winner` recibe el ganador, o `null` si hubo empate.
6. Desde el resultado se puede volver al inicio o regresar a la selección para
   jugar otra partida.

## Funcionamiento de la partida

### Estado interno

El tablero es una matriz de 3 x 3. Cada posición contiene `null`, `'X'` u `'O'`.
El estado principal de la escena incluye:

- `board`: ocupación lógica de las nueve casillas.
- `currentPlayer`: símbolo que dispone del turno.
- `counter`: cantidad de jugadas realizadas.
- `checking`: bloqueo de entrada mientras se completa una jugada.
- `timeLimit`: duración configurada para cada turno, actualmente 10 segundos.
- `timeLeft`: tiempo restante del turno actual.

### Ejecución de una jugada

Cuando se pulsa una casilla libre:

1. Se ignora la entrada si la casilla está ocupada o se está comprobando otra
   jugada.
2. Se reproduce el sonido de pulsación.
3. El reloj se restaura al límite configurado.
4. El símbolo actual se guarda en la matriz.
5. Su imagen cae hacia la casilla con una animación de rebote de 500 ms.
6. Se incrementa el contador y se alterna el jugador actual.
7. Al finalizar la animación se comprueba el resultado.

`checking` evita entradas adicionales durante la animación y la comprobación.
La imagen del tablero se dibuja sobre las casillas, pero no recibe entrada y por
ello no impide que los rectángulos interactivos detecten las pulsaciones.

### Victoria y empate

Se revisan las tres filas, las tres columnas y las dos diagonales. Cuando una
línea contiene tres símbolos iguales se envía ese símbolo a `WinnerScene`.
Si las nueve casillas están ocupadas y no existe una línea ganadora, se envía
`null` para representar un empate.

Al finalizar se detiene la música, se reproduce el sonido `Win` y se abre la
pantalla de resultado. El mismo sonido se utiliza actualmente para victoria y
empate.

### Temporizador

Un evento repetitivo descuenta un segundo de `timeLeft`. Si el valor llega a
cero, vuelve a 10 y se alterna el jugador sin colocar ninguna ficha. Por tanto,
agotar el tiempo implica perder el turno.

## Presentación y audio

- El menú y la selección usan fondos, paneles redondeados y efectos de escala al
  pasar el puntero sobre los botones.
- Las fichas se introducen con una animación de caída y rebote.
- La partida reproduce música en bucle.
- Las interacciones reproducen `Tap`.
- La pantalla final genera partículas y muestra el símbolo ganador cuando lo hay.
- Inicio y reinicio son controles separados; reiniciar conduce a la selección
  del primer símbolo.

## Hallazgos y correcciones recomendadas

### Prioridad alta: estado residual en `WinnerScene`

Phaser reutiliza la instancia de una escena. `WinnerScene.init()` solo modifica
`title` y `winner` cuando recibe un ganador. Después de mostrar una victoria, un
empate posterior puede conservar el ganador y el título anteriores.

La inicialización debe asignar siempre el nuevo resultado, incluyendo el caso
`null`, y derivar el título a partir de ese valor.

### Prioridad alta: estado residual en `GameScene`

`GameScene.init()` reinicia el tablero, el contador y el jugador, pero no
restaura explícitamente `timeLeft` ni `checking`. Una partida nueva puede heredar
el tiempo restante de la anterior. Aunque `checking` normalmente termina en
`false`, debe restablecerse para que cada partida tenga un estado inicial
completo y determinista.

### Prioridad alta: ciclo de vida del temporizador

El temporizador continúa activo durante los 500 ms de animación y comprobación.
El jugador se alterna inmediatamente al registrar la ficha, por lo que una parte
del turno siguiente transcurre mientras la entrada está bloqueada. Cerca del
vencimiento también puede producirse una alternancia adicional durante esa
transición.

Se recomienda pausar o controlar el reloj mientras se resuelve una jugada,
alternar el jugador una vez completada la comprobación y detener explícitamente
el evento al finalizar la partida.

### Prioridad media: estado visual inicial del turno

El texto de turno y el reloj se crean vacíos. No muestran información hasta que
se ejecuta el primer tick, aproximadamente un segundo después de abrir la escena.
Ambos deben inicializarse durante `create()` antes de activar el temporizador.

### Prioridad media: formato del reloj

La expresión `0:0${timeLeft}` solo produce una presentación correcta para valores
de un dígito. El valor 10 se representaría como `0:010`. Conviene usar
`padStart(2, '0')` o una función dedicada, de manera que se muestre `0:10`,
`0:09`, etc.

### Prioridad media: administración de la música

Cada ejecución de `GameScene.create()` agrega una nueva instancia de `Music`.
`stopByKey()` normalmente detiene las reproducciones, pero conservar una
referencia permite detener y destruir exactamente la instancia perteneciente a
la escena. También facilita limpiar el audio al abandonar la partida por
cualquier ruta futura.

### Prioridad media: nombre de la fuente

La familia registrada en `index.html` es `Montserrat`, pero varias escenas usan
`Monserrat`. El navegador puede sustituir esos textos por una fuente de sistema.
Todas las referencias deben usar la grafía `Montserrat`.

### Prioridad media: doble inclusión de Phaser

`index.html` carga `node_modules/phaser/dist/phaser.js`, mientras que el código
TypeScript también importa `phaser`. Se debe mantener una sola estrategia. En un
proyecto empaquetado con Parcel, la opción coherente es importar Phaser desde el
código y retirar el script global del HTML, verificando después el bundle y la
ejecución.

### Prioridad baja: semántica del sonido final

Un empate reproduce el mismo sonido que una victoria. Se debe decidir si esto es
intencional. Si no lo es, el empate puede terminar sin `Win` o usar un recurso
específico.

### Prioridad baja: tipos y limpieza del código

- Usar `boolean` en lugar del objeto `Boolean`.
- Retirar `async` y `await` del listener de casilla, ya que `handleCellClick()`
  es síncrono.
- Eliminar variables locales que guardan objetos nunca consultados.
- Completar los puntos y coma conforme a las convenciones del repositorio.
- Mantener los cambios de formato limitados a las líneas afectadas.

### Prioridad baja: metadatos del proyecto

- `LICENSE` y el README indican MIT, pero `package.json` declara ISC. El valor de
  `package.json` debe cambiarse a `MIT`.
- `package.json` declara `index.js` como `main`, aunque esa no es la entrada real
  de la aplicación. Al tratarse de una aplicación web y no de una librería, la
  propiedad puede retirarse.
- La descripción, autor y palabras clave están vacíos y pueden completarse si se
  desea publicar o presentar el proyecto.

### Pruebas

No existe un framework de pruebas automatizadas. La lógica de victoria está
acoplada a una escena de Phaser, lo que dificulta probarla sin arrancar el motor.
No es necesario introducir un framework para corregir los defectos actuales,
pero a medio plazo conviene extraer reglas puras del tablero y cubrirlas con
pruebas unitarias.

## Plan de corrección

### Fase 1: corregir el ciclo de partida

1. Restablecer `winner` y `title` en cada ejecución de `WinnerScene.init()`.
2. Restablecer tablero, contador, bloqueo, jugador y reloj en
   `GameScene.init()`.
3. Inicializar inmediatamente los textos del turno y el reloj.
4. Centralizar el cambio de turno para que actualice jugador, tiempo y textos de
   forma consistente.
5. Evitar que el temporizador consuma tiempo durante una jugada en animación.
6. Detener el temporizador antes de cambiar a `WinnerScene`.

Criterio de aceptación: victorias, empates y partidas consecutivas nunca heredan
estado; cada turno dispone de diez segundos completos y su texto coincide con el
jugador que realmente puede pulsar.

### Fase 2: corregir recursos y ciclo de vida

1. Corregir `Monserrat` por `Montserrat`.
2. Conservar una referencia a la música de la partida y limpiarla al terminar o
   cerrar la escena.
3. Retirar la carga global redundante de Phaser de `index.html` y validar que
   Parcel lo incluya desde los imports.
4. Confirmar y aplicar la decisión de audio para empates.

Criterio de aceptación: la fuente local aparece en todas las pantallas, solo hay
una reproducción musical y Phaser se incluye una sola vez.

### Fase 3: mantenimiento y metadatos

1. Reemplazar `Boolean` por `boolean` y retirar asincronía innecesaria.
2. Eliminar variables no utilizadas y normalizar la puntuación solo en archivos
   modificados.
3. Alinear la licencia de `package.json` con MIT y revisar `main`, descripción,
   autor y palabras clave.
4. Actualizar el README si alguna decisión cambia el comportamiento observable.

Criterio de aceptación: el código supera la comprobación estricta y los metadatos
no se contradicen.

### Fase 4 opcional: reglas comprobables automáticamente

1. Extraer la representación del tablero y la detección de resultado a un módulo
   TypeScript sin dependencias de Phaser.
2. Introducir un ejecutor de pruebas ligero compatible con el proyecto.
3. Cubrir filas, columnas, diagonales, empate, tablero incompleto y movimientos
   sobre casillas ocupadas.

Esta fase es recomendable, pero debe realizarse aparte de los arreglos para no
ampliar innecesariamente el riesgo de la primera corrección.

## Validación prevista

Después de implementar cada fase se debe ejecutar:

```bash
npx tsc --noEmit
npm run build
```

La verificación manual debe incluir:

- Comenzar tanto con X como con O.
- Ganar con cada una de las tres filas, tres columnas y dos diagonales.
- Provocar un empate después de una victoria y una victoria después de un empate.
- Reiniciar varias veces desde la pantalla final.
- Volver al inicio y comenzar una partida nueva.
- Dejar vencer turnos consecutivos y jugar cerca del segundo cero.
- Intentar pulsar durante la animación y sobre una casilla ocupada.
- Confirmar música, sonidos, fuente y partículas.
- Comprobar el escalado en ventanas estrechas y anchas.
- Confirmar que `dist/` no se incorpora al control de versiones.

## Limitación de la revisión actual

El análisis se realizó sobre todo el código fuente, la configuración, el listado
de recursos y la licencia. En el entorno utilizado, `npx` no estaba disponible,
por lo que todavía no se pudieron ejecutar la comprobación de TypeScript, el
build ni la validación interactiva en el navegador.

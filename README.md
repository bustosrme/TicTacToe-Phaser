# TicTacToe Phaser Game

Este es un juego de **TicTacToe (Tres en línea)** creado con **Phaser**. El juego tiene un menú principal, una escena de selección de jugador, una escena de juego con música y un temporizador por turno. Además, muestra una pantalla de resultados con un botón para volver al inicio o reiniciar la partida.

## Descripción del Juego

El juego de **TicTacToe** consiste en una cuadrícula de 3x3 donde dos jugadores (X y O) se turnan para colocar su marca en la cuadrícula con el objetivo de alinear tres de sus marcas de manera horizontal, vertical o diagonal.

### Características:
- **Menú Principal**: Un menú donde puedes empezar el juego.
- **Selección de Jugador**: El primer jugador puede seleccionar si jugar como **X** o **O** antes de comenzar.
- **Escena de Juego**: Durante la partida, se juega con un temporizador por turno y música de fondo.
- **Pantalla de Resultado**: Al finalizar el juego, se muestra quién ganó o si fue un empate. También tiene un botón para volver al menú principal o para reiniciar la partida.
- **Música y Temporizador**: La música se reproduce durante la partida y el temporizador cuenta el tiempo de cada turno.

## Cómo Ejecutar el Proyecto

### Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener **Node.js** y **npm** instalados en tu máquina. Puedes verificar si los tienes instalados con los siguientes comandos:    

### Instalación

1. Clona el repositorio de este proyecto a tu máquina local.
2. Navega al directorio del proyecto en tu terminal.
3. Instala las dependencias necesarias para ejecutar el proyecto.

```
npm install
```

### Ejecutar en Desarrollo

Para ejecutar el juego en modo desarrollo, utiliza el siguiente comando:

```bash
npm run start
```

### Hacer un Build para Producción

Para crear una versión optimizada del proyecto lista para producción, ejecuta el siguiente comando:
```bash
npm run build
```
Este comando generará los archivos optimizados en una carpeta (generalmente dist/) que puedes desplegar en un servidor o plataforma de hosting.

## Enlace para Probar el Juego

Puedes probar el juego en vivo en el siguiente enlace (si está desplegado):

[Prueba el juego aquí](https://tictactoe-mauroebr.pages.dev)

## Diseño

El diseño del juego fue basado en el siguiente **Figma**. Puedes ver el diseño y los detalles de la interfaz aquí:

[Diseño en Figma](https://www.figma.com/community/file/950288920087501966/tic-tac-toe-interactive-components)

## Tecnologías Utilizadas

- **Phaser**: Framework para el desarrollo de juegos 2D.
- **HTML5** y **CSS3**: Para la estructura y estilo de la interfaz.
- **JavaScript (ES6+)**: Para la lógica y mecánicas del juego.
- **Node.js** y **Parcel**: Para el bundling y servidor local de desarrollo.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

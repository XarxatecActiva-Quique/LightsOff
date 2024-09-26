const MAXCELL = 25;
const MINCELL = 0;

document.addEventListener('DOMContentLoaded', () => {
    const wizard = document.getElementById('wizard');
    const otherImage = document.getElementById('otherImage');
    let posX = 0;
    let posY = 0;
    const maxPos = 250;
    const maxPosY = 200;
    const interval = 25;
    let direction = 'down-right'; // Puede ser 'down-right', 'up-right', 'down-left', 'up-left'
    let wizardId, otherImageId;

    function frame() {
        switch (direction) {
            case 'down-right':
                if (posX >= maxPos || posY >= maxPosY) {
                    direction = 'up-right';
                } else {
                    posX++;
                    posY++;
                }
                break;
            case 'up-right':
                if (posY <= 0) {
                    direction = 'down-left';
                } else {
                    posX++;
                    posY--;
                }
                break;
            case 'down-left':
                if (posX <= 0 || posY >= maxPosY) {
                    direction = 'up-left';
                } else {
                    posX--;
                    posY++;
                }
                break;
            case 'up-left':
                if (posY <= 0) {
                    direction = 'down-right';
                } else {
                    posX--;
                    posY--;
                }
                break;
        }
        wizard.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    function otherImageFrame() {
        otherImage.style.transform = `translateY(${posY}px)`;
        posY = (posY + 1) % window.innerHeight;
    }

    function startMovement() {
        wizardId = setInterval(frame, interval);
        otherImageId = setInterval(otherImageFrame, interval);
    }

    function stopMovement() {
        clearInterval(wizardId);
        clearInterval(otherImageId);
    }

    // Iniciar el movimiento al cargar la página
    startMovement();

    // Simulación de pasar de nivel 
    setTimeout(() => {
        stopMovement();
        // Reiniciar el movimiento después de pasar de nivel
        setTimeout(startMovement, 2000); // Reiniciar después de 2 segundos
    }, 10000); // Detener después de 10 segundos
});


// Crea el tablero inicial mediante un número de jugadas aleatorias según el nivel

function initialBoard() {
    for (let i = 1; i <= gameLevel; i++) {
        let randomCell = Math.floor(Math.random() * (MAXCELL - MINCELL) + MINCELL);
        selectTypeCellAndChangeCellState(randomCell);
        cells = document.querySelectorAll(".cell");
    }
}

// Determina el tipo de celda (esquina, lateral, central) y cambia el estado de las celdas afectadas
function selectTypeCellAndChangeCellState(randomCell) {
    if (randomCell == 0) {
        leftTopCorner(randomCell);
    } else if (randomCell == 4) {
        rightTopCorner(randomCell);
    } else if (randomCell == 20) {
        leftBottomCorner(randomCell);
    } else if (randomCell == 24) {
        rightBottomCorner(randomCell);
    } else if (randomCell > 0 && randomCell < 4) {
        topCentralFile(randomCell);
    } else if (randomCell > 20 && randomCell < 24) {
        bottomCentralFile(randomCell);
    } else if (randomCell % 5 == 0) {
        leftCentralFile(randomCell);
    } else if ((randomCell + 1) % 5 == 0) {
        rightCentralFile(randomCell);
    } else {
        centralCell(randomCell);
    }
}

// Grupo de funciones que marcan las celdas afectadas según el tipo de celda principal
function leftTopCorner(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index + 1]);
    changeCellState(cells[index + 5]);
}

function rightTopCorner(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 1]);
    changeCellState(cells[index + 5]);
}

function leftBottomCorner(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index + 1]);
    changeCellState(cells[index - 5]);
}

function rightBottomCorner(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 1]);
    changeCellState(cells[index - 5]);
}

function topCentralFile(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 1]);
    changeCellState(cells[index + 1]);
    changeCellState(cells[index + 5]);
}

function bottomCentralFile(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 1]);
    changeCellState(cells[index + 1]);
    changeCellState(cells[index - 5]);
}

function leftCentralFile(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 5]);
    changeCellState(cells[index + 5]);
    changeCellState(cells[index + 1]);
}

function rightCentralFile(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 5]);
    changeCellState(cells[index + 5]);
    changeCellState(cells[index - 1]);
}

function centralCell(index) {
    changeCellState(cells[index]);
    changeCellState(cells[index - 5]);
    changeCellState(cells[index + 5]);
    changeCellState(cells[index - 1]);
    changeCellState(cells[index + 1]);
}

// Cambia el color de la celda pasada como parámetro
function changeCellState(cellElement) {
    const isCellOff = cellElement.classList.contains("bg-light-off");
    if (isCellOff) {
        cellElement.classList.replace("bg-light-off", "bg-light-on");
    } else {
        cellElement.classList.replace("bg-light-on", "bg-light-off");
    }
}

// Comprueba si todas las celdas están apagadas (off)
function checkIsAllLightsOff(cells) {
    let isAllLightsOff = false;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("bg-light-on")) {
            isAllLightsOff = false;
            break;
        } else {
            isAllLightsOff = true;
        }
    }
    return isAllLightsOff;
}

// Acciones si el jugador resuelve el nivel
function isWinner() {
    gameLevel++;
    setTimeout(() => {
        newGame();
    }, 500);
}

// Movimiento del jugador
function playerMove() {
    cells.forEach((node, index) => {
        const handler = handleCellClick(index);
        node.addEventListener("click", handler);
        node.handler = handler;
    });
}

// Acciones cuando el jugador clickea una celda
function handleCellClick(index) {
    return function () {
        movementCounter++;
        showMovements();
        selectTypeCellAndChangeCellState(index);
        checkIsAllLightsOff(cells);
        if (checkIsAllLightsOff(cells)) isWinner();
    };
}

function showLevel() {
    const textLevel = "Nivel: " + gameLevel;
    const level = document.querySelector("#levelGame");
    level.textContent = textLevel;
}

function showMovements() {
    const textMovements = "Movimientos: " + movementCounter;
    const moveCounter = document.querySelector("#moveCounter");
    moveCounter.textContent = textMovements;
}

// Procedimiento para empezar un nuevo nivel
function newGame() {
    showLevel();

    // Elimina los eventListener, si los hay
    cells.forEach((node) => {
        if (node.handler) {
            node.removeEventListener("click", node.handler);
            delete node.handler;
        }
    });

    initialBoard();
    playerMove();

    startMovement(); // Iniciar el movimiento del mago al comenzar un nuevo nivel
}

let cells = document.querySelectorAll(".cell");
let gameLevel = 1;
let movementCounter = 0;

newGame();

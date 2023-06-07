let side = 'spectator';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

let paddleHeight = 140;
let paddleWidth = 11;

socket.on('playersData', (playersData) => {
    const player = playersData.find((player) => player.id === socket.id);
    if (player) {
        side = player.side;
    }
});

socket.on('updatePaddle', (data) => {
    if (data.player === 'left') {
        leftPaddleY = data.y;
    } else {
        rightPaddleY = data.y;
    }
});

socket.on('ballData', (data) => {
    ballX = data.x;
    ballY = data.y;
});

socket.on('paddleData', (data) => {
    paddleWidth = data.width;
    paddleHeight = data.height;
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;
});

socket.on("waitForPlayer", () => { //Tela de aguardo
    let waitingScreen = document.getElementById("waitingScreen");
    document.querySelector('#waitingText').innerText = "Aguardando segundo jogador...";
    waitingScreen.style.display = "flex";
});

socket.on('scoreUpdate', (data) => {
    document.querySelector('#left-score').innerText = data.left;
    document.querySelector('#right-score').innerText = data.right;
});

socket.on('startGame', () => {     //Aguardando ate comecar a partida
    let waitingScreen = document.getElementById("waitingScreen");
    document.querySelector('#waitingText').innerText = "Partida iniciada";
    setTimeout(() => {
        waitingScreen.style.display = "none";
        startGame();
    }, 1000);
});

function drawBall() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    drawBall();

    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (event) => {
    if (side !== 'spectator') {
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (side === 'left') leftPaddleY = mouseY - paddleHeight / 2;
        else rightPaddleY = mouseY - paddleHeight / 2;

        socket.emit('updatePaddle', {player: side, y: mouseY - paddleHeight / 2});
    }
});

const startGame = () => {
    draw();
}


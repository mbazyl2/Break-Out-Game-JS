var canvas;
var ctx;

var ballX = 75;
var ballSpeedX = 5;
var ballY = 75;
var ballSpeedY = 7;

var paddleX  = 100;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 60;




function updateMousePosition(evt){
	var rect = canvas.getBoundingClientRect(); 					// to check
	var root = document.documentElement;						// to check
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	// var mouseY = evt.clientY - rect.top - root.scrollTop;
	paddleX = mouseX - PADDLE_WIDTH/2;
	console.log('mouse Moved '+mouseX);
}



window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', updateMousePosition);
}

function updateAll() {
	drawAll();
	moveAll();
}

function ballReset() {
	// if(ballY >= 600) {
		ballX = canvas.width/2;
		ballY = canvas.height/2;
	// }
}

function moveAll() {
	ballX += ballSpeedX;

	if(ballX > canvas.width) {	// when ball reaches right edge of canvas, it chages movement direction
		ballSpeedX *= -1; 		//	ballSpeedX = -ballSpeedX; same result, different notation
	}
	if(ballX < 0) {				// left edge
		ballSpeedX *= -1;		// by manipulating this parameter ex. -1,05 ball will move faster at each left side hit
	}

	ballY += ballSpeedY;

	if(ballY > canvas.height) {		// down
		// ballSpeedY *= -1;
		ballReset();
	}
	if(ballY < 0)	{				// top
		ballSpeedY *= -1;
	}

	var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

	// managing ball reflection with the paddle
	if ( ballY > paddleTopEdgeY &&  	// ball below top of the paddle
		ballY < paddleBottomEdgeY &&  	// above bottom of the paddle
		ballX > paddleLeftEdgeX &&  	// ball on the right from the left edge 
		ballX < paddleRightEdgeX){		// ball on the left from the right edge

		ballSpeedY *= -1;
	}

}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');				 
	colorRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white')
}

function colorCircle(circleCenterX,circleCenterY, radius, fillColor){
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(circleCenterX,circleCenterY, radius, 0,Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
}

function colorRect(topLeftX, topLeftY, width, height, drawColor){
	ctx.fillStyle = drawColor;
	ctx.fillRect(topLeftX, topLeftY, width, height);
}
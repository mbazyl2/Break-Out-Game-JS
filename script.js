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

var mouseX;
var mouseY;

const BRICK_W = 100;
const BRICK_H = 50;
const BRICK_COUNT = 8;
const BRICK_GAP = 2;

var brickGrid = new Array(BRICK_COUNT);

function updateMousePosition(evt){
	var rect = canvas.getBoundingClientRect(); 					// to check
	var root = document.documentElement;						// to check

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - PADDLE_WIDTH/2;
	// console.log('mouse Moved '+mouseX); // used this for debbuging issues
}

	function brickReset(){
		for(var i=0; i<BRICK_COUNT; i++){
			if(Math.random() < 0.5){
			brickGrid[i] = true;
		} else {
			brickGrid[i] = false;
		} // end of else ( rand check )
	}	// end of for each brick
}	// end of brickReset function


window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', updateMousePosition);
	brickReset();
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

		var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
		ballSpeedX = ballDistFromPaddleCenterX * 0.4;
	}

}

function drawBricks() {
	for(var i=0; i<BRICK_COUNT; i++) {
		if(brickGrid[i]){
			colorRect((BRICK_W*i), 0, BRICK_W-BRICK_GAP, BRICK_H, 'blue');
		} // end of is this brick here
	}	// end of for each brick
} // end of drawBricks

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');				 
	colorRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
	drawBricks();
	var mouseBrickRow = mouseX/BRICK_W; 	// 	variables for debbuging issues
	var mouseBrickCol = mouseY/BRICK_H;	//
	colorText(mouseBrickRow+","+mouseBrickCol, mouseX, mouseY, 'yellow'); // originaly shows mouseX and mouseY position
	
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
function colorText(showWords, textX, textY, fillColor){
	ctx.fillStyle = fillColor;
	ctx.fillText(showWords, textX,textY);
}
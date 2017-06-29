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

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
const BRICK_GAP = 2;

var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

function updateMousePosition(evt){
	var rect = canvas.getBoundingClientRect(); 					// to check
	var root = document.documentElement;						// to check

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - PADDLE_WIDTH/2;
	// console.log('mouse Moved '+mouseX); // used this for debbuging issues
}

	function brickReset(){
		for(var i=0; i<BRICK_COLS * BRICK_ROWS; i++){
			brickGrid[i] = true;
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

	var ballBrickRow = Math.floor(ballY/BRICK_H); 	// 	variables for debbuging issues
	var ballBrickCol = Math.floor(ballX/BRICK_W);	
	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
	
	if(brickIndexUnderBall >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
		if(brickGrid[brickIndexUnderBall]){
		brickGrid[brickIndexUnderBall] = false;
		ballSpeedY *= -1;
		}
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

function rowColToArrayIndex(col, row) {
	return col + (BRICK_COLS * row);
}

function drawBricks() {
	for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++){
		for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow); // mapping bricks

			if(brickGrid[arrayIndex]){
				colorRect((BRICK_W*eachCol), BRICK_H*eachRow, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, 'blue');
			} // end of is this brick here
		}	// end of for each brick
	}
} // end of drawBricks

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, 10, 'white');				 
	colorRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
	drawBricks();
	// var mouseBrickRow = Math.floor(mouseY/BRICK_H); 	// 	variables for debbuging issues
	// var mouseBrickCol = Math.floor(mouseX/BRICK_W);	
	// var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
	//colorText(mouseBrickCol+","+mouseBrickRow+":"+brickIndexUnderMouse, mouseX, mouseY, 'yellow'); // originaly shows mouseX and mouseY position
	
	// if(brickIndexUnderMouse >= 0 && brickIndexUnderMouse < BRICK_COLS*BRICK_ROWS){
	//		brickGrid[brickIndexUnderMouse] = false;
	// }
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
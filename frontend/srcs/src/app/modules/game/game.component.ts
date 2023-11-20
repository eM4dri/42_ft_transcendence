import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MySocket } from '../../services/web-socket.service';
import { GameService } from 'src/app/services';
import { interval } from 'rxjs'
import { take } from 'rxjs/operators';
import { Ball, Paddle, Game } from './game.classes';

let gcomp: GameComponent;

var blue_paddleauraimg = new Image();
var blue_paddleimg = new Image();
blue_paddleauraimg.src = "http://localhost:8081/game_assets/aura_blue.svg"
blue_paddleimg.src = "http://localhost:8081/game_assets/paddle_blue.svg"

var red_paddleauraimg = new Image();
var red_paddleimg = new Image();
red_paddleauraimg.src = "http://localhost:8081/game_assets/aura_red.svg"
red_paddleimg.src = "http://localhost:8081/game_assets/paddle_red.svg"

var ballauraimg = new Image();
var ballimg = new Image();
ballauraimg.src = "http://localhost:8081/game_assets/aura_ball.svg"
ballimg.src = "http://localhost:8081/game_assets/ball.svg"

var backgroundimg = new Image();
backgroundimg.src = "http://localhost:8081/game_assets/TEMP_gamebgdebug.png"

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit
{
	/*	@ViewChild('mainCanvas') mainCanvas!: ElementRef;
		constructor(
			private readonly gameService: GameService,
			) { 
				
				gcomp = this;
				this.gameService.listeningToHelloSignal().subscribe(paddle => {
					console.log('paddle is', paddle);
				});
			}
		private context: CanvasRenderingContext2D | null;
		canvas: HTMLCanvasElement;
		ngAfterViewInit() {
				this.context = (

					this.canvas = this.mainCanvas.nativeElement as HTMLCanvasElement;
				).getContext('2d');
				this.draw()
			bluepaddle_sprite.src = '../../../../../game_assets/paddle_blue.svg'
		}
		}





		sendKeypress(msg: number) {
			this.gameService.sendKeyPress(msg);

		}
	*/
		

	gameClass = new Game(100000);

	@ViewChild('canvasEl') canvasEl!: ElementRef;
	@ViewChild('blue_paddle') blue_paddle!: ElementRef;
	@ViewChild('blue_paddle_aura') blue_paddleaura!: ElementRef;
	@ViewChild('red_paddle') red_paddle!: ElementRef;
	@ViewChild('red_paddle_aura') red_paddleaura!: ElementRef;
	@ViewChild('ball') ball!: ElementRef;
	@ViewChild('ball_aura') ballaura!: ElementRef;

	/** Canvas 2d context */
	private context!: CanvasRenderingContext2D;

	constructor(
		private readonly gameService: GameService,
		) { 
			
			gcomp = this;
			this.gameService.listeningToHelloSignal().subscribe(paddle => {
				console.log('paddle is', paddle);
				this.gameClass.bluepaddle.y = paddle.y;
				console.log('paddle found', this.gameClass.bluepaddle);
//				this.drawBluePaddle()
				this.drawComponents();
			});
			
			this.gameService.listeningToStatusUpdate().subscribe(game => {
				this.gameClass = game;
				this.drawComponents();
			});
		}

	ngAfterViewInit()
	{
		const aux = (
			this.canvasEl.nativeElement as HTMLCanvasElement
		).getContext('2d');

		if (aux)
			this.context = aux;
		
		var thegame = new Game(100000)
//		this.drawBluePaddle();
//		this.drawRedPaddle();
//		this.drawBall();
		this.startPeriodicExecution();
	}
/*
	onResize()
	{
		const canvasElement = this.canvasEl.nativeElement;
		const computedStyles = getComputedStyle(canvasElement);
		const computedWidth = computedStyles.width;
		const computedHeight = computedStyles.height;
		console.log(computedWidth, computedHeight)
	//	canvasElement.height = (+computedWidth / 2).toString();
	}*/

	sendKeypress(msg: number) {
		this.gameService.sendKeyPress(msg);
		
	}

	/**
	 * Draws something using the context we obtained earlier on
	 */

	private drawComponents()
	{
		console.log("ANGLE", this.gameClass.ball.angle, " |  DIRECTION:", this.gameClass.ball.direction)
		//	Clear the canvas
		this.context.clearRect(0, 0, 2000, 1000);

		this.context.drawImage(backgroundimg, 0, 0, 2000, 1000);

		this.context.font = "600px monospace";
		// let score: string = this.gameClass.bluescore.toString().concat(" - ").concat(this.gameClass.redscore.toString())
		// this.context.fillStyle = `rgb(255,255,0, 0.5)`
		// this.context.fillText(score, 910, 60);


		this.context.fillStyle = `rgb(50, 50, 255, 0.2)`
		this.context.fillText(this.gameClass.bluescore.toString(), 200, 700);

		this.context.fillStyle = `rgb(255, 50, 50, 0.2)`
		this.context.fillText(this.gameClass.redscore.toString(), 1200, 700);

		//	Auras
		this.context.drawImage(blue_paddleauraimg, 0, this.gameClass.bluepaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(red_paddleauraimg, 1933.33, this.gameClass.redpaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(ballauraimg, this.gameClass.ball.x * 10 - 50, this.gameClass.ball.y * 10 - 50, 100, 100)

		//	Objects
		this.context.drawImage(blue_paddleimg, 0, this.gameClass.bluepaddle.y * 10  - 100, 66.67, 200)
		this.context.drawImage(red_paddleimg, 1933.33, this.gameClass.redpaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(ballimg, this.gameClass.ball.x * 10 - 50, this.gameClass.ball.y * 10 - 50, 100, 100)

	}

	// private drawBluePaddle()
	// {

	// 	this.context.clearRect(0, 0, 2000, 1000);
	// 	blue_paddleauraimg.onload = () => {
	// 		this.context.drawImage(blue_paddleauraimg, 0, this.gameClass.bluepaddle.y * 10 - 100, 65.11627, 200)
	// 		blue_paddleauraimg.style.zIndex = "1";
	// 	};
	// 	blue_paddleimg.onload = () => {
	// 		this.context.drawImage(blue_paddleimg, 0, this.gameClass.bluepaddle.y * 10  - 100, 65.11627, 200)
	// 		blue_paddleimg.style.zIndex = "2";
	// 	};
		

	// }

	// private drawRedPaddle()
	// {		
	// 	red_paddleauraimg.onload = () => {
	// 		this.context.drawImage(red_paddleauraimg, 1940, 500, 65.11627, 200)
	// 		red_paddleauraimg.style.zIndex = "1";
	// 	};
	// 	red_paddleimg.onload = () => {
	// 		this.context.drawImage(red_paddleimg, 1940, 500, 65.11627, 200)
	// 		red_paddleimg.style.zIndex = "2";
	// 	};
		
	// 	red_paddleauraimg.src = "http://localhost:8081/game_assets/aura_red.svg"
	// 	red_paddleimg.src = "http://localhost:8081/game_assets/paddle_red.svg"
	// }

	// private drawBall()
	// {
	// 	var ballaura = new Image();
	// 	var ball = new Image();
		
	// 	ballauraimg.onload = () => {
	// 		this.context.drawImage(ballauraimg, 1000, 500, 100, 100)
	// 		ballauraimg.style.zIndex = "1";
	// 	};
	// 	ballimg.onload = () => {
	// 		this.context.drawImage(ballimg, 1000, 500, 100, 100)
	// 		ballimg.style.zIndex = "2";
	// 	};
		
	// 	ballauraimg.src = "http://localhost:8081/game_assets/aura_ball.svg"
	// 	ballimg.src = "http://localhost:8081/game_assets/ball.svg"
	// }

	front_updater(){
		this.gameClass.bluepaddle.y += paddledirection;
//		this.drawBluePaddle();
	}

	//!		requestAnimationFrame()

	startPeriodicExecution(): void {
		// Use interval from RxJS to run the function every 20ms
		const interval$ = interval(20);
	
		// Use take to limit the number of executions (optional)
		interval$.pipe().subscribe(() => {
		  this.front_updater();
		});
	  }


//	setInterval(front_updater, 20): void;
}

/*
window.addEventListener('load', function(){
	var maincanvas = document.getElementById("main_game");
	if (maincanvas != undefined)
	{
		console.log("HIIIIIIII1")
		maincanvas.style.width = "2000px";
	}
	else
	{
		console.log("BYEEEEEE1")
	}
});*/

var up_pressed: boolean = false;
var down_pressed: boolean = false;
var paddledirection: number = 0;
var last_paddledirection: number = 0;

window.addEventListener('keydown', e => {
	if (e.keyCode == 38)
		up_pressed = true;
	if (e.keyCode == 40)
		down_pressed = true;
});
	
window.addEventListener('keyup', e => {
	if (e.keyCode == 38)
		up_pressed = false;
	if (e.keyCode == 40)
		down_pressed = false;
});
	

function updater(){
	let	paddledirection = 0
	if (up_pressed)
		paddledirection -= 1;
	if (down_pressed)
		paddledirection += 1;
	if (last_paddledirection != paddledirection)
	{
		console.log(paddledirection);
		gcomp.sendKeypress(paddledirection);
	}
	
	last_paddledirection = paddledirection;
}

setInterval(updater, 20);
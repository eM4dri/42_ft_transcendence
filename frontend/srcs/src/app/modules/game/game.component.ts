import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MySocket } from '../../services/web-socket.service';
import { AuthService, GameService } from 'src/app/services';
import { interval } from 'rxjs'
import { take } from 'rxjs/operators';
import { Ball, Paddle, Game } from './game.classes';
import { UsersCache } from 'src/app/cache/users.cache'
import { User } from 'src/app/models';
import { CookieConstants } from 'src/app/utils';
import { UpperCasePipe } from '@angular/common';

let gcomp: GameComponent;

let myUserId: string;

var blue_paddleauraimg = new Image();
var blue_paddleimg = new Image();
blue_paddleauraimg.src = "assets/aura_blue.svg"
blue_paddleimg.src = "assets/paddle_blue.svg"

var red_paddleauraimg = new Image();
var red_paddleimg = new Image();
red_paddleauraimg.src = "assets/aura_red.svg"
red_paddleimg.src = "assets/paddle_red.svg"

var ballauraimg = new Image();
var ballimg = new Image();
ballauraimg.src = "assets/aura_ball.svg"
ballimg.src = "assets/ball.svg"

var backgroundimg = new Image();
backgroundimg.src = "assets/TEMP_gamebgdebug.png"

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
		

	gameClass = new Game();
	
	@ViewChild('canvasEl') canvasEl!: ElementRef;
	@ViewChild('blue_paddle') blue_paddle!: ElementRef;
	@ViewChild('blue_paddle_aura') blue_paddleaura!: ElementRef;
	@ViewChild('red_paddle') red_paddle!: ElementRef;
	@ViewChild('red_paddle_aura') red_paddleaura!: ElementRef;
	@ViewChild('ball') ball!: ElementRef;
	@ViewChild('ball_aura') ballaura!: ElementRef;

	//matchmaking
	/** Canvas 2d context */
	private context!: CanvasRenderingContext2D;
	htmlstatus = 0
	constructor(
		private readonly gameService: GameService,
		private readonly auth: AuthService,
		) { 
			this.sendMatchOngoing();
			myUserId = this.auth.readFromCookie(CookieConstants.USER_TOKEN).sub
			console.log("~~ YOUR USER ~~")
			console.log(myUserId)
			console.log("~~ ~~~~ ~~~~ ~~")

			gcomp = this;
			this.gameService.listeningToHelloSignal().subscribe(paddle => {
				console.log('paddle is', paddle);
				this.gameClass.bluepaddle.y = paddle.y;
				console.log('paddle found', this.gameClass.bluepaddle);
//				this.drawBluePaddle()
				this.drawComponents();
			});
			
			this.gameService.listeningToStatusUpdate().subscribe(game => {
				this.htmlstatus = 2;
				if (game.status == 6)		//!		Not working.  [TODO]: Does the back emit a last Game with the status updated?? 
					this.htmlstatus = 3;
				else
					this.htmlstatus = 2;
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
			this.startPeriodicExecution();
		}
		
		sendKeypress(msg: number) {
			this.gameService.sendKeyPress(msg);
			
		}

		sendMatchOngoing() {
			this.gameService.sendMatchOngoing();
		}

	playbutton() {
		this.htmlstatus = 1;
		this.gameService.playbutton();
	}
	
	cancelmatchmaking() {
		this.htmlstatus = 0;
		this.gameService.cancelmatchmaking();
	}

	gameover() {

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

		this.context.fillStyle = `rgb(50, 50, 255, 0.2)`
		this.context.fillText(this.gameClass.bluescore.toString(), 200, 700);
		
		this.context.fillStyle = `rgb(255, 50, 50, 0.2)`
		this.context.fillText(this.gameClass.redscore.toString(), 1200, 700);
		
		this.context.font = "100px monospace";

		this.context.fillStyle = `rgb(255, 255, 255, 1)`
		// if (this.gameClass.gametime < 10000)
		// 	this.context.fillText(((this.gameClass.gametime / 1000).toFixed(1)).toString(), 910, 70);
		// else
		// 	this.context.fillText(((this.gameClass.gametime / 1000).toFixed(0)).toString(), 940, 70);
		if (this.gameClass.gametime > 0)
			this.context.fillText(((this.gameClass.gametime / 1000).toFixed(this.gameClass.gametime <= 9950 ? 1 : 0)).toString(), this.gameClass.gametime < 99500 && this.gameClass.gametime > 9950 ? 940 : 910, 70);
		else
			this.context.fillText("0", 970, 70);
		//	Auras
		this.context.drawImage(blue_paddleauraimg, 0, this.gameClass.bluepaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(red_paddleauraimg, 1933.33, this.gameClass.redpaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(ballauraimg, this.gameClass.ball.x * 10 - 50, this.gameClass.ball.y * 10 - 50, 100, 100)

		//	Objects
		this.context.drawImage(blue_paddleimg, 0, this.gameClass.bluepaddle.y * 10  - 100, 66.67, 200)
		this.context.drawImage(red_paddleimg, 1933.33, this.gameClass.redpaddle.y * 10 - 100, 66.67, 200)
		this.context.drawImage(ballimg, this.gameClass.ball.x * 10 - 50, this.gameClass.ball.y * 10 - 50, 100, 100)

	}
	front_updater(){
		this.gameClass.bluepaddle.y += paddledirection;
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
var windowfocused = true;

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

window.addEventListener('blur', () => {
	windowfocused = false;
	up_pressed = false;
	down_pressed = false;
});

window.addEventListener('focus', () => {
	windowfocused = true;
});

function updater(){
	let	paddledirection = 0
	if (up_pressed)
		paddledirection -= 1;
	if (down_pressed)
		paddledirection += 1;
	if (!windowfocused)
		paddledirection = 0;
	if (last_paddledirection != paddledirection)
	{
		console.log(paddledirection);
		gcomp.sendKeypress(paddledirection);
	}
	
	last_paddledirection = paddledirection;
}

setInterval(updater, 20);
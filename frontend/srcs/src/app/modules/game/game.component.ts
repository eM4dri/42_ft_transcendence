import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MySocket } from '../../services/web-socket.service';
import { AuthService, GameService } from 'src/app/services';
import { interval } from 'rxjs'
import { share, take } from 'rxjs/operators';
import { Ball, Paddle, Game, Powerup, gameStatus } from './game.classes';
import { UsersCache } from 'src/app/cache/users.cache'
import { User } from 'src/app/models';
import { CookieConstants } from 'src/app/utils';
import { UpperCasePipe } from '@angular/common';
import { GameResult } from 'src/app/models/game/gameresult.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

let gcomp: GameComponent;

let myUserId: string;
let fallingball: number = 0;
let introtime: number = 3000;
let ball_shockwave: number = 0;
let lastcollision_x: number = 0;
let lastcollision_y: number = 0;
let ball_last_locations_x: number[] = [];
let ball_last_locations_y: number[] = [];
let bluepaddle_last_locations: number[] = [];
let redpaddle_last_locations: number[] = [];

let gameresult: GameResult
let countdown_fade = 1;
let areyoublue = true;

var blue_paddleauraimg = new Image();
blue_paddleauraimg.src = "assets/aura_blue.svg"
var blue_paddleimg = new Image();
blue_paddleimg.src = "assets/paddle_blue.svg"

var red_paddleauraimg = new Image();
red_paddleauraimg.src = "assets/aura_red.svg"
var red_paddleimg = new Image();
red_paddleimg.src = "assets/paddle_red.svg"

var ballauraimg = new Image();
ballauraimg.src = "assets/aura_ball.svg"
var ballimg = new Image();
ballimg.src = "assets/ball.svg"

var powerup1img = new Image();
powerup1img.src = "assets/powerup_speed.svg"

var powerup2img = new Image();
powerup2img.src = "assets/powerup_invis.svg"

var powerup3img = new Image();
powerup3img.src = "assets/powerup_shrink.svg"

var backgroundimg = new Image();
backgroundimg.src = "assets/TEMP_gamebgdebug.png"

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit, OnDestroy
{
	gameClass = new Game();

	@ViewChild('canvasEl') canvasEl!: ElementRef;
	@ViewChild('blue_paddle') blue_paddle!: ElementRef;
	@ViewChild('blue_paddle_aura') blue_paddleaura!: ElementRef;
	@ViewChild('red_paddle') red_paddle!: ElementRef;
	@ViewChild('red_paddle_aura') red_paddleaura!: ElementRef;
	@ViewChild('ball') ball!: ElementRef;
	@ViewChild('ball_aura') ballaura!: ElementRef;
	@ViewChild('powerup1') powerup1!: ElementRef;

	private canvasdiv!: HTMLElement;
	//matchmaking
	/** Canvas 2d context */
	private context!: CanvasRenderingContext2D;
	htmlstatus = 0
	tutorialvisible = 0;
	constructor(
		private readonly gameService: GameService,
		private readonly auth: AuthService,
		private readonly router: Router
		) { 
			this.sendMatchOngoing();
			myUserId = this.auth.readFromCookie(CookieConstants.USER_TOKEN).sub
			console.log("~~ YOUR USER ~~")
			console.log(myUserId)
			console.log("~~ ~~~~ ~~~~ ~~")

//			if (router.url == "/game/spectate" && this.htmlstatus == 0)//
//				router.navigate(["/live"]);
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
				if (game.status == gameStatus.gameout)
					this.htmlstatus = 3;
				else
					this.htmlstatus = 2;
				this.gameClass = game;
				this.drawComponents();
			});
	
			this.gameService.listeningToGameResult().subscribe(result => {
				gameresult = result;
			});

			this.gameService.listeningToTeamBlue().subscribe(_areyoublue => {
				areyoublue = _areyoublue;
				introtime = 3000;
				gameresult = {yourscore: 0, theirscore: 0, prev_points: 0, earned_points: 0, are_you_blue: false};
			});
		}
		ngOnDestroy(): void {
			this.gameService.sendDisconnected();
		}

	ngAfterViewInit()
	{
		introtime = 3000;

		const aux = (
			this.canvasEl.nativeElement as HTMLCanvasElement
		).getContext('2d');
		const aux2 = (
			this.canvasEl.nativeElement as HTMLElement
		)
		if (aux)
			this.context = aux;
		if (aux2)
			this.canvasdiv = aux2;
		this.canvasdiv.hidden = true;
		this.startPeriodicExecution();
	}

		
		sendKeypress(msg: number) {
			this.gameService.sendKeyPress(msg);
			
		}

		sendMatchOngoing() {
			this.gameService.sendMatchOngoing();
		}

	playbutton(ismodded: number) {
		if (this.router.url == "/game/spectate")
			this.router.navigate(["/game"])
		this.htmlstatus = 1;
		this.gameService.playbutton(ismodded);
	}

	tutorialbutton() {
		if (this.router.url == "/game/spectate")
			this.router.navigate(["/game"])
		this.tutorialvisible = 1;
	}
	
	cancelmatchmaking() {
		if (this.router.url == "/game/spectate")
			this.router.navigate(["/game"])
		this.htmlstatus = 0;
		this.gameService.cancelmatchmaking();
	}

	gameover() {
		if (this.router.url == "/game/spectate")
			this.router.navigate(['/live']);
		else
			this.router.navigate(['/home']);
	}

	backtomenu() {
		this.tutorialvisible = 0;
	}

	private drawComponents()
	{
		if (this.htmlstatus > 1)
		{
			this.canvasdiv.hidden = false;
		}
		else
		{
			this.canvasdiv.hidden = true;
		}
		//*		Linking the introduction interface with the frame rate of the backend (players only).
		if (this.router.url != "/game/spectate")
		{
			introtime = this.gameClass.waitEnd - 3000;
			if (introtime < 0)
				introtime = 0;
			if (this.gameClass.status != gameStatus.pregame)
				introtime = 0;
		}

		//*		Planing if the ball is falling
		if (this.gameClass.status == gameStatus.ballfalling)
		{
			fallingball = (this.gameClass.waitEnd) / 5;	//? 200 at the beginning, 0 at the end
		}
		else
			fallingball = 0;

		this.context.textAlign = "center"
		
		//*		Clearing the canvas
		this.context.clearRect(0, 0, 2000, 1000);
		this.context.drawImage(backgroundimg, 0, 0, 2000, 1000);
		

		//*		Score in the background
		this.context.font = "600px monospace";
		
		this.context.fillStyle = `rgb(50, 50, 255, 0.2)`
		this.context.fillText(this.gameClass.bluescore.toString(), 500, 700);
		
		this.context.fillStyle = `rgb(255, 50, 50, 0.2)`
		this.context.fillText(this.gameClass.redscore.toString(), 1500, 700);
		

		//*		Time left
		this.context.font = "100px monospace";
		
		this.context.fillStyle = `rgb(255, 255, 255, 1)`
		if (this.gameClass.gametime > 0)
			this.context.fillText(((this.gameClass.gametime / 1000).toFixed(this.gameClass.gametime <= 9950 ? 1 : 0)).toString(), 1000, 70);
		else
			this.context.fillText("0", 1000, 70);


		//*		When ball collides with a wall
		if (this.gameClass.ball.just_collided)
		{
			ball_shockwave = 500;			// ms
			lastcollision_x = this.gameClass.ball.x;
			lastcollision_y = this.gameClass.ball.y;
			if (lastcollision_y > 150)
				lastcollision_y += 2
			else if (lastcollision_y < 50)
				lastcollision_y -= 2
		}
		if (ball_shockwave > 0)
		{
			this.context.beginPath();
			this.context.ellipse(lastcollision_x * 10, lastcollision_y * 10, 250, 250, 0, 0, Math.PI * 2);
			const collisiongradient = this.context.createRadialGradient(lastcollision_x * 10, lastcollision_y * 10, 0, lastcollision_x * 10, lastcollision_y * 10, (500 - ball_shockwave) / 2)
			collisiongradient.addColorStop((500 - ball_shockwave) / 500, "rgb(255, 255, 50, 0)")
			collisiongradient.addColorStop(Math.pow(500 - ball_shockwave, 2) / 500000 + 0.5, "rgb(255, 255, 50," + (ball_shockwave / 500 + 0.5).toString() + ")")
			collisiongradient.addColorStop(1, "rgb(255, 255, 50, 0)")
			this.context.fillStyle = collisiongradient;
			this.context.closePath()
			this.context.fill();
			ball_shockwave -= 20;
		}


		//*		Ball and paddles aura track
		if (this.gameClass.status == gameStatus.game)
		{
			if (ball_last_locations_x.length > 19)
				ball_last_locations_x.pop()
			if (ball_last_locations_y.length > 19)
				ball_last_locations_y.pop()

			if (bluepaddle_last_locations.length > 9)
				bluepaddle_last_locations.pop()
			if (redpaddle_last_locations.length > 9)
				redpaddle_last_locations.pop()

			ball_last_locations_x.unshift(this.gameClass.ball.x);
			ball_last_locations_y.unshift(this.gameClass.ball.y);

			bluepaddle_last_locations.unshift(this.gameClass.bluepaddle.y);
			redpaddle_last_locations.unshift(this.gameClass.redpaddle.y);


			let idx: number = 0;
			this.context.globalAlpha = 0.5;
			while (idx < ball_last_locations_y.length)
			{
				if (idx % 2 == 0)
				{
					this.context.globalAlpha -= 0.05;
					this.context.drawImage(ballauraimg, ball_last_locations_x[idx] * 10 - 50, ball_last_locations_y[idx] * 10 - 50, 100, 100)
				}
				idx++;
			}

			this.context.globalAlpha = 0.5;
			idx = 0;
			while (idx < bluepaddle_last_locations.length)
			{
				this.context.globalAlpha -= 0.05;
				if (idx > 0 && bluepaddle_last_locations[idx] != bluepaddle_last_locations[idx - 1])
					this.context.drawImage(blue_paddleauraimg, 0, bluepaddle_last_locations[idx] * 10 - this.gameClass.bluepaddle.radius * 10, 66.67, this.gameClass.bluepaddle.radius * 20)
				if (idx > 0 && redpaddle_last_locations[idx] != redpaddle_last_locations[idx - 1])
					this.context.drawImage(red_paddleauraimg, 1933.33, redpaddle_last_locations[idx] * 10 - this.gameClass.redpaddle.radius * 10, 66.67, this.gameClass.redpaddle.radius * 20)
				idx++;
			}
			this.context.globalAlpha = 1;
		}
		else
		{
			ball_last_locations_x = [];
			ball_last_locations_y = [];
			bluepaddle_last_locations = [];
			redpaddle_last_locations = [];
		}


		//*		Auras (always displayed, unlike the trailing auras)
		this.context.drawImage(blue_paddleauraimg, 0, this.gameClass.bluepaddle.y * 10 - this.gameClass.bluepaddle.radius * 10, 66.67, this.gameClass.bluepaddle.radius * 20)
		this.context.drawImage(red_paddleauraimg, 1933.33, this.gameClass.redpaddle.y * 10 - this.gameClass.redpaddle.radius * 10, 66.67, this.gameClass.redpaddle.radius * 20)
		this.context.globalAlpha = Math.floor(this.gameClass.ball.opacity) * (1 - fallingball / 200);
		if (this.gameClass.status != gameStatus.goalanimation_blue && this.gameClass.status != gameStatus.goalanimation_red && this.gameClass.status != gameStatus.pregame)
			this.context.drawImage(ballauraimg, this.gameClass.ball.x * 10 - 50 - (fallingball * this.gameClass.ball.direction), this.gameClass.ball.y * 10 - 50, 100, 100)
		this.context.globalAlpha = 1;
		
		//*		Objects
		this.context.drawImage(blue_paddleimg, 0, this.gameClass.bluepaddle.y * 10  - this.gameClass.bluepaddle.radius * 10, 66.67, this.gameClass.bluepaddle.radius * 20)
		this.context.drawImage(red_paddleimg, 1933.33, this.gameClass.redpaddle.y * 10 - this.gameClass.redpaddle.radius * 10, 66.67, this.gameClass.redpaddle.radius * 20)
		this.context.globalAlpha = this.gameClass.ball.opacity;
		if (this.gameClass.status != gameStatus.goalanimation_blue && this.gameClass.status != gameStatus.goalanimation_red && this.gameClass.status != gameStatus.pregame)
			this.context.drawImage(ballimg, this.gameClass.ball.x * 10 - 50 - fallingball/2 - (fallingball * this.gameClass.ball.direction * 2), this.gameClass.ball.y * 10 - 50 - fallingball/2, 100 + fallingball, 100 + fallingball)
		this.context.globalAlpha = 1;

		//*		Power Up
		if (this.gameClass.powerup.visible)
		{
			if (this.gameClass.powerup.type == 1)
			this.context.drawImage(powerup1img, this.gameClass.powerup.x * 10 - 40, this.gameClass.powerup.y * 10 - 40, 80, 80)
			if (this.gameClass.powerup.type == 2)
			this.context.drawImage(powerup2img, this.gameClass.powerup.x * 10 - 40, this.gameClass.powerup.y * 10 - 40, 80, 80)
			if (this.gameClass.powerup.type == 3)
			this.context.drawImage(powerup3img, this.gameClass.powerup.x * 10 - 40, this.gameClass.powerup.y * 10 - 40, 80, 80)
		}


		//*		Spectator count if required
		if (this.gameClass.spectators > 0)
		{
			this.context.fillStyle = "rgb(0, 0, 0, 0.5)"
			this.context.beginPath();
			this.context.ellipse(1000, 985, 80, 50, 0, 0, 2 * Math.PI)
			this.context.closePath();
			this.context.fill();

			this.context.font = "50px monospace";
			this.context.fillStyle = "rgb(255, 255, 255, 1)";
			this.context.fillText(this.gameClass.spectators.toString() + " 👁", 1000, 1000)
		}



		//*	Pregame screen
		if (this.gameClass.status == gameStatus.pregame)
		{
			if (this.gameClass.waitEnd < 3500)
			{
				if (this.gameClass.waitEnd % 1000 <= 500)
				{
					this.context.font = (200 + this.gameClass.waitEnd % 1000 * 2).toString() + "px monospace";
					this.context.fillStyle = "rgb(255, " + (Math.floor(this.gameClass.waitEnd / 13)).toString() + ", 0, " + (1 - this.gameClass.waitEnd % 1000 / 500).toString() + ")";
					this.context.fillText(this.gameClass.waitEnd / 1000 < 1 ? "Start!" : Math.floor(this.gameClass.waitEnd / 1000).toString(), 1000, 500 + (200 + this.gameClass.waitEnd % 1000 * 2)/4)
				}
				else
				{
					this.context.font = "200px monospace";
					this.context.fillStyle = "rgb(255, " + (Math.floor(this.gameClass.waitEnd / 13)).toString() + ", 0, 1)";
					this.context.fillText(this.gameClass.waitEnd / 1000 + 1 < 1 ? "Start!" : Math.floor(this.gameClass.waitEnd / 1000 + 1).toString(), 1000, 550)
				}
			}
/*			else
			{
				this.context.font = "200px monospace";
				this.context.fillStyle = "rgb(255, 255, 0, 1)";
				this.context.fillText("Ready?", 1000, 550)
			}*/
			if (areyoublue && this.router.url != "/game/spectate")
			{
				this.context.fillStyle = "rgb(42, 42, 255, " + (Math.cos(this.gameClass.waitEnd / 100).toString() + ")");
				this.context.beginPath();
				this.context.moveTo(80, this.gameClass.bluepaddle.y * 10);
				this.context.lineTo(160, this.gameClass.bluepaddle.y * 10 + 80);
				this.context.lineTo(160, this.gameClass.bluepaddle.y * 10 - 80);
				this.context.closePath();
				this.context.fill();
			}
			else if (this.router.url != "/game/spectate")
			{
				this.context.fillStyle = "rgb(255, 21, 21, " + (Math.cos(this.gameClass.waitEnd / 100).toString() + ")");
				this.context.beginPath();
				this.context.moveTo(1900, this.gameClass.redpaddle.y * 10);
				this.context.lineTo(1820, this.gameClass.redpaddle.y * 10 + 80);
				this.context.lineTo(1820, this.gameClass.redpaddle.y * 10 - 80);
				this.context.closePath();
				this.context.fill();

			}
			countdown_fade = 1;
		}
		if (this.gameClass.status == gameStatus.ballfalling && countdown_fade > 0)
		{
			this.context.font = "200px monospace";

			this.context.fillStyle = "rgb(20, 255, 20, " + countdown_fade.toString() + ")";
			this.context.fillText("Start!", 1000, 550)

			if (areyoublue && this.router.url != "/game/spectate")
			{
				this.context.fillStyle = "rgb(42, 42, 255, " + countdown_fade + ")";
				this.context.beginPath();
				this.context.moveTo(80, this.gameClass.bluepaddle.y * 10);
				this.context.lineTo(160, this.gameClass.bluepaddle.y * 10 + 80);
				this.context.lineTo(160, this.gameClass.bluepaddle.y * 10 - 80);
				this.context.closePath();
				this.context.fill();
			}
			else if (this.router.url != "/game/spectate")
			{
				this.context.fillStyle = "rgb(255, 21, 21, " + countdown_fade + ")";
				this.context.beginPath();
				this.context.moveTo(1900, this.gameClass.redpaddle.y * 10);
				this.context.lineTo(1820, this.gameClass.redpaddle.y * 10 + 80);
				this.context.lineTo(1820, this.gameClass.redpaddle.y * 10 - 80);
				this.context.closePath();
				this.context.fill();
			}


			countdown_fade -= 0.02;
		}
		

		//*	End screen
		if (this.gameClass.status == gameStatus.postgame || this.gameClass.status == gameStatus.gameout)
		{
			if (this.gameClass.status == gameStatus.postgame)
			{
				this.context.fillStyle = "#000" + (9 - Math.floor((this.gameClass.waitEnd - 1) / 50)).toString();
				this.context.fillRect(0, 0, 2000, 1000)
				if (areyoublue && this.router.url != "/game/spectate")
					this.context.fillStyle = "rgb(42, 42, 255, " + ((9 - Math.floor((this.gameClass.waitEnd - 1) / 50)) / 10).toString() + ")";
				else if (this.router.url != "/game/spectate")
					this.context.fillStyle = "rgb(255, 42, 42, " + ((9 - Math.floor((this.gameClass.waitEnd - 1) / 50)) / 10).toString() + ")";
				else if (this.gameClass.bluescore > this.gameClass.redscore)
					this.context.fillStyle = "rgb(42, 42, 255, " + ((9 - Math.floor((this.gameClass.waitEnd - 1) / 50)) / 10).toString() + ")";
				else if (this.gameClass.bluescore < this.gameClass.redscore)
					this.context.fillStyle = "rgb(255, 42, 42, " + ((9 - Math.floor((this.gameClass.waitEnd - 1) / 50)) / 10).toString() + ")";
				else
					this.context.fillStyle = "rgb(128, 0, 255, " + ((9 - Math.floor((this.gameClass.waitEnd - 1) / 50)) / 10).toString() + ")";
			}
			if (this.gameClass.status == gameStatus.gameout)
			{
				this.context.fillStyle = "#0009";
				this.context.fillRect(0, 0, 2000, 1000)
				if (areyoublue && this.router.url != "/game/spectate")
					this.context.fillStyle = "rgb(42, 42, 255, 1)";
				else if (this.router.url != "/game/spectate")
					this.context.fillStyle = "rgb(255, 42, 42, 1)";
				else if (this.gameClass.bluescore > this.gameClass.redscore)
					this.context.fillStyle = "rgb(42, 42, 255, 1)";
				else if (this.gameClass.bluescore < this.gameClass.redscore)
					this.context.fillStyle = "rgb(255, 42, 42, 1)";
				else
					this.context.fillStyle = "rgb(128, 0, 255, 1)";
			}
			this.context.font = "200px monospace";
			if (gameresult)
			{

				if (gameresult.yourscore > gameresult.theirscore)
					this.context.fillText("You won!", 1000, 250);
				else if (gameresult.yourscore < gameresult.theirscore)
					this.context.fillText("You lost", 1000, 250);
				else
					this.context.fillText("Draw", 1000, 250);

					
				if (this.gameClass.status == gameStatus.gameout)
				{
					this.context.font = "42px monospace";
					this.context.fillText("Your points", 970, 520)
					
					this.context.font = "100px monospace";
					this.context.fillStyle = "rgb(255, 255, 255, 1)";
					this.context.textAlign = "right"
					this.context.fillText((gameresult.prev_points + gameresult.earned_points).toString(), 970, 620)
	
					this.context.fillStyle = "rgb(0, 255, 0, 1)";
					this.context.textAlign = "left"
					this.context.fillText("▲" + (gameresult.earned_points).toString(), 1020, 620)
				}
			}
			else
			{
				if (this.gameClass.bluescore > this.gameClass.redscore)
					this.context.fillText("Blue won!", 1000, 250);
				else if (this.gameClass.bluescore < this.gameClass.redscore)
					this.context.fillText("Red won!", 1000, 250);
				else
					this.context.fillText("Draw", 1000, 250);
				
			}
		}

		//*		Introduction screen overlay. May be displayed in the middle of a game to spectators.
		console.log(introtime)
		if (introtime > 0)
		{
			if (introtime > 2750)
			{
				const bluegradient = this.context.createLinearGradient((2750 - introtime) * 8, 250, (2750 - introtime) * 8 + 1100, 750);
				bluegradient.addColorStop(0, "#33fc")
				bluegradient.addColorStop(1, "#33f0")

				const redgradient = this.context.createLinearGradient(900 + (introtime - 2750) * 8, 250, 2000 + (introtime - 2750) * 8, 750);
				redgradient.addColorStop(0, "#f330")
				redgradient.addColorStop(1, "#f33c")

				this.context.fillStyle = bluegradient;
				this.context.fillRect(0, 0, 2000, 1000);
				this.context.fillStyle = redgradient;
				this.context.fillRect(0, 0, 2000, 1000);
			}
			else if (introtime > 2500)
			{
				const bluegradient = this.context.createLinearGradient(0, 250, 1100, 750);
				bluegradient.addColorStop(0, "#33fc")
				bluegradient.addColorStop(1, "#33f0")
	
				const redgradient = this.context.createLinearGradient(900, 250, 2000, 750);
				redgradient.addColorStop(0, "#f330")
				redgradient.addColorStop(1, "#f33c")
	
				this.context.fillStyle = bluegradient;
				this.context.fillRect(0, 0, 2000, 1000);
				this.context.fillStyle = redgradient;
				this.context.fillRect(0, 0, 2000, 1000);

				this.context.fillStyle = "rgb(255, 255, 255, 1)";
				this.context.font = "60px monospace";
				this.context.textAlign = "center"
				this.context.fillText(this.gameClass.bluename, 500 - (introtime - 2500) * 8, 500, 900);
				this.context.fillText(this.gameClass.redname, 1500 + (introtime - 2500) * 8, 500, 900);
			}
			else if (introtime < 250)
			{
				const bluegradient = this.context.createLinearGradient(introtime * 8 - 2000, 250, introtime * 8 - 900, 750);
				bluegradient.addColorStop(0, "#33fc")
				bluegradient.addColorStop(1, "#33f0")

				const redgradient = this.context.createLinearGradient(900 + (250 - introtime) * 8, 250, 2000 + (250 - introtime) * 8, 750);
				redgradient.addColorStop(0, "#f330")
				redgradient.addColorStop(1, "#f33c")

				this.context.fillStyle = bluegradient;
				this.context.fillRect(0, 0, 2000, 1000);
				this.context.fillStyle = redgradient;
				this.context.fillRect(0, 0, 2000, 1000);

				this.context.fillStyle = "rgb(255, 255, 255, 1)";
				this.context.font = "60px monospace";
				this.context.textAlign = "center"
				this.context.fillText(this.gameClass.bluename, 500 - (250 - introtime) * 8, 500, 900);
				this.context.fillText(this.gameClass.redname, 1500 + (250 - introtime) * 8, 500, 900);
			}
			else
			{
				const bluegradient = this.context.createLinearGradient(0, 250, 1100, 750);
				bluegradient.addColorStop(0, "#33fc")
				bluegradient.addColorStop(1, "#33f0")
	
				const redgradient = this.context.createLinearGradient(900, 250, 2000, 750);
				redgradient.addColorStop(0, "#f330")
				redgradient.addColorStop(1, "#f33c")
	
				this.context.fillStyle = bluegradient;
				this.context.fillRect(0, 0, 2000, 1000);
				this.context.fillStyle = redgradient;
				this.context.fillRect(0, 0, 2000, 1000);

				this.context.fillStyle = "rgb(255, 255, 255, 1)";
				this.context.font = "60px monospace";
				this.context.textAlign = "center"
				this.context.fillText(this.gameClass.bluename, 500, 500, 900);
				this.context.fillText(this.gameClass.redname, 1500, 500, 900);
			}
			introtime -= 10;
		}




		//*		Goal screen
		if (this.gameClass.status == gameStatus.goalanimation_blue || this.gameClass.status == gameStatus.goalanimation_red)
		{

			if (this.gameClass.status == gameStatus.goalanimation_blue)
			{
				if (this.gameClass.waitEnd > 1500)
				{
					const bluegradient = this.context.createLinearGradient((1500 - this.gameClass.waitEnd) * 4, 250, (1500 - this.gameClass.waitEnd) * 4 + 1100, 750);
					bluegradient.addColorStop(0, "#33fc")
					bluegradient.addColorStop(1, "#33f0")
					this.context.fillStyle = bluegradient;
					this.context.fillRect(0, 0, 2000, 1000);

					this.context.font = "bold " + (200 + (this.gameClass.waitEnd - 1500) * 2).toString() + "px monospace";
					this.context.fillStyle = "rgb(0, 0, 255, " + (1 - (this.gameClass.waitEnd - 1500) / 500).toString() + ")";
					this.context.strokeStyle = "rgb(255, 255, 255, " + (1 - (this.gameClass.waitEnd - 1500) / 500).toString() + ")";
					this.context.lineWidth = 10;
					this.context.strokeText("GOAL!", 1000, 500 + (200 + (this.gameClass.waitEnd - 1500) * 2)/4)
					this.context.fillText("GOAL!", 1000, 500 + (200 + (this.gameClass.waitEnd - 1500) * 2)/4)
				}
				else
				{
					const bluegradient = this.context.createLinearGradient(0, 250, 1600, 750);
					bluegradient.addColorStop(0, "#33fc")
					bluegradient.addColorStop(1, "#33f0")
					this.context.fillStyle = bluegradient;
					this.context.fillRect(0, 0, 2000, 1000);

					this.context.font = "bold 200px monospace";
					this.context.fillStyle = "rgb(0, 0, 255, 1)";
					this.context.strokeStyle = "rgb(255, 255, 255, 1)";
					this.context.lineWidth = 10;
					this.context.strokeText("GOAL!", 1000, 550)
					this.context.fillText("GOAL!", 1000, 550)
				}
			}
			else
			{
				if (this.gameClass.waitEnd > 1500)
				{
					const redgradient = this.context.createLinearGradient(900 + (this.gameClass.waitEnd - 1500) * 4, 250, 2000 + (this.gameClass.waitEnd - 1500) * 4, 750);
					redgradient.addColorStop(0, "#f330")
					redgradient.addColorStop(1, "#f33c")
					this.context.fillStyle = redgradient;
					this.context.fillRect(0, 0, 2000, 1000);

					this.context.font = "bold " + (200 + (this.gameClass.waitEnd - 1500) * 2).toString() + "px monospace";
					this.context.fillStyle = "rgb(255, 0, 0, " + (1 - (this.gameClass.waitEnd - 1500) / 500).toString() + ")";
					this.context.strokeStyle = "rgb(255, 255, 255, " + (1 - (this.gameClass.waitEnd - 1500) / 500).toString() + ")";
					this.context.lineWidth = 10;
					this.context.strokeText("GOAL!", 1000, 500 + (200 + (this.gameClass.waitEnd - 1500) * 2)/4)
					this.context.fillText("GOAL!", 1000, 500 + (200 + (this.gameClass.waitEnd - 1500) * 2)/4)
					
				}
				else
				{
					const redgradient = this.context.createLinearGradient(900, 250, 2000, 750);
					redgradient.addColorStop(0, "#f330")
					redgradient.addColorStop(1, "#f33c")
					this.context.fillStyle = redgradient;
					this.context.fillRect(0, 0, 2000, 1000);

					this.context.font = "bold 200px monospace";
					this.context.fillStyle = "rgb(255, 0, 0, 1)";
					this.context.strokeStyle = "rgb(255, 255, 255, 1)";
					this.context.lineWidth = 10;
					this.context.strokeText("GOAL!", 1000, 550)
					this.context.fillText("GOAL!", 1000, 550)
				}

			}

		}


	}

	
	startPeriodicExecution(): void {
		const interval$ = interval(20);

	}

}

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
		gcomp.sendKeypress(paddledirection);
	}
	
	last_paddledirection = paddledirection;
}

setInterval(updater, 20);
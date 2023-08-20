import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoGuard } from './guards';

@Controller('auth')
export class AuthController {

	@Get('login')
	@UseGuards(FortyTwoGuard)
	login() {
		return;
	}

	@Get('redirect')
	// @UseGuards(FortyTwoGuard)
	redirect(@Res() res: Response) {
		res.send(200);
	}

	@Get('status')
	status(){}

	@Get('logout')
	logout(){}


}

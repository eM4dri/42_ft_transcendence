import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { Request } from "express";


@Injectable()
export class FortyTwoGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const activate: boolean = (await super.canActivate(context)) as boolean;
		console.log(activate);
		const request = context.switchToHttp().getRequest();
		console.log(request);
		await super.logIn(request);
		return activate;
	}
}
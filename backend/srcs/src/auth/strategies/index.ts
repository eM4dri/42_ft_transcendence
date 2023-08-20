import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallBack } from "passport-42";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private readonly config: ConfigService){
		super({
			clientID: config.get('FORTYTWO_CLIENT_ID'),
			clientSecret: config.get('FORTYTWO_CLIENT_SECRET'),
			callbackURL: '/auth/redirect',
			passReqToCallback: true,
		});
	}

	async validate(
		request: { session: {accessToken: string} },
		accessToken : string,
		refreshToken : string,
		profile: Profile, 
		cb: VerifyCallBack,
	):	Promise<any> {
		request.session.accessToken = accessToken;
		console.log('accessToken', accessToken, 'refreshToken', refreshToken);

		return cb(null, profile);
	}
}


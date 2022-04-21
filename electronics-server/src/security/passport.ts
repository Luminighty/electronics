import _passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifyCallback } from 'passport-jwt';
import * as dotenv from "dotenv";
dotenv.config();

export const passport = new _passport.Passport();

const opts: StrategyOptions = {
	jwtFromRequest: (req) => {
		let token = null;
		if (req && req.cookies)
			token = req.cookies["token"];
		if (req && !token)
			token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
		return token;
	},
	secretOrKey: process.env.PAYLOAD_SECRET,
};

passport.use(
	new JwtStrategy(opts, (async (jwt_payload, done) => {
		done(null, {
			id: jwt_payload.sub,
			role: jwt_payload.role,
			username: jwt_payload.username,
		});
	}) as VerifyCallback)
);
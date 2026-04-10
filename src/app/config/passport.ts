/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

interface IAuthInfo {
    message: string;
    statusCode: number;
}

const authInfo = (message: string, statusCode: number): IAuthInfo => ({
    message,
    statusCode
});


// ======================= LOCAL STRATEGY =======================
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: string, password: string, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, authInfo("User does not exist", 404));
                }

                if (!user.isVerified) {
                    return done(null, false, authInfo("User is not verified", 400));
                }

                if (
                    user.isActive === IsActive.BLOCKED ||
                    user.isActive === IsActive.INACTIVE
                ) {
                    return done(
                        null,
                        false,
                        authInfo(`User is ${user.isActive}`, 403)
                    );
                }

                if (user.isDeleted) {
                    return done(null, false, authInfo("User is deleted", 410));
                }

                const isGoogleAuth = user.auths.some(
                    a => a.provider === "google"
                );

                if (isGoogleAuth && !user.password) {
                    return done(
                        null,
                        false,
                        authInfo(
                            "Login with Google first and set a password",
                            400
                        )
                    );
                }

                const isPasswordMatched = await bcryptjs.compare(
                    password,
                    user.password as string
                );

                if (!isPasswordMatched) {
                    return done(
                        null,
                        false,
                        authInfo("Password does not match", 401)
                    );
                }

                return done(null, user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

// ======================= GOOGLE STRATEGY =======================
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(null, false, authInfo("No email found", 400));
                }

                let user = await User.findOne({ email });

                if (user && !user.isVerified) {
                    return done(
                        null,
                        false,
                        authInfo("User is not verified", 400)
                    );
                }

                if (
                    user &&
                    (user.isActive === IsActive.BLOCKED ||
                        user.isActive === IsActive.INACTIVE)
                ) {
                    return done(
                        null,
                        false,
                        authInfo(`User is ${user.isActive}`, 403)
                    );
                }

                if (user && user.isDeleted) {
                    return done(
                        null,
                        false,
                        authInfo("User is deleted", 410)
                    );
                }

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    });
                }

                return done(null, user);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    )
);

// ======================= SERIALIZE =======================
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});
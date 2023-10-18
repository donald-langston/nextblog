import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import User from "@/models/users";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        SlackProvider({
            clientId: process.env.SLACK_CLIENT_ID,
            clientSecret: process.env.SLACK_CLIENT_SECRET,
            idToken: true,
            //wellKnown: "https://localhost:3000/api/auth/callback/slack"
        }),
        CredentialsProvider({
            async authorize(credentials, req) {
                dbConnect();
                const { email, password } = credentials;
                const user = await User.findOne({ email });
                if(!user) {
                    throw new Error("Invalid email or password");
                }
                if(!user.password) {
                    throw new Error("Please login via the method you used to signup");
                }
                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if(!isPasswordMatched) {
                    throw new Error("Invalid email or password");
                }
                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user }) {
            dbConnect();

            const { email } = user;

            let dbUser = await User.findOne({ email });

            if(!dbUser) {
                dbUser = await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });  
            }

            return true;
        },
        jwt: async({token, user}) => {
            console.log("jwt callback", token, user);
            const userByEmail = await User.findOne({email: token.email});
            userByEmail.password = undefined;
            token.user = userByEmail;
            return token;
        },
        session: async({session, token}) => {
            console.log("session callback", session, token);
            session.user = token.user;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
}


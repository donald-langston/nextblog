import GithubButton from "react-github-login-button";
import { signIn } from "next-auth/react";

export default function GithubSignInButton({callbackUrl}) {
    return (
        <GithubButton
            type="light"
            onClick={() => signIn("github", {callbackUrl})} 
            className="mb-2"
            style={{width: "75%"}}
        />
    )
}
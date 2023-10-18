import { signIn } from "next-auth/react"
import GoogleButton from "react-google-button";

const styles = {
    span: {
        paddingRight: "50%"
    }
}

export default function GoogleSignInButton({callbackUrl}) {
    return (
          <GoogleButton 
            type="light"
            onClick={() => signIn("google", {callbackUrl})} 
            className="mb-2"
            style={{width: "75%", span: {paddingRight: "50%"}}}
            />                
    )
}
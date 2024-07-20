import { use, useContext } from "react"
import Login from "./Login"
import { UserContext } from "./NoteList"
import Logout from "./Logout";
import Signup from "./Signup";


export default function Homepage({onLogin, onLogout, onSignup} : {onLogin: any, onLogout: any, onSignup: any}) {
  const user = useContext(UserContext);


  return (
    <div className="homepage">
      {!user && <Signup onSignup={onSignup}/>}
      {!user &&  <Login onLogin={onLogin}/>}
      {user && <Logout onLogout={onLogout}/>}
    </div>
  )
}
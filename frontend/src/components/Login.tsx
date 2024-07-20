import { useState, useContext} from 'react';
import axios from 'axios';


export default function Login ({onLogin} : {onLogin : any}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async (event : any) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/login`,
                 { username : username, password : password },);
            const user = response.data.username;
            const token = response.data.Authorization;
            const email = response.data.email;
            onLogin(user, token, email);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="loginUserContainer">
          <h1>Login</h1>
          <form name="login_form" onSubmit={handleLogin}>
            <label>Username</label>
            <input type="text" name="login_form_username" onChange={(e) => setUsername(e.target.value)}
            /><br />
            <label>Password</label>
            <input type="password" name="login_form_password" onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button type="submit" name="login_form_login" >Login</button>
          </form>
      </div>
    )
}
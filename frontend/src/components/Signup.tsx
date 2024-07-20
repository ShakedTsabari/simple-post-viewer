
import { useState, useContext} from 'react';
import axios from 'axios';


export default function Signup ({onSignup} : {onSignup : any}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (event : any) => {    
        event.preventDefault();    
        try {
            const response = await axios.post(`http://localhost:3001/users`,
                 { name : name, email : email, username : username, password : password });
            setName('');
            setEmail('');
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error(error);
        }
    }


return (    
    <div className="createUserContainer">
      <h1>Create User</h1>
      <form name="create_user_form" onSubmit={handleSignup}>
        <label>Name</label>
        <input type="text" name="create_user_form_name" onChange={(e) => setName(e.target.value)} value={name}
        /><br />
        <label>Email</label>
        <input type="text" name="create_user_form_email" onChange={(e) => setEmail(e.target.value)} value={email}
        /><br />
        <label>Username</label>
        <input type="text" name="create_user_form_username" onChange={(e) => setUsername(e.target.value)} value={username}
        /><br />
        <label>Password</label>
        <input type="password" name="create_user_form_password" onChange={(e) => setPassword(e.target.value)} value={password}
         /><br />
        <button type="submit" name="create_user_form_create_user">Create User</button>
      </form>
    </div>
    )
}
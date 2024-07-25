import axios from 'axios';
import { UserContext } from './NoteList';
import { useContext } from 'react';

export default function Logout ({onLogout} : {onLogout : any}) {
    const user = useContext(UserContext);

    const handleLogout = async (event : any) => {
        event.preventDefault();
        if (user) {
            await axios.post(`http://localhost:3001/logout`, {},
                { headers: { Authorization: `Bearer ${user.token}` } }
                ).then(() => {
                    onLogout();
                }).catch((error) => {
                    console.error('Error logging out:', error);
                });
            }
    };

    return (
        <div className="logoutUserContainer">
            <button name="logout" onClick={handleLogout}>Logout</button>  
        </div>
    )
}
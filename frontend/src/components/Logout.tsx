import axios from 'axios';
import { TokenContext } from './NoteList';
import { useContext } from 'react';

export default function Logout ({onLogout} : {onLogout : any}) {
    const token = useContext(TokenContext);

    const handleLogout = async (event : any) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/logout`, {},
            { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.message === 'logged out')
                onLogout();
        } catch (error) {
            console.error(error);
        }
    };

        
    return (
        <div className="logoutUserContainer">
            <button name="logout" onClick={handleLogout}>Logout</button>  
        </div>
    )
}
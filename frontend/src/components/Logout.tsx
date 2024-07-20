export default function Logout ({onLogout} : {onLogout : any}) {

    const handleLogout = async (event : any) => {
        event.preventDefault();
        try {
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
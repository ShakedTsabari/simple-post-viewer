import axios from 'axios';
import { useState, useContext } from 'react';
import { UserContext , TokenContext , EmailContext } from './NoteList';



export default function AddNote ({onAddNote} : {onAddNote: any}) {
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const user = useContext(UserContext);
    const token = useContext(TokenContext);
    const email = useContext(EmailContext);

    const handleCancel = () => {
        setContent('');
        setIsAdding(false);
    }

    const handleAddNote = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/notes`, { content : content, user : user, email : email},
            { headers: { Authorization: `Bearer ${token}` } }
            );
            const note = response.data.note;
            onAddNote(note);
            setContent('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="addNote">
            {isAdding? 
            (
            <div>
                <input 
                    name="text_input_new_note"
                    type="text"
                    placeholder="Add note"
                    value={content}
                    onChange={(e : any) => setContent(e.target.value)}
                    
                />
                <div className='save_cancel_buttons'>
                    <button className="text_input_save_new_note" name="text_input_save_new_note" onClick={handleAddNote}>
                    save
                    </button>
                    <button className="text_input_cancel_new_note" name="text_input_cancel_new_note" onClick={handleCancel}>
                    cancel
                    </button>
                </div>
            </div>
            ):
            (
                <button className="add_new_note" name="add_new_note" onClick={() => setIsAdding(true)}>Add New Note</button>
            )
            }
        </div>
    )
}
import { useState} from 'react';
import axios from 'axios';


export default function AddNote ({onAddNote, user} : {onAddNote: any, user: any}) {
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleCancel = () => {
        setContent('');
        setIsAdding(false);
    }

    const handleAddNote = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/notes`, { content : content });
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
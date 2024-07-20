import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { ThemeContext, UserContext } from "./NoteList";


export default function Note ({ id, title, author, content, onNoteDelete, onNoteEdit, user } : any) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(content);
    const theme = useContext(ThemeContext);
    const className = 'note-' + theme;
    

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`http://localhost:3001/notes/${id}`);
            onNoteDelete(id);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleEditClick = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/notes/${id}`, { content: text, id: id });
            const updatedNote = response.data.note;
            setIsEditing(false);
            onNoteEdit(updatedNote);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className={className}>
            <div 
                className="note"
                id={id}>
                <h2>{title}</h2>
                <small>By {author}</small>
                <br />
                <p>{text}</p>
                {user && user === author &&
                (isEditing ? (<>
                                <input 
                                    type="text"
                                    name={'text_input-'+id}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <div className="edit_buttons">
                                    <button name={'text_input_save-'+id} onClick={handleEditClick}>Save</button>
                                    <button name={'text_input_cancel-'+id} onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                            </>) : 
                            (<div>

                                <div className="edit_buttons">
                                    <button name={'edit-'+id} onClick={() => setIsEditing(true)}>Edit</button>
                                    <button name={'delete-'+id} onClick={handleDeleteClick}>Delete</button>
                                </div>
                            </div>))}
            </div>
        </div>
    );
};
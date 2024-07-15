"use client";
import axios from 'axios';
import {createContext, useEffect, useState } from 'react';
import AddNote from './AddNote';
import Note from './Note';
import Pagination from './Pagination';

export const ThemeContext = createContext<string | null>(null);

export default function NoteList({posts, user}: {posts: any, user: any}) {
    
    const [activePage, setActivePage] = useState(1);
    const [notes, setNotes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [theme, setTheme] = useState('light');
    
    const className =  'note-list-' + theme;

    const NOTES_PER_PAGE = 10;

    useEffect(() => {
        console.log('effect')
        const start = (activePage - 1) * NOTES_PER_PAGE;
        const end = start + NOTES_PER_PAGE;
        axios.get(`http://localhost:3001/notes?page=${activePage}`)
            .then((response) => {
                const notes_number = response.data.totalNotes;
                const pages_number = Math.ceil(notes_number / NOTES_PER_PAGE);
                setNotes(response.data.notes);
                setTotalPages(pages_number);
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }, [activePage]);

    function getPaginationRange(activePage: number, totalPages: number) : number[] {
        const maxNumOfPages = 5;
        let start = Math.max(1, activePage - 2);
        let end = Math.min(totalPages, activePage + 2);

        if (activePage < 3) {
            end = Math.min(maxNumOfPages, totalPages);
        } else if (activePage > totalPages - 2) {
            start = Math.max(totalPages - maxNumOfPages + 1, 1);
        }

        const range = Array.from({ length: (end - start + 1) }, (v, i) => start + i);
        return range;
    }

    const paginationRange = getPaginationRange(activePage, totalPages);

    function pageChange (page: number) {
        if (page < 1 || page > totalPages) {
            return;
        }
        setActivePage(page);
    };

    function handleNoteDelete(noteId: any) {
        setNotes(notes.filter((note : any) => note.id !== noteId));
    };

    function handleAddNote(note : any) {
        setNotes([...notes, note]);
    };

    function handleEditNote(note : any) {
        setNotes(notes.map((n : any) => n.id === note.id ? note : n));
        console.log('Note id: ', note.id);
    }

    const handleChangeTheme = async () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    }

    return (
        <ThemeContext.Provider value={theme}>
        <div className={className}>
            <div className="toggle">
                <button name="change_theme" onClick={handleChangeTheme}>
                toggle {theme} mode
                </button>
            </div>
            <div>
                <ul>
                    {notes.map((note: any) => (
                        <Note 
                            key={note.id}
                            id={note.id}
                            title={note.title}
                            author={note.author.name}
                            content={note.content}
                            onNoteDelete={handleNoteDelete}
                            onNoteEdit={handleEditNote}
                            user={user}
                        />
                    ))}
                </ul>
            </div>
            <div>
                <Pagination 
                    activePage={activePage} 
                    onPageChange={pageChange} 
                    totalPages={totalPages} 
                    paginationRange={paginationRange} />
            </div>
            <div>
                {user && <AddNote onAddNote={handleAddNote} user={user}/>}
            </div>
        </div>
        </ThemeContext.Provider>
    );
}

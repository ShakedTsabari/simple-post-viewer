"use client";
import axios from 'axios';
import {createContext, use, useEffect, useRef, useState } from 'react';
import AddNote from './AddNote';
import Note from './Note';
import Pagination from './Pagination';
import { set } from 'ramda';
import { get } from 'http';

export const ThemeContext = createContext<string | null>(null);

export default function NoteList({posts, user}: {posts: any, user: any}) {
    
    const [activePage, setActivePage] = useState(1);
    const [notes, setNotes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [theme, setTheme] = useState('light');
    const [cache, setCache] = useState<any>({});
    const prevPageRef = useRef(1);
    
    const className =  'note-list-' + theme;

    const NOTES_PER_PAGE = 10;

    //build fetch and cache notes
    useEffect(() => {
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

    }, []);

    //fetch notes when active page changes and update cache
    useEffect(() => {
        if (totalPages === 0) 
            return;
        if (cache[activePage]) {
            setNotes(cache[activePage].notes);
            fetchNotes(activePage);
        }
        else {
            axios.get(`http://localhost:3001/notes?page=${activePage}`).then((response) => {
                const notes_number = response.data.totalNotes;
                const pages_number = Math.ceil(notes_number / NOTES_PER_PAGE);
                setNotes(response.data.notes);
                setTotalPages(pages_number);
                fetchNotes(activePage);
            }).catch((error) => {
                console.error('Error fetching notes:', error);
            });
        }
    }, [activePage, totalPages]);

    //async function to fetch notes
    const fetchNotes = async (page: number) => { 
        try {
            const range = getPaginationRange(activePage, totalPages);
            let newCache = {...cache};
            for (let i = 0; i < range.length; i++) {
                const page = range[i];
                if (!cache[page]) {
                    await axios.get(`http://localhost:3001/notes?page=${page}`).then((response) => {
                        newCache = {...newCache, [page]: {notes: response.data.notes}};
                        }).catch((error) => {
                            console.error('Error fetching notes:', error);
                        });
                }
            }
            setCache(newCache);
            //console.log('cache:', newCache);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }


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

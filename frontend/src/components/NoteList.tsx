"use client";
import axios from 'axios';
import {createContext, use, useEffect, useRef, useState } from 'react';
import AddNote from './AddNote';
import Note from './Note';
import Pagination from './Pagination';
import Homepage from './homepage';

export const ThemeContext = createContext<string | null>(null);
export const UserContext = createContext<any>(null);
export const TokenContext = createContext<any>(null);
export const EmailContext = createContext<any>(null);

export default function NoteList({posts, pages, firstCache}: {posts: any,pages: any, firstCache: any}) {
    
    const [activePage, setActivePage] = useState(1);
    const [notes, setNotes] = useState<any[]>(posts);
    const [totalPages, setTotalPages] = useState(pages);
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState<any>(null);
    //const [token, setToken] = useState<any>(null);
    const cache = useRef<any>(firstCache);
    
    const className =  'note-list-' + theme;

    const NOTES_PER_PAGE = 10;
    
    //fetch notes when active page changes and update cache
    useEffect(() => {
        //async function to fetch notes
        let active = true;
        const fetchNotes = async (page: number) => { 
            try {
                const range = getPaginationRange(activePage, totalPages);
                let newCache = {...cache.current};
                for (let i = 0; i < range.length; i++) {
                    const page = range[i];
                    if (!cache.current[page]) {
                        await axios.get(`http://localhost:3001/notes?page=${page}` 
                        ).then((response) => {
                            newCache = {...newCache, [page]: {notes: response.data.notes}};
                            }).catch((error) => {
                                console.error('Error fetching notes:', error);
                            });
                    }
                }
                cache.current = newCache;
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        }


        if (totalPages === 0) {
            return () => { active = false; };
        }
        if (cache.current[activePage]) {
            setNotes(cache.current[activePage].notes);
            fetchNotes(activePage);
        }
        else {
            axios.get(`http://localhost:3001/notes?page=${activePage}`
            ).then((response) => {
                const notes_number = response.data.totalNotes;
                const pages_number = Math.ceil(notes_number / NOTES_PER_PAGE);
                setNotes(response.data.notes);
                setTotalPages(pages_number);
                fetchNotes(activePage);
            }).catch((error) => {
                console.error('Error fetching notes:', error);
            });
        }
        return () => { active = false; };
    }, [activePage, totalPages, user]);



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
    }

    const handleChangeTheme = async () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    }

    const handleLogin = async (newName: any, newToken: any, newEmail: any) => {
        setUser({name: newName, email: newEmail, token: newToken});
    }

    const handleLogout = async () => {
        setUser(null);
    }

    const handleSignup = async () => {
    }

    return (
            <UserContext.Provider value={user}>
                <ThemeContext.Provider value={theme}>
                <div className={className}>
                    <Homepage onLogin={handleLogin} onLogout={handleLogout} onSignup={handleSignup}/>
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
                        {user && <AddNote onAddNote={handleAddNote}/>}
                    </div>
                </div>
                </ThemeContext.Provider>
            </UserContext.Provider>
    );
}

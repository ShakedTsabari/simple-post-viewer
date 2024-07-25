import React, { StrictMode } from 'react';
import "../styles/style.css";
import NoteList from '../components/NoteList';
import Link from 'next/link';
import axios from 'axios';



export default function App({notes, pages, firstCache}:{notes: any, pages: any, firstCache: any}) {
  return (
      <div className="App">
        <NoteList posts={notes} pages={pages} firstCache={firstCache}/>
      </div>
  );
}

export async function getStaticProps() {
  const NOTES_PER_PAGE = 10;
  const res = await axios.get('http://localhost:3001/notes?page=1');
  const notes = await res.data.notes;
  const totalNotes = await res.data.totalNotes;
  const pages = Math.ceil(totalNotes / NOTES_PER_PAGE);
  const firstCache = {1: {notes: notes}};
  return {
    props: {
      notes,
      pages,
      firstCache
    },
  };  
}


import React from 'react';
import "../styles/style.css";
import NoteList from '../components/NoteList';
import Link from 'next/link';



export default function App({notes}:{notes: any}) {
  return (
    <div className="App">
      <NoteList posts={notes}/>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3001/notes');
  let notes = await res.json();
  return {
    props: {
      notes,
    },
  };  
}


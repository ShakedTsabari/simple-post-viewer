import React from 'react';
import "../styles/style.css";
import NoteList from '../components/NoteList';
import Link from 'next/link';
import Homepage from '../components/homepage';


export default function App({notes, user}:{notes: any, user: any}) {
  return (
    <div className="App">
      <Homepage />
      <NoteList posts={notes} user={user}/>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3001/notes');
  const notes = await res.json();
  const user = {name: 'Author 1'};
  return {
    props: {
      notes,
      user
    },
  };  
}


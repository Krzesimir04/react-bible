import './index.css';
import React from 'react';
import {useState,useEffect} from 'react';
import { setErrorMessage } from './utils';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  // check if user used dark mode ealier from local storage
  if(localStorage.getItem('darkMode') === null){
    localStorage.setItem('darkMode', String(window.matchMedia('(prefers-color-scheme:dark)').matches === true ? "true" : "false"))
  }
  let darkMode = localStorage.getItem('darkMode') === "true" ? true : false

  let [text,setText]=useState("In the beginning was the Word...");
  let [list_of_books,setBooks]=useState(null);
  let [list_of_chapters,setChapters]=useState(null);
  let [selectedChapter,setSelectedChapter]=useState(null);
  let [isDark, setIsDark] = useState(darkMode)

  // download all books using API.Bible
  useEffect(()=>{
    fetchBooks();
  },[])

  // change mode of application
  useEffect(() =>{
    document.body.classList.toggle('dark', isDark)
  },[isDark])
  
  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', String(!isDark))
    setIsDark((prev) => !prev);
  };

//download all books and set list of books
  async function fetchBooks(){
    try{
      const response = await fetch('https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/books?include-chapters=true&include-chapters-and-sections=true', {
      headers:{
        'api-key': API_KEY
      }
    })
    const booksObj = await response.json()
    setBooks(() => booksObj.data)
    }catch(err){
      console.warn(err);
      setErrorMessage(setText)
    }
  }

//download and set list of chapters for chossen book
  async function fetchChapters(e){
    try{
      if(!e.target.value) return
      const response = await fetch(`https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/books/${e.target.value}/chapters`,{
        headers:{
          'api-key':API_KEY
        }
      })
      const obj = await response.json()
      setChapters(() => obj.data);
    }catch(err){
      console.warn(err);
      setErrorMessage(setText)
    }
  }

//download text of selected chapter
  async function download(e){
    e.preventDefault();
    try{
      if(selectedChapter === null) return

      const response = await fetch(`https://api.scripture.api.bible/v1/bibles/fbb8b0e1943b417c-01/chapters/${selectedChapter}?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`, {
        headers:{
          'api-key':API_KEY
        }
      })
      const obj = await response.json()
      setText(() => obj.data.content);
    }catch(err){
      console.warn(err);
      setErrorMessage(setText)
    }
  }
//options for select tags from feched chapters nad books
  let options_of_books=list_of_books?.map((val)=>(
    <option className="light" key={val.id} value={val.id}>{val.name}</option>
  ));
  let options_list_of_chapters=list_of_chapters?.map((val)=>(
    <option className="light" key={val.id} value={val.id}>{val.number}</option>
  ));

  return (
    <>
        <form>
          <div className='select-section'>
            <label id='book' htmlFor='book'>Choose a book</label>
            <select onChange={fetchChapters} name='book'>
              <option value={null}>Books</option>
              {options_of_books}
            </select>
          </div>
          <div className='select-section'>
            <label htmlFor='chapter'>Choose a chapter</label>
            <select id='chapter' name='chapter' onChange={(e)=>{
              setSelectedChapter(()=> e.target.value)
            }}>
              {options_list_of_chapters}
            </select>
          </div>
          <button type="submit" onClick={download}>read</button>

          <div className='dark-mode-container'>
            <p>Dark mode</p>
            <label className="switch">
              <input type="checkbox" checked={isDark} onChange={()=> toggleDarkMode()}/>
              <span className="slider round"></span>
            </label>
          </div>

        </form>
        <div id='line'/>
        <section>
          <span className='bible-text' dangerouslySetInnerHTML={{__html: text}}></span>
        </section>
    </>
  )
}

export default App;

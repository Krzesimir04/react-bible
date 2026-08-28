import './index.css';
import React from 'react';
import {useState,useEffect} from 'react';
import { setErrorMessage, LIST_OF_LANGUAGES } from './utils';
import Dove from './assets/dove.svg?react'

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = "https://api.scripture.api.bible/v1"
function App() {
  // check if user used dark mode ealier from local storage
  if(localStorage.getItem('darkMode') === null){
    localStorage.setItem('darkMode', String(window.matchMedia('(prefers-color-scheme:dark)').matches === true ? "true" : "false"))
  }
  // Functional states
  const [loading, setLoading] = useState(false); // is loader showed
  const [language,setLanguage]=useState('eng'); // language of Bible
  const [isDark, setIsDark] = useState(localStorage.getItem('darkMode') === "true" ? true : false)
  
  // ID states for chosen bible, book and chapter 
  const [selectedBibleId,setSelectedBibleId]=useState(''); // selected Bible id
  const [selectedBookId,setSelectedBookId]=useState(''); // book id
  const [selectedChapterId,setSelectedChapterId]=useState(''); // chapter id
  
  // Data lists
  const [listOfBibles,setListOfBibles] = useState([]);
  const [listOfBooks,setListOfBooks]=useState([]);
  const [listOfChapters,setListOfChapters]=useState([]);
  // Final text
  const [text,setText] = useState("In the beginning was the Word..."); // text of selected chapter of the Bible / error occured

  // download all books using API.Bible
  useEffect(()=>{
    fetchBibles(language);
  },[language])

  // change mode of application
  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', String(!isDark))
    setIsDark((prev) => !prev);
  };
  useEffect(() =>{
    document.body.classList.toggle('dark', isDark)
  },[isDark])


// Download all Bibles of given language and set list of them
  async function fetchBibles(language){
    try{
      setLoading()
      // reset other states
      setSelectedBibleId('')
      setSelectedBookId('')
      setSelectedChapterId('')
      setText("In the beginning was the Word...")
      setListOfBooks([])
      setListOfChapters([])
      const response = await fetch(`https://rest.api.bible/v1/bibles?language=${language}`, {
      headers:{
        'api-key': API_KEY
      }
    })
    if(response.ok !== true) throw new Error("Error occured when downloading Bibles.");
    
    const biblesObj = await response.json()
    setListOfBibles(biblesObj.data)
    
    }catch(err){
      setErrorMessage(setText, err.message)
    }
    finally{
      setLoading(false)
    }
  }


// Download all books and set list of books
  async function fetchBooks(bibleId){
    try{
      if(!bibleId) return
      setLoading(true)
      setSelectedBookId('')
      setSelectedChapterId('')
      setListOfChapters([])
      // setText("In the beginning was the Word...")

      const response = await fetch(`${API_BASE_URL}/bibles/${bibleId}/books`, {
      headers:{
        'api-key': API_KEY
      }
    })
    if(response.ok !== true) throw new Error("Error occured when downloading books.");
    const booksObj = await response.json()
    setListOfBooks(booksObj.data)

    }catch(err){
      setErrorMessage(setText, err.message)
    }
    finally{
      setLoading(false)
    }
  }

// Download and set list of chapters for chossen book
  async function fetchChapters(bookId){
    try{
      if(!bookId || !selectedBibleId) return
      setLoading(true)
      setSelectedChapterId('')
      // setText("In the beginning was the Word...")

      const response = await fetch(`${API_BASE_URL}/bibles/${selectedBibleId}/books/${bookId}/chapters`,{
        headers:{
          'api-key':API_KEY
        }
      })
      if(response.ok !== true) throw new Error("Error occured when downloading chapters.");
    
      const chaptersObj = await response.json()
      setListOfChapters(chaptersObj.data)

    }catch(err){
      setErrorMessage(setText, err.message)
    }
    finally{
      setLoading(false)
    }
  }

// Download text of selected chapter
  async function fetchText(chapterId){
    try{
      if(!selectedBibleId || !chapterId) return
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/bibles/${selectedBibleId}/chapters/${chapterId}`, {
        headers:{
          'api-key':API_KEY
        }
      })
      if(response.ok !== true) throw new Error("Error occured when downloading text.");
      
      const obj = await response.json()
      if(obj?.data !== undefined){
        setText(obj.data.content)
      }
    }catch(err){
      setErrorMessage(setText, err.message)
    }finally{
      setLoading(false)
    }
  }
//options for select tags from feched chapters nad books
  let options_of_languages=LIST_OF_LANGUAGES.map((val)=>(
    <option key={val.code} value={val.code}>{val.name}</option>
  ));
  let options_of_bibles=listOfBibles?.map((bible)=>(
    <option key={bible.id} value={bible.id}>{bible.name} {bible.description}</option>
  ));

  let options_of_books=listOfBooks?.map((val)=>(
    <option key={val.id} value={val.id}>{val.name}</option>
  ));
  let options_list_of_chapters=listOfChapters?.map((val)=>(
    <option key={val.id} value={val.id}>{val.number}</option>
  ));

  return (
    <>
        <form>
          {loading && <div className="loader"><Dove /><p>Loading ...</p>
          </div>}
          <div className='select-section'>
            <label id='lang'>Choose a Language</label>
            <select onChange={(e)=>setLanguage(e.target.value)} name='language'>
              {options_of_languages}
            </select>
          </div>

          <div className='select-section'>
            <label id='bibles'>Choose a Bible</label>
            <select onChange={(e)=>{
              setSelectedBibleId(e.target.value)
              fetchBooks(e.target.value)
            }} value={selectedBibleId || ''} name='bibles'>
              <option value="" disabled hidden >Bibles</option>
              {options_of_bibles}
            </select>
          </div>


          <div className='select-section'>
            <label id='book'>Choose a book</label>
            <select onChange={(e)=>{
              setSelectedBookId(e.target.value)
              fetchChapters(e.target.value)
            }} value={selectedBookId || ''} name='book'>
              <option value="" disabled hidden >Books</option>
              {options_of_books}
            </select>
          </div>

         
          <div className='select-section'>
            <label>Choose a chapter</label>
            <select id='chapter' name='chapter' value={selectedChapterId || ''} onChange={(e)=>{
              setSelectedChapterId(e.target.value)
              fetchText(e.target.value)
            }}>
              <option value="" disabled hidden >Chapters</option>
              {options_list_of_chapters}
            </select>
          </div>
          {/* <button type="submit" onClick={(e)=>fetchText(e)}>read</button> */}

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


import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { useState , useEffect} from 'react'
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import apiRequest from './apiRequest';


function App() {

  const API_URL = 'http://localhost:3500/items';

  const [items,setItems] = useState([]);

  const [newItem, setNewItem] = useState('')

  const [search, setSearch] = useState('')

  const [fetchError, setFetchError] = useState(null)

  const [isLoading,setIsLoading] = useState(true)

  useEffect(() =>{
    
    const fetchItems = async () => {
      try{
        const response = await fetch(API_URL);
        if(!response.ok) throw Error()
        console.log(response);
        
        const listItems = await response.json();
        setItems(listItems);
      } catch (err){
          console.log(err.message);
          
      }
    }

    

    setTimeout(() =>{
      (async () => await fetchItems())()
    },2000)

  },[])


  const addItem =async (item) =>{
    const id = items.length ? items[items.length -1 ].id +1 : 1 
    const addNewItem = {id,checked:false,item}

    const listItems = [...items, addNewItem]
    setItems(listItems)

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addNewItem)
    }
    const result = await apiRequest(API_URL,postOptions)
    if(result) setFetchError(result)
    
  }
  
  const handleCheck = async (id)=>{
   const listItems = items.map((item) => item.id === id ? {...item,checked:!item.checked}  : item)
   setItems(listItems)

   const myItem = listItems.filter(item => item.id === id)

   const updateOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({checked:myItem[0].checked})
  }
  const reqUrl = `${API_URL}/${id}`
  const result = await apiRequest(reqUrl,updateOptions)
  if(result) setFetchError(result)
  }
  
  const handleDelete = async (id) => {
    const deleteItems = items.filter((item) => item.id !== id)
    setItems(deleteItems)

    const deleteOptions ={
      method:'DELETE'
    }
     
    const reqUrl = `${API_URL}/${id}`
  const result = await apiRequest(reqUrl,deleteOptions)
  if(result) setFetchError(result)

  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    if(!newItem) return;
    console.log(newItem);
    addItem(newItem)
    //Adding Item
    setNewItem('')


  }
  

  return (
    <div className='App' >

     
     <Header/>
     <AddItem newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit}/>
     <SearchItem search={search} setSearch={setSearch}/>
     <Content items = {items.filter(item => (item.item).includes(search))}  handleCheck={handleCheck} handleDelete ={handleDelete}/>
     <Footer length = {items.length}/>


    </div>
  );
}

export default App;


import "./styles.css"
import { useState } from "react";

const defaultTodos = [];

function UsernameForm() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState(defaultTodos);
  
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleAddClick(){
    if (inputValue !== "") {
      setTodos([...todos, inputValue]);
      setInputValue("");
    }
  }

  function deleteTodo(index) {
    setTodos(todos.filter((todo , i) => i !== index))
  }

  return (
   
      <div className = "search-user-div">
       
        <input
          className = "invite-username"
          type="text"
          placeholder="Search for username..."
          value={inputValue}
          onChange={handleChange}
        />
       
        <button className = "search-btn" onClick={handleAddClick}>
        Search
        </button>

       <ul className = "username-List">
        {todos.map((todo, i) => 
        <li key={i} className = "list-of-usernames">
        {todo}{""}
        <button type="button" onClick={() => deleteTodo(i)} className = "delete-button">
        Delete
        </button>
        </li>
        )}
       </ul>
      

      </div>
     
    
  );
}

export default UsernameForm;



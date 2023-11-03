
import "../styles.css"
import { useState } from "react";



const mockDatabase = ["conor13", "ben43", "ben13", "micheal47", "micehal43"]; 
const defaultUsernames = [];

export default function UsernameForm() {
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(defaultUsernames);
  
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleAddClick(){
    if (inputValue !== "" && mockDatabase.includes(inputValue)) {
      setUsername([...username, inputValue]);
      setInputValue("");
    } else { 
      alert("There is no such username under this name");
    }
  }

  function deleteUsername(index) {
    setUsername(username.filter((todo , i) => i !== index))
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
        {username.map((username, i) => 
        <li key={i} className = "list-of-usernames">
        {username}{""}
        <button type="button" onClick={() => deleteUsername(i)} className = "delete-button">
        Delete
        </button>
        </li>
        )}
       </ul>
      

      </div>
  );
}
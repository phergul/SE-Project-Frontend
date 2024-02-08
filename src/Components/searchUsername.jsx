import "../styles.css";
import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

const defaultUsernames = [];

export default function UsernameForm() {
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(defaultUsernames);

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleAddClick() {
    const functions = getFunctions();
    const searchUsersByDisplayName = httpsCallable(functions, 'searchUsersByDisplayName');

    searchUsersByDisplayName({ inputValue }).then((result) => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });

    

  }

  function deleteUsername(index) {
    setUsername(username.filter((todo, i) => i !== index));
  }

  return (
    <div className="search-user-div">
      <input
        className="invite-username"
        type="text"
        placeholder="Search for username..."
        value={inputValue}
        onChange={handleChange}
      />

      <button className="search-btn" onClick={handleAddClick}>
        Search
      </button>

      <ul className="username-List">
        {username.map((username, i) => (
          <li key={i} className="list-of-usernames">
            {username}
            {""}
            <button
              type="button"
              onClick={() => deleteUsername(i)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

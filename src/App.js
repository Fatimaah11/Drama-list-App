import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [newdramaadd, setNewDramaAdd] = useState(() => {
    // Retrieve data from localStorage if available, or initialize as an empty array
    const storedDramas = localStorage.getItem("dramas");
    return storedDramas ? JSON.parse(storedDramas) : [];
  });

  // Function to update localStorage whenever dramas change
  useEffect(() => {
    localStorage.setItem("dramas", JSON.stringify(newdramaadd));
  }, [newdramaadd]);

  function handleAddDrama(drama) {
    setNewDramaAdd((prevdrama) => [...prevdrama, drama]);
  }

  function handleDelete(id) {
    setNewDramaAdd((curdrama) => curdrama.filter((drama) => drama.id !== id));
  }

  function handletoggle(id) {
    setNewDramaAdd((thedrama) =>
      thedrama.map((drama) =>
        drama.id === id ? { ...drama, watched: !drama.watched } : drama
      )
    );
  }

  function handleCLearList() {
    const confirmFirst = window.confirm(
      "Are you sure you want to clear the list??"
    );
    if (confirmFirst) setNewDramaAdd([]);
  }
  return (
    <div className="App">
      <Logo />
      <Form onAddDrama={handleAddDrama} />
      <DramasList
        newestdrama={newdramaadd}
        onDeleteDrama={handleDelete}
        onToggle={handletoggle}
        onClearList={handleCLearList}
      />
      <Stats addDrama={newdramaadd} />
    </div>
  );
}

function Logo() {
  return (
    <div>
      <h1>My Drama List</h1>
    </div>
  );
}
function Form({ onAddDrama }) {
  const [dramaName, setDramaName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!dramaName) return;

    const newDrama = { dramaName, watched: false, id: Date.now() };
    onAddDrama(newDrama);

    setDramaName("");
  }
  return (
    <form className="formData" onSubmit={handleSubmit}>
      <span>Add the drama you want to watch &rarr;</span>
      <input
        type="text"
        placeholder="drama name here"
        value={dramaName}
        onChange={(e) => setDramaName(e.target.value)}
      />
      <button className="btn">Add</button>
    </form>
  );
}

function DramasList({ newestdrama, onDeleteDrama, onToggle, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  let SortedDramas;

  if (sortBy === "input") SortedDramas = newestdrama;

  if (sortBy === "dramaName")
    SortedDramas = newestdrama
      .slice()
      .sort((a, b) => a.dramaName.localeCompare(b.dramaName));

  if (sortBy === "watched")
    SortedDramas = newestdrama
      .slice()
      .sort((a, b) => Number(a.watched) - Number(b.watched));
  return (
    <div className="list">
      <ul>
        {SortedDramas.map((alldramas, index) => (
          <Drama
            PropDrama={alldramas}
            onDeleteDrama={onDeleteDrama}
            onToggle={onToggle}
            index={index}
            key={alldramas.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="dramaName">Sort by dramaName order</option>
          <option value="watched">Sort by watched order</option>
        </select>
        <button className="btn2" onClick={onClearList}>
          {" "}
          CLearList
        </button>
      </div>
    </div>
  );
}

function Drama({ PropDrama, onDeleteDrama, onToggle, index }) {
  return (
    <li>
      <input
        type="checkbox"
        value={PropDrama.watched}
        onChange={() => onToggle(PropDrama.id)}
      />
      <span>{index + 1} </span>
      <span style={PropDrama.watched ? { textDecoration: "line-through" } : {}}>
        {PropDrama.dramaName}
      </span>
      <button onClick={() => onDeleteDrama(PropDrama.id)}>❌</button>
    </li>
  );
}

function Stats({ addDrama }) {
  if (!addDrama.length)
    return (
      <p className="stats">
        <em>You have not added any drama , start adding Now!</em>
      </p>
    );
  ///number of dramas
  const numDrama = addDrama.length;
  //already watched dramas
  const numWatched = addDrama.filter((drama) => drama.watched).length;
  return (
    <footer className="stats">
      <em>
        You have {numDrama} dramas in your list and you have watched{" "}
        {numWatched} dramas.
      </em>
    </footer>
  );
}

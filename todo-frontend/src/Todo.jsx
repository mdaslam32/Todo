import { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDesciption] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");

  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    getItems();
  }, []);

  // Get all tasks from database
  const getItems = async () => {
    const data = await fetch(apiUrl + "/todos");
    const json = await data.json();
    setTodos(json);
  };

  // Create a new task in database
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            //add item to list
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDesciption("");
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  // Update a particular task
  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });

            setTodos(updatedTodos);
            setEditTitle("");
            setEditDesciption("");
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 10000);

            setEditId(-1);
          } else {
            //set error
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  // Delete a particular task
  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  // Handling the edit button
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description);
  };

  return (
    <div className="container">
      <div className="row p-3 my-4 bg-success text-light rounded">
        <h1 className="text-center">Todo application using MERN stack</h1>
      </div>

      {/* Create a new task */}
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2 my-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDesciption(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* Displaying all the tasks */}
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item, index) => (
              <li
                key={index}
                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
              >
                <div className="d-flex flex-column me-2">
                  {editId == -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          placeholder="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                          className="form-control"
                          type="text"
                        />
                        <input
                          placeholder="Description"
                          onChange={(e) => setEditDesciption(e.target.value)}
                          value={editDescription}
                          className="form-control"
                          type="text"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {editId == -1 ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId == -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setEditId(-1);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Todo;

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './todoSlice';
import { Button, TextField, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const newTodoRef = useRef(null); // Ref for the new todo alert
  const inputRef = useRef(null); // Ref for the input field

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    if (newTodoRef.current) {
      newTodoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [todos.length]);

  useEffect(() => {
    if (editTodoId && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editTodoId]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      dispatch(addTodo({ todo: newTodo }));
      setNewTodo('');
    }
  };

  const handleUpdateTodo = () => {
    if (newTodo.trim() && editTodoId) {
      dispatch(updateTodo({ id: editTodoId, todo: newTodo, completed: false }));
      setEditTodoId(null);
      setNewTodo('');
    }
  };

  const handleToggleComplete = (todo) => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleEdit = (todo) => {
    setEditTodoId(todo.id);
    setNewTodo(todo.todo);
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
        <h1
          style={{
            textAlign: 'center',
            color: '#007BFF',
            fontSize: '3rem',
            textShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
            margin: 0
          }}
        >
          Todo List
        </h1>
      </header>

      <div style={{ flex: '0 0 auto', padding: '20px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <TextField
            placeholder={editTodoId ? 'Update todo' : 'Add a new task'}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            variant="outlined"
            inputProps={{
              style: {
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }}
            InputLabelProps={{
              style: {
                color: '#007BFF',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }
            }}
            style={{
              width: '100%',
              maxWidth: '400px'
            }}
            ref={inputRef}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          {editTodoId ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateTodo}
              style={{ display: 'block', margin: '0 auto' }}
            >
              Update Task
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTodo}
              style={{ display: 'block', margin: '0 auto' }}
            >
              Add Task
            </Button>
          )}
        </div>
      </div>

      <main style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 20px' }}>
        <List style={{ maxWidth: '900px', margin: '0 auto' }}>
          {todos
            .slice() // Create a copy of the array
            .reverse() // Reverse the order so new tasks appear first
            .map((todo, index) => (
              <ListItem
                key={todo.id}
                ref={index === 0 ? newTodoRef : null} // Ref to scroll to the first item
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  maxWidth: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(2deg) scale(1)';
                  e.currentTarget.style.boxShadow = '6px 6px 15px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                  e.currentTarget.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                />
                <ListItemText
                  primary={todo.todo}
                  style={{
                    whiteSpace: 'normal', // Allow wrapping
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleDelete(todo.id)}
                  style={{
                    marginLeft: '0.5rem',
                    color: '#fff',
                    backgroundColor: '#FF5C5C',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(todo)}
                  style={{
                    marginLeft: '0.5rem',
                    color: '#fff',
                    backgroundColor: '#4CAF50',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <EditIcon />
                </Button>
              </ListItem>
            ))}
        </List>
      </main>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface TodoItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
  children: React.ReactNode
}

const TodoItem: React.FC<TodoItemProps> = ({ text, completed, onToggle }) => (
  <li className={`todo-item ${completed ? 'completed' : ''}`} onClick={onToggle}>
    {completed ? '✅' : '⭕'} {text}
  </li>
);

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<string[]>(['Learn React', 'Build an app']);
  const [completedTodos, setCompletedTodos] = useState<Set<number>>(new Set());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
      setIsLoading(false);
    }, 1000);
  }, []);

  const addTodo = useCallback(() => {
    if (inputValue.trim()) {
      setTodos(prev => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  }, [inputValue]);

  const toggleTodo = useCallback((index: number) => {
    setCompletedTodos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const completionRate = useMemo(() => 
    todos.length > 0 ? Math.round((completedTodos.size / todos.length) * 100) : 0,
    [todos.length, completedTodos.size]
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || 'Guest'}!</h1>
      {user && <p>Email: {user.email}</p>}
      
      <div className="todo-section">
        <h2>Your Todos ({completionRate}% complete)</h2>
        <div className="status-badges">
          <StatusBadge count={todos.length} label="task" />
          <StatusBadge count={completedTodos.size} label="completed" />
        </div>
        <div className="add-todo">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
          />
          <button onClick={addTodo} disabled={!inputValue.trim()}>
            Add
          </button>
        </div>
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <TodoItem
              key={index}
              text={todo}
              completed={completedTodos.has(index)}
              onToggle={() => toggleTodo(index)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
import { useState, useEffect } from 'react';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API}/api/tasks`)
            .then(r => r.json())
            .then(data => { setTasks(data); setLoading(false); })
            .catch(() => { setError('Cannot connect to backend'); setLoading(false); });
    }, []);

    const addTask = async () => {
        if (!input.trim()) return;
        const res = await fetch(`${API}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: input }),
        });
        const task = await res.json();
        setTasks(prev => [...prev, task]);
        setInput('');
    };

    const toggleTask = async (id) => {
        const res = await fetch(`${API}/api/tasks/${id}`, { method: 'PUT' });
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
    };

    const deleteTask = async (id) => {
        await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' });
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const done = tasks.filter(t => t.done).length;
    const total = tasks.length;

    return (
        <div className="app">
            <header className="header">
                <div className="header-top">
                    <span className="logo">⚙ Jenkins</span>
                    <span className="badge">CI/CD Todo App</span>
                </div>
                <h1>Task Manager</h1>
                <p className="subtitle">Built with React + Node.js — Deployed via Jenkins</p>
            </header>

            <main className="main">
                {/* Progress bar */}
                <div className="progress-card">
                    <div className="progress-label">
                        <span>Progress</span>
                        <span>{done}/{total} done</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: total ? `${(done / total) * 100}%` : '0%' }}
                        />
                    </div>
                </div>

                {/* Input */}
                <div className="input-row">
                    <input
                        className="task-input"
                        placeholder="Add a new task..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                    />
                    <button className="add-btn" onClick={addTask}>Add</button>
                </div>

                {/* Task list */}
                {loading && <p className="status">Loading...</p>}
                {error && <p className="status error">{error}</p>}

                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                            <button className="check-btn" onClick={() => toggleTask(task.id)}>
                                {task.done ? '✓' : ''}
                            </button>
                            <span className="task-title">{task.title}</span>
                            <button className="del-btn" onClick={() => deleteTask(task.id)}>✕</button>
                        </li>
                    ))}
                    {!loading && tasks.length === 0 && (
                        <li className="empty">No tasks yet. Add one above!</li>
                    )}
                </ul>
            </main>

            <footer className="footer">
                Deployed by Jenkins Pipeline • Build #{process.env.REACT_APP_BUILD_NUMBER || 'local'}
            </footer>
        </div>
    );
}

export default App;
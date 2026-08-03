"use client"
import React, { useState, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, X, Edit2, Filter, CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [editingId, setEditingId] = useState<number | null>(null);    
    const [editValue, setEditValue] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos-pro');
        if (savedTodos) {
            try {
                setTodos(JSON.parse(savedTodos));
            } catch (e) {
                console.error('Failed to parse todos from localStorage', e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('todos-pro', JSON.stringify(todos));
        }
    }, [todos, isLoaded]);

    const addTodo = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false,
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditValue(todo.text);
    };

    const saveEdit = () => {
        if (!editValue.trim()) {
            setEditingId(null);
            return;
        }
        setTodos(todos.map(todo =>
            todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
        ));
        setEditingId(null);
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const activeCount = todos.filter(t => !t.completed).length;

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto">
                <header className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-2"
                    >
                        <ListTodo className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                            TaskFlow
                        </h1>
                    </motion.div>
                    <p className="text-slate-500">Stay organized and productive every day.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
                >
                    <form onSubmit={addTodo} className="p-6 border-b border-slate-100 bg-white">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="What needs to be done?"
                                className="w-full pl-4 pr-12 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </form>

                    <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                        <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">
                            {activeCount} items left
                        </span>
                    </div>

                    <div className="min-h-80! overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {filteredTodos.length > 0 ? (
                                filteredTodos.map((todo) => (
                                    <motion.div
                                        key={todo.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`group flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-colors ${todo.completed ? 'bg-slate-50/30' : ''
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleComplete(todo.id)}
                                            className={`shrink-0 transition-transform active:scale-90 ${todo.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'
                                                }`}
                                        >
                                            {todo.completed ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : (
                                                <Circle className="w-6 h-6" />
                                            )}
                                        </button>

                                        {editingId === todo.id ? (
                                            <div className="grow flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                                    onBlur={saveEdit}
                                                    className="w-full py-1 px-2 bg-white border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <span
                                                className={`grow text-slate-700 transition-all cursor-pointer ${todo.completed ? 'line-through text-slate-400 italic' : ''
                                                    }`}
                                                onClick={() => toggleComplete(todo.id)}
                                            >
                                                {todo.text}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(todo)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Edit task"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete task"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                        <Filter className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-medium">No tasks found in this view.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Section */}
                    {todos.some(t => t.completed) && (
                        <div className="p-4 bg-white border-t border-slate-100 text-right">
                            <button
                                onClick={clearCompleted}
                                className="text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline transition-all"
                            >
                                Clear completed tasks
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

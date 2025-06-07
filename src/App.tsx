import './App.css';
import ValueContainer from './components/value-container';
import ButtonsContainer from './components/buttons-container';
import { useEffect,  } from 'react';
import { completeTodo, deleteTodo, fetchTodos, useIsLoading, useTodos } from './store/use-todo-store';


function App() {
    // const [todos, setTodos] = useState<Itodo[]>([]);
    const isLoading = useIsLoading();
    const todos = useTodos();

    // const handleComplete = (id: number) => {
    //     setTodos(
    //         todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    //     );
    // };

    // const handleDelete = (id: number) => {
    //     setTodos(todos.filter((todo) => todo.id !== id));
    // };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <>
            <ValueContainer />
            <ButtonsContainer />

            <button onClick={fetchTodos}>Загрузить todos</button>

            <div className="todos">
                <h1>Todo List</h1>

                {!isLoading ? (
                    <ul className="todo-list">
                        {todos.map((todo) => (
                            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                                <span
                                    className={`todo-text ${
                                        todo.completed ? 'completed-text' : ''
                                    }`}>
                                    {todo.todo}
                                </span>
                                <div className="actions">
                                    <button onClick={() => completeTodo(todo.id)}>
                                        {todo.completed ? '✅' : '☑️'}
                                    </button>
                                    <button onClick={() => deleteTodo(todo.id)}>❌</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    'Загрузка...'
                )}
            </div>
        </>
    );
}

export default App;

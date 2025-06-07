import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface Itodo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

interface IActions {
    fetchTodos: () => Promise<void>;
    completeTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

interface iInitialState {
    todos: Itodo[];
    isLoading: boolean;
}
interface ITodoState extends iInitialState, IActions {}

const initialState: iInitialState = {
    todos: [],
    isLoading: true,
};

const todoStore: StateCreator<
    ITodoState,
    [['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set, get) => ({
    ...initialState,
    fetchTodos: async () => {
        set({ isLoading: true }, false, 'fetchTodos');
        try {
            const response = await fetch('https://dummyjson.com/todos?limit=6&skip=10');
            const data = await response.json();
            set({ todos: data.todos }, false, 'fetchTodos/success');
        } catch (error) {
            console.log(error);
            set({ todos: [] }, false, 'fetchTodos/failed');
        } finally {
            set({ isLoading: false }, false, 'fetchTodos/finally');
        }
    },
    completeTodo: (id: number) => {
        set(
            (state) => ({
                todos: state.todos.map((todo) =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
                ),
            }),
            false,
            'completeTodo',
        );
    },
    deleteTodo: (id: number) => {
        set(
            () => {
                const todos = get().todos;
                return { todos: todos.filter((todo) => todo.id !== id) };
            },
            false,
            'deleteTodo',
        );
    },
    // increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
    // decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement'),
});
const useTodoStore = create<ITodoState>()(
    devtools(
        persist(todoStore, {
            name: 'todo-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ todos: state.todos }),
        }),
    ),
);

export const useTodos = () => useTodoStore((state) => state.todos);
export const useIsLoading = () => useTodoStore((state) => state.isLoading);
export const fetchTodos = () => useTodoStore.getState().fetchTodos();
export const completeTodo = (id: number) => useTodoStore.getState().completeTodo(id);
export const deleteTodo = (id: number) => useTodoStore.getState().deleteTodo(id);
// export const incrementCount = () => useTodoStore.getState().increment;
// export const decrementCount = () => useTodoStore.getState().decrement;

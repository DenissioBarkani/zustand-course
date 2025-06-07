import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
    [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set) => ({
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
            (state) => {
                // todos: state.todos.map((todo) =>
                //     todo.id === id ? { ...todo, completed: !todo.completed } : todo,
                // ),
                const todo = state.todos.find((todo: Itodo) => todo.id === id);
                if (todo) {
                    todo.complited = !todo.completed;
                }
            },
            false,
            'completeTodo',
        );
    },
    deleteTodo: (id: number) => {
        set(
            (state) => {
                const index = state.todos.findIndex((todo: Itodo) => todo.id === id);
                if (index !== -1) {
                    state.todos.splice(index, 1);
                }
                // const todos = get().todos;
                // return { todos: todos.filter((todo) => todo.id !== id) };
            },
            false,
            'deleteTodo',
        );
    },
    // increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
    // decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement'),
});
const useTodoStore = create<ITodoState>()(
    immer(
        devtools(
            persist(todoStore, {
                name: 'todo-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ todos: state.todos }),
            }),
        ),
    ),
);

export const useTodos = () => useTodoStore((state) => state.todos);
export const useIsLoading = () => useTodoStore((state) => state.isLoading);
export const fetchTodos = () => useTodoStore.getState().fetchTodos();
export const completeTodo = (id: number) => useTodoStore.getState().completeTodo(id);
export const deleteTodo = (id: number) => useTodoStore.getState().deleteTodo(id);
// export const incrementCount = () => useTodoStore.getState().increment;
// export const decrementCount = () => useTodoStore.getState().decrement;

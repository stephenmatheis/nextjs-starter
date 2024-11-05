'use client';

import {
    KeyboardEvent,
    useEffect,
    useState,
    useReducer,
    useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Lists } from './components/lists';
import { ListProps } from './types/todos';
import styles from './page.module.scss';

enum ActionType {
    ADD_LIST = 'ADD_LIST',
    ADD_TASK = 'ADD_TASK',
    RENAME_TASK = 'RENAME_LIST',
    DELETE_TASK = 'DELETE TASK',
    TOGGLE_TASK_COMPLETION = 'TOGGLE_TASK_COMPLETION',
    REORDER_TASKS = 'REORDER_TASKS',
    REORDER_LISTS = 'REORDER_LISTS',
    SET_LISTS_FROM_STORAGE = 'SET_LISTS_FROM_STORAGE',
}

type Action =
    | { type: ActionType.ADD_LIST; payload: { name: string } }
    | {
          type: ActionType.RENAME_TASK;
          payload: { listId: string; taskId: string; content: string };
      }
    | {
          type: ActionType.DELETE_TASK;
          payload: { listId: string; taskId: string };
      }
    | {
          type: ActionType.ADD_TASK;
          payload: { listId: string; taskContent: string };
      }
    | {
          type: ActionType.TOGGLE_TASK_COMPLETION;
          payload: { listId: string; id: string };
      }
    | {
          type: ActionType.REORDER_TASKS;
          payload: { listId: string; fromIndex: number; toIndex: number };
      }
    | {
          type: ActionType.REORDER_LISTS;
          payload: { fromIndex: number; toIndex: number };
      }
    | { type: ActionType.SET_LISTS_FROM_STORAGE; payload: ListProps[] };

function addList(name: string): Action {
    return { type: ActionType.ADD_LIST, payload: { name } };
}

function addTask(listId: string, taskContent: string): Action {
    return {
        type: ActionType.ADD_TASK,
        payload: { listId, taskContent },
    };
}

function deleteTask(listId: string, taskId: string): Action {
    return {
        type: ActionType.DELETE_TASK,
        payload: { listId, taskId },
    };
}

function renameTask(listId: string, taskId: string, content: string): Action {
    return {
        type: ActionType.RENAME_TASK,
        payload: { listId, taskId, content },
    };
}

function toggleTaskCompletion(listId: string, id: string): Action {
    return {
        type: ActionType.TOGGLE_TASK_COMPLETION,
        payload: { listId, id },
    };
}

function reorderTasks(
    listId: string,
    fromIndex: number,
    toIndex: number,
): Action {
    return {
        type: ActionType.REORDER_TASKS,
        payload: { listId, fromIndex, toIndex },
    };
}

// function reorderLists(fromIndex: number, toIndex: number): Action {
//     return {
//         type: ActionType.REORDER_LISTS,
//         payload: { fromIndex, toIndex },
//     };
// }

function reducer(state: ListProps[], action: Action): ListProps[] {
    switch (action.type) {
        case ActionType.ADD_LIST:
            return [
                ...state,
                { id: uuidv4(), name: action.payload.name, todos: [] },
            ];

        case ActionType.ADD_TASK:
            return state.map((list) =>
                list.id === action.payload.listId
                    ? {
                          ...list,
                          todos: [
                              ...list.todos,
                              {
                                  id: uuidv4(),
                                  content: action.payload.taskContent,
                                  isDone: false,
                              },
                          ],
                      }
                    : list,
            );

        case ActionType.DELETE_TASK:
            return state.map((list) => {
                if (list.id === action.payload.listId) {
                    return {
                        ...list,
                        todos: list.todos.filter(
                            (task) => task.id !== action.payload.taskId,
                        ),
                    };
                }

                return list;
            });

        case ActionType.RENAME_TASK:
            return state.map((list) => {
                if (list.id === action.payload.listId) {
                    return {
                        ...list,
                        todos: list.todos.map((task) => {
                            if (task.id === action.payload.taskId) {
                                return {
                                    ...task,
                                    content: action.payload.content,
                                };
                            }

                            return task;
                        }),
                    };
                }

                return list;
            });

        case ActionType.TOGGLE_TASK_COMPLETION:
            return state.map((list) =>
                list.id === action.payload.listId
                    ? {
                          ...list,
                          todos: list.todos.map((todo) =>
                              todo.id === action.payload.id
                                  ? { ...todo, isDone: !todo.isDone }
                                  : todo,
                          ),
                      }
                    : list,
            );

        case ActionType.REORDER_TASKS: {
            const list = state.find(
                (list) => list.id === action.payload.listId,
            );

            if (!list) return state;

            const updatedTodos = reorderArray(
                list.todos,
                action.payload.fromIndex,
                action.payload.toIndex,
            );

            return state.map((list) =>
                list.id === action.payload.listId
                    ? { ...list, todos: updatedTodos }
                    : list,
            );
        }

        case ActionType.REORDER_LISTS:
            return reorderArray(
                state,
                action.payload.fromIndex,
                action.payload.toIndex,
            );

        case ActionType.SET_LISTS_FROM_STORAGE:
            return action.payload;

        default:
            return state;
    }
}

function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);

    newArray.splice(toIndex, 0, movedItem);

    return newArray;
}

export default function Home() {
    const [value, setValue] = useState<string>('');
    const [lists, dispatch] = useReducer(reducer, [] as ListProps[]);

    const setListsFromLocalStorage = useCallback((storedLists: ListProps[]) => {
        dispatch({
            type: ActionType.SET_LISTS_FROM_STORAGE,
            payload: storedLists,
        });
    }, []);

    function handleAddList(name: string) {
        setValue('');

        return dispatch(addList(name));
    }

    function handleAddTask(listId: string, taskContent: string) {
        return dispatch(addTask(listId, taskContent));
    }

    function handleDeleteTask(listId: string, taskId: string) {
        return dispatch(deleteTask(listId, taskId));
    }

    function handleRenameTask(
        listId: string,
        taskId: string,
        taskContent: string,
    ) {
        return dispatch(renameTask(listId, taskId, taskContent));
    }

    function handleToggleTaskCompletion(listName: string, taskContent: string) {
        return dispatch(toggleTaskCompletion(listName, taskContent));
    }

    function handleReorderTasks(
        listId: string,
        fromIndex: number,
        toIndex: number,
    ) {
        return dispatch(reorderTasks(listId, fromIndex, toIndex));
    }

    // function handleReorderLists(fromIndex: number, toIndex: number) {
    //     return dispatch(reorderLists(fromIndex, toIndex));
    // }

    useEffect(() => {
        if (lists.length > 0) {
            localStorage.setItem('lists', JSON.stringify(lists));
        }
    }, [lists]);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.toolbar}>
                    <input
                        type="text"
                        placeholder="New list"
                        className={styles.field}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event: KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleAddList(value);
                            }
                        }}
                    />
                    <button
                        className={styles.create}
                        onClick={() => handleAddList(value)}
                    >
                        Create
                    </button>
                </div>
            </header>
            <Lists
                lists={lists}
                setListsFromLocalStorage={setListsFromLocalStorage}
                addTask={handleAddTask}
                deleteTask={handleDeleteTask}
                renameTask={handleRenameTask}
                toggleTaskCompletion={handleToggleTaskCompletion}
                reorderTasks={handleReorderTasks}
            />
            <footer className={styles.footer}>Footer</footer>
        </div>
    );
}

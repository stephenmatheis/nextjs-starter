import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { TodoProps, LayoutOptions } from '@/app/types/todos';
import styles from './list.module.scss';
import classNames from 'classnames';

type ListComponentProps = {
    index: number;
    layout: LayoutOptions;
    listId: string;
    name: string;
    todos: TodoProps[];
    addTask: (listName: string, taskContent: string) => void;
    deleteTask: (listId: string, taskId: string) => void;
    renameTask: (listId: string, taskId: string, content: string) => void;
    renameList: (listId: string, content: string) => void;
    toggleTaskCompletion: (listName: string, taskContent: string) => void;
    reorderTasks: (
        listName: string,
        fromIndex: number,
        toIndex: number,
    ) => void;
};

export function List({
    layout,
    listId,
    name,
    todos,
    addTask,
    deleteTask,
    renameTask,
    renameList,
    toggleTaskCompletion,
    reorderTasks,
}: ListComponentProps) {
    const [value, setValue] = useState<string>('');
    const [isTaskEditable, setIsTaskEditable] = useState<number | null>(null);
    const [isListNameEditable, setIsListNameEditable] =
        useState<boolean>(false);
    const [reorder, setReorder] = useState<boolean>(false);
    const editTaskRef = useRef<HTMLInputElement>(null);
    const editListNameRef = useRef<HTMLInputElement>(null);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    useEffect(() => {
        if (!editListNameRef.current) return;

        if (isListNameEditable) {
            console.log('Added window event');
            window.addEventListener('click', resetEdit);
        }

        function resetEdit(event: MouseEvent) {
            console.log('Fired window event');

            if (
                !editListNameRef.current?.contains(
                    event.target as HTMLInputElement,
                )
            ) {
                setIsListNameEditable(false);
                setIsTaskEditable(null);
            }
        }

        return () => {
            window.removeEventListener('click', resetEdit);
        };
    }, [isListNameEditable, editListNameRef]);

    useEffect(() => {
        if (!editTaskRef.current) return;

        if (isTaskEditable !== null) {
            window.addEventListener('click', resetEdit);
        }

        function resetEdit(event: MouseEvent) {
            if (
                !editTaskRef.current?.contains(event.target as HTMLInputElement)
            ) {
                setIsListNameEditable(false);
                setIsTaskEditable(null);
            }
        }

        return () => {
            window.removeEventListener('click', resetEdit);
        };
    }, [isTaskEditable, editTaskRef]);

    return (
        <div className={classNames(styles.list, styles[layout.toLowerCase()])}>
            <div className={styles.card}>
                <div
                    className={styles.title}
                    onDoubleClick={() => {
                        setIsListNameEditable(true);
                    }}
                >
                    {isListNameEditable ? (
                        <input
                            ref={editListNameRef}
                            autoFocus
                            type="text"
                            className={styles.edit}
                            defaultValue={name}
                            onKeyDown={(
                                event: KeyboardEvent<HTMLInputElement>,
                            ) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();

                                    const value = (
                                        event.target as HTMLInputElement
                                    ).value;

                                    if (!value) {
                                        alert(`List name can't be empty.`);

                                        return;
                                    }

                                    renameList(
                                        listId,
                                        (event.target as HTMLInputElement)
                                            .value || '',
                                    );

                                    setIsListNameEditable(false);
                                }

                                if (event.key === 'Escape') {
                                    event.preventDefault();
                                    setIsListNameEditable(false);
                                }
                            }}
                        />
                    ) : (
                        <h3>{name}</h3>
                    )}
                    <div className={styles.toolbar}>
                        {reorder ? (
                            <button
                                className="selected"
                                onClick={() => setReorder(false)}
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                className={styles['menu-btn']}
                                onClick={() => setShowMenu((prev) => !prev)}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                            </button>
                        )}
                        {showMenu && (
                            <div className={styles.menu}>
                                <ul
                                    className={styles.options}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        setShowMenu(false);
                                    }}
                                >
                                    <li
                                        className={styles.option}
                                        onClick={() => {
                                            setIsListNameEditable(true);
                                        }}
                                    >
                                        Rename list
                                    </li>
                                    <li
                                        className={styles.option}
                                        onClick={() => setReorder(true)}
                                    >
                                        Reorder items
                                    </li>
                                    <hr />
                                    <li
                                        className={classNames(
                                            styles.option,
                                            styles.red,
                                        )}
                                        onClick={() => {
                                            console.log('Delete');
                                        }}
                                    >
                                        Delete list
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <ul className={styles.tasks}>
                    {todos.length > 0 &&
                        todos.map(
                            (
                                { id, content, isDone }: TodoProps,
                                index: number,
                            ) => (
                                <li key={id} className={styles.task}>
                                    {/* Reorder tasks */}
                                    {reorder && (
                                        <div className={styles.order}>
                                            <button
                                                className={styles.up}
                                                onClick={() => {
                                                    let newIndex = index - 1;

                                                    if (newIndex === -1) {
                                                        newIndex =
                                                            todos.length - 1;
                                                    }

                                                    reorderTasks(
                                                        listId,
                                                        index,
                                                        newIndex,
                                                    );
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                className={styles.down}
                                                onClick={() => {
                                                    let newIndex = index + 1;

                                                    if (
                                                        newIndex >
                                                        todos.length - 1
                                                    ) {
                                                        newIndex = 0;
                                                    }

                                                    reorderTasks(
                                                        listId,
                                                        index,
                                                        newIndex,
                                                    );
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    {/* Checkbox */}
                                    <div className={styles.checkbox}>
                                        <label className={styles.label}>
                                            <input
                                                type="checkbox"
                                                checked={isDone}
                                                onChange={() => {
                                                    toggleTaskCompletion(
                                                        listId,
                                                        id,
                                                    );
                                                }}
                                            />
                                            <span className={styles.check} />
                                        </label>
                                    </div>
                                    {/* Task name */}
                                    <span
                                        className={styles.content}
                                        onDoubleClick={() => {
                                            setIsTaskEditable(index);
                                        }}
                                    >
                                        {isTaskEditable == index ? (
                                            <input
                                                ref={editTaskRef}
                                                autoFocus
                                                type="text"
                                                className={styles.edit}
                                                defaultValue={content}
                                                onKeyDown={(
                                                    event: KeyboardEvent<HTMLInputElement>,
                                                ) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();

                                                        const value = (
                                                            event.target as HTMLInputElement
                                                        ).value;

                                                        if (!value) {
                                                            alert(
                                                                `Task name can't be empty.`,
                                                            );

                                                            return;
                                                        }

                                                        renameTask(
                                                            listId,
                                                            id,
                                                            (
                                                                event.target as HTMLInputElement
                                                            ).value || '',
                                                        );

                                                        setIsTaskEditable(null);
                                                    }

                                                    if (
                                                        event.key === 'Escape'
                                                    ) {
                                                        event.preventDefault();
                                                        setIsTaskEditable(null);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className={styles.view}>
                                                {content}
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        className={styles.delete}
                                        onClick={() => {
                                            deleteTask(listId, id);
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </button>
                                </li>
                            ),
                        )}
                </ul>
                <div className={styles.newtask}>
                    <input
                        type="text"
                        className={styles.field}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event: KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();

                                addTask(listId, value);
                                setValue('');
                            }
                        }}
                    />
                    <button
                        className={styles.create}
                        onClick={() => {
                            addTask(listId, value);
                            setValue('');
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

import { KeyboardEvent, useEffect, useState } from "react";
import { Todo } from "@/app/types/todos";
import styles from "./list.module.scss";

type ListProps = {
    todos: Todo[];
    handleUpdateTodos: (todos: Todo[]) => void;
    handleDone: (index: number, checked: boolean) => void;
    handleDelete: (index: number) => void;
    handleRename: (index: number, content: string) => void;
    handleReorder: (oldIndex: number, newIndex: number) => void;
};

export function List({
    todos,
    handleUpdateTodos,
    handleDone,
    handleDelete,
    handleRename,
    handleReorder,
}: ListProps) {
    const [isEditable, setIsEditable] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        handleUpdateTodos(
            localStorage.getItem("todos")
                ? JSON.parse(localStorage.getItem("todos")!)
                : []
        );
    }, [handleUpdateTodos]);

    return (
        <div className={styles.list}>
            <div className={styles.title}>
                <h3>List</h3>
                <div className={styles.toolbar}>
                    <button onClick={() => setEditMode((prev) => !prev)}>
                        <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                        </svg>
                    </button>
                </div>
            </div>
            <ul className={styles.tasks}>
                {todos.length > 0 &&
                    todos.map(({ content, isDone }: Todo, index: number) => (
                        <li key={index} className={styles.task}>
                            {editMode && (
                                <div className={styles.order}>
                                    {/* <input
                                        type="number"
                                        value={index + 1}
                                        onChange={(event) => {
                                            handleReorder(
                                                index,
                                                parseInt(event?.target.value) -
                                                    1
                                            );
                                        }}
                                    /> */}
                                    <button
                                        className={styles.up}
                                        onClick={() => {
                                            let newIndex = index - 1;

                                            if (newIndex === -1) {
                                                newIndex = todos.length - 1;
                                            }

                                            handleReorder(index, newIndex);
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

                                            if (newIndex > todos.length - 1) {
                                                newIndex = 0;
                                            }

                                            handleReorder(index, newIndex);

                                            // console.log(
                                            //     `Moving down from ${index} to ${
                                            //         index + 1
                                            //     }`
                                            // );
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
                            <input
                                type="checkbox"
                                className={styles.done}
                                checked={isDone}
                                onChange={(event) => {
                                    handleDone(index, event.target.checked);
                                }}
                            />
                            <span
                                className={styles.content}
                                onDoubleClick={() => {
                                    setIsEditable(index);
                                }}
                            >
                                {isEditable == index ? (
                                    <input
                                        autoFocus
                                        type="text"
                                        className={styles.edit}
                                        defaultValue={content}
                                        onKeyDown={(
                                            event: KeyboardEvent<HTMLInputElement>
                                        ) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();

                                                handleRename(
                                                    index,
                                                    (
                                                        event.target as HTMLInputElement
                                                    ).value || ""
                                                );

                                                setIsEditable(null);
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
                                    handleDelete(index);
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
                    ))}
            </ul>
        </div>
    );
}

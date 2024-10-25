import { useEffect } from "react";
import { Todo } from "@/app/types/todos";
import styles from "./list.module.css";

type ListProps = {
    todos: Todo[];
    handleUpdateTodos: (todos: Todo[]) => void;
    handleDone: (index: number, checked: boolean) => void;
};

export function List({ todos, handleUpdateTodos, handleDone }: ListProps) {
    useEffect(() => {
        handleUpdateTodos(
            localStorage.getItem("todos")
                ? JSON.parse(localStorage.getItem("todos")!)
                : []
        );
    }, [handleUpdateTodos]);

    return (
        <ul className={styles.list}>
            {todos.length > 0 &&
                todos.map(({ content, isDone }: Todo, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={isDone}
                            onChange={(event) => {
                                handleDone(index, event.target.checked);
                            }}
                        />
                        {content}
                    </li>
                ))}
        </ul>
    );
}

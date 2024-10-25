"use client";

import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { List } from "./components/list";
import { Todo } from "./types/todos";
import styles from "./page.module.css";

export default function Home() {
    const [value, setValue] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);

    function handleCreate() {
        if (!value) {
            alert("Please enter a task.");
            return;
        }

        setTodos((prev) => {
            const newList = [{ content: value, isDone: false }, ...prev];
            return newList;
        });

        setValue("");
    }

    const handleDone = useCallback((index: number, checked: boolean) => {
        setTodos((prev) => {
            const newTodos = prev.map((todo, i) =>
                i === index ? { ...todo, isDone: checked } : todo
            );

            return newTodos;
        });
    }, []);

    const handleUpdateTodos = useCallback((todos: Todo[]) => {
        setTodos(todos);
    }, []);

    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos]);

    return (
        <div className={styles.page}>
            <h1>Todo</h1>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    className={styles.field}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event: KeyboardEvent) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            handleCreate();
                        }
                    }}
                />
                <button className={styles.create} onClick={handleCreate}>
                    Create
                </button>
            </div>
            <List
                todos={todos}
                handleUpdateTodos={handleUpdateTodos}
                handleDone={handleDone}
            />
        </div>
    );
}

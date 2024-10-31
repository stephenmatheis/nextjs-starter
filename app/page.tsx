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

    const handleDelete = useCallback(
        (index: number) => {
            setTodos(
                todos.filter((task, idx) => {
                    if (index !== idx) {
                        return task;
                    }
                })
            );
        },
        [todos]
    );

    const handleRename = useCallback((index: number, content: string) => {
        setTodos((prev) => {
            const newTodos = prev.map((todo, i) =>
                i === index ? { ...todo, content } : todo
            );

            return newTodos;
        });
    }, []);

    const handleReorder = useCallback((oldIndex: number, newIndex: number) => {
        setTodos((prev) => {
            const item = prev[oldIndex];
            const newTodos = prev.filter((_, index) => index !== oldIndex);

            // console.log("Item:", item);
            // console.log("New list:", [
            //     ...newTodos.slice(0, newIndex),
            //     item,
            //     ...newTodos.slice(newIndex),
            // ]);

            // return prev;

            return [
                ...newTodos.slice(0, newIndex),
                item,
                ...newTodos.slice(newIndex),
            ];
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
                handleDelete={handleDelete}
                handleRename={handleRename}
                handleReorder={handleReorder}
            />
        </div>
    );
}

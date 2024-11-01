import { useEffect } from 'react';
import { ListProps } from '@/app/types/todos';
import { List } from '../list/list';
import styles from './lists.module.scss';

type ListsProps = {
    lists: ListProps[];
    setListsFromLocalStorage: (storedLists: ListProps[]) => void;
    addTask: (listName: string, taskContent: string) => void;
    deleteTask: (listId: string, taskId: string) => void;
    renameTask: (listId: string, taskId: string, content: string) => void;
    toggleTaskCompletion: (listName: string, taskContent: string) => void;
    reorderTasks: (
        listName: string,
        fromIndex: number,
        toIndex: number,
    ) => void;
};

export function Lists({
    lists,
    setListsFromLocalStorage,
    addTask,
    deleteTask,
    renameTask,
    toggleTaskCompletion,
    reorderTasks,
}: ListsProps) {
    useEffect(() => {
        setListsFromLocalStorage(
            localStorage.getItem('lists')
                ? JSON.parse(localStorage.getItem('lists')!)
                : [],
        );
    }, [setListsFromLocalStorage]);

    return (
        <div className={styles.lists}>
            {lists.map(({ id, name, todos }, index) => {
                return (
                    <List
                        key={id}
                        listId={id}
                        index={index}
                        name={name}
                        todos={todos}
                        addTask={addTask}
                        deleteTask={deleteTask}
                        renameTask={renameTask}
                        toggleTaskCompletion={toggleTaskCompletion}
                        reorderTasks={reorderTasks}
                    />
                );
            })}
        </div>
    );
}

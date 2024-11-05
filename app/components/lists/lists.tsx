import { useEffect, useState } from 'react';
import { ListProps } from '@/app/types/todos';
import { List } from '../list/list';
import styles from './lists.module.scss';
import classNames from 'classnames';

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
    const [layout, setLayout] = useState<'Horizontal' | 'Vertical' | 'Flow'>(
        'Flow',
    );

    useEffect(() => {
        setListsFromLocalStorage(
            localStorage.getItem('lists')
                ? JSON.parse(localStorage.getItem('lists')!)
                : [],
        );
    }, [setListsFromLocalStorage]);

    return (
        <main className={styles.main}>
            <div className={styles.toolbar}>
                <button
                    className={classNames({ selected: layout === 'Flow' })}
                    onClick={() => setLayout('Flow')}
                >
                    Flow
                </button>
                <button
                    className={classNames({
                        selected: layout === 'Horizontal',
                    })}
                    onClick={() => setLayout('Horizontal')}
                >
                    Horizontal
                </button>
                <button
                    className={classNames({ selected: layout === 'Vertical' })}
                    onClick={() => setLayout('Vertical')}
                >
                    Vertical
                </button>
            </div>
            <div
                className={classNames(styles.lists, {
                    [styles.flow]: layout === 'Flow',
                    [styles.flex]:
                        layout === 'Horizontal' || layout === 'Vertical',
                    [styles.horizontal]: layout === 'Horizontal',
                    [styles.vertical]: layout === 'Vertical',
                })}
            >
                {lists.map(({ id, name, todos }, index) => {
                    return (
                        <List
                            key={id}
                            layout={layout}
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
        </main>
    );
}

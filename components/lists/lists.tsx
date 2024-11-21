'use client';

import { useEffect, useState } from 'react';
import { ListProps, LayoutOptions } from '@/types/todos';
import { List } from '@/components/list';
import styles from './lists.module.scss';
import classNames from 'classnames';

type ListsProps = {
    lists: ListProps[];
    setListsFromLocalStorage: (storedLists: ListProps[]) => void;
    addTask: (listName: string, taskContent: string) => void;
    deleteTask: (listId: string, taskId: string) => void;
    renameTask: (listId: string, taskId: string, content: string) => void;
    deleteList: (listId: string) => void;
    renameList: (listId: string, content: string) => void;
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
    deleteList,
    renameList,
    toggleTaskCompletion,
    reorderTasks,
}: ListsProps) {
    const [layout, setLayout] = useState<LayoutOptions>('');
    const [openMenuId, setOpenMenuId] = useState<string>('');

    function handleOpenMenuId(value: string) {
        setOpenMenuId(value);
    }

    function handleLayout(layout: LayoutOptions) {
        setLayout(layout);

        localStorage.setItem('layout', layout);
    }

    useEffect(() => {
        setListsFromLocalStorage(
            localStorage.getItem('lists')
                ? JSON.parse(localStorage.getItem('lists')!)
                : [],
        );
    }, [setListsFromLocalStorage]);

    useEffect(() => {
        handleLayout(
            (localStorage.getItem('layout') as LayoutOptions) || 'Flow',
        );
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.toolbar}>
                <button
                    className={classNames({ selected: layout === 'Flow' })}
                    onClick={() => handleLayout('Flow')}
                >
                    Flow
                </button>
                <button
                    className={classNames({
                        selected: layout === 'Horizontal',
                    })}
                    onClick={() => handleLayout('Horizontal')}
                >
                    Horizontal
                </button>
                <button
                    className={classNames({ selected: layout === 'Vertical' })}
                    onClick={() => handleLayout('Vertical')}
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
                            deleteList={deleteList}
                            renameList={renameList}
                            toggleTaskCompletion={toggleTaskCompletion}
                            reorderTasks={reorderTasks}
                            showMenu={id === openMenuId ? true : false}
                            onMenuOpen={handleOpenMenuId}
                        />
                    );
                })}
            </div>
        </main>
    );
}

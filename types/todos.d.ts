export type TodoProps = {
    id: string;
    content: string;
    isDone: boolean;
};

export type ListProps = {
    id: string;
    name: string;
    todos: TodoProps[];
};

export type LayoutOptions = 'Horizontal' | 'Vertical' | 'Flow' | '';

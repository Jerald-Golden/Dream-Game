export interface Option {
    id: string;
    label: string;
    description: string;
    shortcut: string;
}

export interface ActionOption extends Option {
    icon: string;
}

export interface WheelCatogories {
    name: string;
    options: Option[];
}

export interface HotBarItem {
    id: string;
    image: string;
    count: number;
    name: string;
}

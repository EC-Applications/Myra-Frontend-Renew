import type { JSX } from "react/jsx-runtime";

export interface iLabelPayLoad {
    name?: string,
    description?: string,
    label_group_id?: number,
    label_group_name?: string,
    label_group_description?: string,
    color?: string,
    created_at?: string,
    workspace_id?: number,
}

export interface iGroupPayload {
    label_group_name: string,
    label_group_description: string,
    color?: string,
}


export interface iLabel {
    map(arg0: (label: any) => JSX.Element): import("react").ReactNode;
    id: number,
    workspace_id: number,
    label_group_id?: number,
    label_group_name?: string,
    name: string,
    description: string,
    color: string,
    created_at?: string,
}


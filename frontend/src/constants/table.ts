export interface TableProps {
    name: string,
}

export interface TableColumnProps {
    primaryKey: boolean,
    name: string,
    type: string,
}

export interface TableValueProps {
    columnName: string,
    value: any
}
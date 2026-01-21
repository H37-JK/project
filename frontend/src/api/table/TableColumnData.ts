import {TableColumnProps} from "@/constants/table";

const TableColumnData = () => {
    const data: TableColumnProps[] = [
        {
            name: 'email',
            primaryKey: true,
            type: 'varchar',
        },
        {
            name: 'password',
            primaryKey: false,
            type: 'varchar',
        },
        {
            name: 'name',
            primaryKey: false,
            type: 'varchar',
        },
    ]

    return data
}

export default TableColumnData
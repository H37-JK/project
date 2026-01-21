column_schema_query = """
    SELECT
    c.column_name,
    c.data_type,
    CASE 
        WHEN c.is_nullable = 'YES' THEN TRUE 
        ELSE FALSE 
    END AS is_nullable,
    CASE 
        WHEN tc_pk.constraint_type = 'PRIMARY KEY' THEN TRUE
        ELSE FALSE
    END AS is_pk,
    CASE
        WHEN tc_fk.constraint_type = 'FOREIGN KEY' THEN ccu.table_name || '(' || ccu.column_name || ')'
        ELSE ''
    END AS fk
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu_pk ON c.table_schema = kcu_pk.table_schema
     AND c.table_name = kcu_pk.table_name
     AND c.column_name = kcu_pk.column_name
LEFT JOIN information_schema.table_constraints tc_pk
    ON kcu_pk.constraint_name = tc_pk.constraint_name
    AND tc_pk.constraint_type = 'PRIMARY KEY'
LEFT JOIN information_schema.key_column_usage kcu_fk
    ON c.table_schema = kcu_fk.table_schema
    AND c.table_name = kcu_fk.table_name
    AND c.column_name = kcu_fk.column_name
LEFT JOIN information_schema.table_constraints tc_fk
    ON kcu_fk.constraint_name = tc_fk.constraint_name
    AND tc_fk.constraint_type = 'FOREIGN KEY'
LEFT JOIN information_schema.constraint_column_usage ccu
    ON tc_fk.constraint_name = ccu.constraint_name
    AND tc_fk.table_schema = ccu.table_schema
WHERE
    c.table_schema   = :table_schema
    AND c.table_name = :table_name
ORDER BY
    c.ordinal_position;
"""
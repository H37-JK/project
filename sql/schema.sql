SELECT * FROM INFORMATION_SCHEMA.TABLES;

SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = 'public'
AND table_name = 'user';


SELECT
    ps.relname AS 테이블명,
    pa.attname AS 컬럼명,
    pd.description AS 컬럼설명,
    format_type(pa.atttypid, pa.atttypmod) AS 데이터타입,
    CASE WHEN pa.attnotnull THEN 'NO' ELSE 'YES' END AS NULL허용
FROM pg_attribute pa
INNER JOIN pg_class ps ON pa.attrelid = ps.oid
INNER JOIN pg_namespace pn ON ps.relnamespace = pn.oid
LEFT JOIN pg_description pd ON ps.oid = pd.objoid AND pa.attnum = pd.objsubid
WHERE
    pn.nspname = 'public'
    AND ps.relname = 'user'
    AND pa.attnum > 0
    AND NOT pa.attisdropped
ORDER BY
    pa.attnum;

    SELECT
    c.column_name AS 컬럼명,
    c.data_type AS 데이터타입,
    c.is_nullable AS NULL허용,
    CASE
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'YES'
        ELSE 'NO'
    END AS PK여부
FROM
    information_schema.columns c
LEFT JOIN
    information_schema.key_column_usage kcu
    ON c.table_schema = kcu.table_schema
    AND c.table_name = kcu.table_name
    AND c.column_name = kcu.column_name
LEFT JOIN
    information_schema.table_constraints tc
    ON kcu.table_schema = tc.table_schema
    AND kcu.table_name = tc.table_name
    AND kcu.constraint_name = tc.constraint_name
    AND tc.constraint_type = 'PRIMARY KEY'
WHERE
    c.table_schema = 'public'
    AND c.table_name = 'user' -- 조회할 테이블명
ORDER BY
    c.ordinal_position;

    SELECT
    c.column_name AS 컬럼명,
    c.data_type AS 데이터타입,
    c.is_nullable AS NULL허용,
    CASE
        WHEN tc_pk.constraint_type = 'PRIMARY KEY' THEN 'YES'
        ELSE ''
    END AS PK,
    CASE
        WHEN tc_fk.constraint_type = 'FOREIGN KEY' THEN ccu.table_name || '(' || ccu.column_name || ')'
        ELSE ''
    END AS FK_참조정보
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu_pk
    ON c.table_schema = kcu_pk.table_schema
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
    c.table_schema = 'public'
    AND c.table_name = 'user'
ORDER BY
    c.ordinal_position;
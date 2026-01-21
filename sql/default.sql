-- 전체 데이터베이스 조회
\l

-- 전체 테이블 조회
\dt

DROP TABLE users;

-- 유저 테이블 생성
CREATE TABLE users (
    id         SERIAL       PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.user (email, password)
VALUES ('these990703@gmail.com', 'star8903');

SELECT *
FROM users;

SELECT now();

ALTER SYSTEM SET timezone = 'Asia/Seoul';

SELECT pg_reload_conf();

SHOW timezone;

SELECT * FROM INFORMATION_SCHEMA.TABLES
1. 숫자 타입 (Numeric Types)

* INTEGER 또는 INT: 일반적인 정수 (예: 1, 100, -50)
* BIGINT: 매우 큰 정수
* SMALLINT: 작은 범위의 정수
* NUMERIC(정밀도, 스케일) 또는 DECIMAL: 정확한 소수 (금융 계산처럼 정밀도가 매우 중요할 때 사용)
* REAL: 4바이트 부동 소수점 (근사치)
* DOUBLE PRECISION: 8바이트 부동 소수점 (근사치, REAL보다 정밀함)
* SERIAL, BIGSERIAL: INTEGER나 BIGINT와 같지만, 새로운 행이 추가될 때마다 자동으로 1씩 증가하는 값을 가집니다. (주로 id 컬럼에 사용)

2. 문자열 타입 (Character Types)

* VARCHAR(n) 또는 CHARACTER VARYING(n): 최대 n 글자까지 저장할 수 있는 가변 길이 문자열 (가장 흔하게 사용)
* CHAR(n) 또는 CHARACTER(n): n 글자로 길이가 고정된 문자열. n보다 적은 글자를 넣으면 공백으로 채워집니다.
* TEXT: 길이에 제한이 없는 매우 긴 문자열

3. 날짜/시간 타입 (Date/Time Types)

* DATE: 날짜만 저장 (예: '2024-08-15')
* TIME: 시간만 저장 (예: '17:30:55')
* TIMESTAMP 또는 TIMESTAMP WITHOUT TIME ZONE: 날짜와 시간을 함께 저장
* TIMESTAMP WITH TIME ZONE (TIMESTAMPTZ): 타임존 정보까지 포함하여 날짜와 시간을 저장 (국제적인 서비스에 권장)
* INTERVAL: 두 날짜/시간 사이의 간격을 저장 (예: '2일', '3개월 5시간')

4. 논리 타입 (Boolean Type)

* BOOLEAN: TRUE(참), FALSE(거짓), 또는 NULL(알 수 없음) 값을 저장

5. 구조화된 타입 (Structured Types)

* JSON, JSONB: JSON 데이터를 저장 (위에서 설명)
* ARRAY: 특정 데이터 타입의 배열을 저장 (예: INTEGER[], TEXT[])
* XML: XML 데이터를 저장

6. 특수 타입

* UUID: 전역적으로 고유한 128비트 식별자를 저장 (중복될 확률이 거의 없는 ID가 필요할 때 사용)
* BYTEA: 바이너리 데이터(이미지, 실행 파일 등)를 직접 저장할 때 사용

이 외에도 기하학 타입, 네트워크 주소 타입 등 더 많은 타입들이 있지만, 여기에 정리된 것들이 개발할 때 99% 이상 마주치게 될 타입들입니다.
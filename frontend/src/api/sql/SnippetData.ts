import {SnippetProps} from "@/constants/sql";

const SnippetData = () => {
    const data: SnippetProps[] = [
        {
            name: '테이블 생성'
        },
        {
            name: '셀렉트 쿼리'
        },
        {
            name: '회원 정보'
        },
        {
            name: '아이템 정보'
        },
    ]
    return data
}

export default SnippetData
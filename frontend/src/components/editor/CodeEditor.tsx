import {useState} from "react";
import {Editor, OnChange} from "@monaco-editor/react";

const CodeEditor = () => {
    const [code, setCode] = useState<string>('여기에 코드를 작성 하세요')
    const [loading, setLoading] = useState(false)

    const handleEditorChange: OnChange = (value, event) => {
        setCode(value || '')
    }

    return (
        <Editor
            height="100%"
            language="sql"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            loading={loading}
            options={{
                fontSize: 14,
                minimap: {enabled: false},
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    )
}

export default CodeEditor
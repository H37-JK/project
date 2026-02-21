import React from 'react';
import CodeMirror, {highlightActiveLine, highlightActiveLineGutter} from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { html } from '@codemirror/lang-html';

// @ts-ignore
const JsonEditor = ({value, readOnly = false}) => {
    const extensions = [
        json(),
        lintGutter(),
        linter(jsonParseLinter()),
        EditorView.lineWrapping,
        highlightActiveLine(),
        highlightActiveLineGutter(),
    ];

    return (
        <CodeMirror
            className="flex flex-col flex-1 overflow-auto bg-zinc-900"
            value={value}
            extensions={extensions}
            readOnly={readOnly}
            theme={oneDark}
            height="100%"
            editable={false}
            basicSetup={{
                foldGutter: false,   // 코드를 접는 화살표 영역(Gutter)을 제거
                lineNumbers: true,   // 줄 번호는 유지
            }}
        />
    );
}

export default JsonEditor
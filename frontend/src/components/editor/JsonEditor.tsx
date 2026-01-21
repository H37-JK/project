import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from "@codemirror/lint";

// @ts-ignore
const JsonEditor = ({value, readOnly = false}) => {
    const extensions = [
        json(),
        lintGutter(),
        linter(jsonParseLinter())
    ];

    return (
        <CodeMirror
            className="flex flex-col flex-1 overflow-auto bg-zinc-900"
            value={value}
            extensions={extensions}
            readOnly={readOnly}
            theme="dark"
            height="100%"
        />
    );
}

export default JsonEditor
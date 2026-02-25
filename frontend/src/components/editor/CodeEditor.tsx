import {Editor, OnChange} from "@monaco-editor/react";
import {ApiRequestUpdate} from "@/constants/api";

interface CodeEditorProps {
    body_content: string
    updateField:(key: keyof ApiRequestUpdate, value: any) => void
}

const CodeEditor = ({body_content, updateField} :CodeEditorProps) => {


    const updateJson = (value: string) => {
        updateField("body_content", value);
    }
    return (
       <div className="flex flex-col flex-1">
           <Editor
               beforeMount={(monaco) => {
                   monaco.editor.defineTheme('my-custom-theme', {
                       base: 'vs-dark',
                       inherit: true,
                       rules: [
                       ],
                       colors: {
                           'editor.background': '#171717',
                       }
                   });
               }}
               theme="my-custom-theme"
               language="json"
               value={body_content}
               onChange={(value) => updateJson(value!)}
               options={{
                   fontSize: 14,
                   minimap: {enabled: false},
                   scrollbar: {
                       vertical: 'auto',
                       horizontal: 'auto'
                   },
                   lineNumbersMinChars: 3,
                   folding: false,
                   lineDecorationsWidth: 12,
                   renderLineHighlight: 'none',
                   cursorStyle: 'line',
                   cursorBlinking: 'blink',
                   wordWrap: 'on',
                   scrollBeyondLastLine: false,
                   automaticLayout: true,
               }}
           />
       </div>
    )
}

export default CodeEditor
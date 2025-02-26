'use client';
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor (this is necessary because Monaco has issues with SSR)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const CodeEditor = () => {
  // useState to hold the code written by the user
  const [code, setCode] = useState('');

  const handleEditorChange = (value, event) => {
    // Update the state with the new code value
    setCode(value);
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <MonacoEditor
        height="400px"
        language="javascript" // You can set the language dynamically or use a language from the code submission
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange} // Handle changes in the editor
      />
      
      <button onClick={() => handleSubmit(code)}>Submit Code</button>
    </div>
  );
};

// Placeholder function to handle code submission (could send the code to a backend API)
const handleSubmit = (code) => {
  console.log("Code submitted:", code);
  // You can use fetch or axios to call your API that executes the code
};

export default CodeEditor;

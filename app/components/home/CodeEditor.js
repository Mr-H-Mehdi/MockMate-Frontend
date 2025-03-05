"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

const CodingEnvironment = ({ 
  initialCode = "// Write your solution here\n", 
  language = "javascript",
  question,
  onSubmit
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [theme, setTheme] = useState("vs-dark"); // Default to dark theme
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  useEffect(() => {
    // Update code when initialCode prop changes
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    // Update language when language prop changes
    setCurrentLanguage(language);
  }, [language]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    setCurrentLanguage(e.target.value);
  };

  const executeJavaScript = (code) => {
    try {
      // Create a safe execution environment
      const consoleOutput = [];
      const originalConsoleLog = console.log;
      
      // Override console.log
      console.log = (...args) => {
        consoleOutput.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsoleLog(...args);
      };
      
      // Function wrapper to evaluate code safely
      const evaluateCode = new Function(`
        "use strict";
        try {
          ${code}
          
          // Test the code with some sample inputs
          if (typeof reverseString === 'function') {
            console.log("Testing reverseString('hello'):");
            console.log(reverseString('hello'));
          } else if (typeof maxSubarraySum === 'function') {
            console.log("Testing maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]):");
            console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
          } else if (typeof MyQueue === 'function') {
            console.log("Testing Queue implementation:");
            const queue = new MyQueue();
            queue.enqueue(1);
            queue.enqueue(2);
            console.log("Peek:", queue.peek());
            console.log("Dequeue:", queue.dequeue());
            console.log("isEmpty:", queue.isEmpty());
          }
          
          return { success: true, output: "Execution successful" };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `);
      
      // Execute the code
      const result = evaluateCode();
      
      // Restore original console.log
      console.log = originalConsoleLog;
      
      if (result.success) {
        return consoleOutput.length > 0 
          ? "Console Output:\n> " + consoleOutput.join("\n> ")
          : "Code executed successfully (no output)";
      } else {
        return `Error: ${result.error}`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const executePython = () => {
    return "Python execution is simulated:\n> Output would appear here if connected to a Python interpreter backend.";
  };

  const executeJava = () => {
    return "Java execution is simulated:\n> Output would appear here if connected to a Java compiler backend.";
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Simulate a short delay for execution
    setTimeout(() => {
      try {
        let result;
        
        // Execute code based on the selected language
        switch (currentLanguage) {
          case "javascript":
            result = executeJavaScript(code);
            break;
          case "python":
            result = executePython();
            break;
          case "java":
            result = executeJava();
            break;
          default:
            result = "Language not supported for execution.";
        }
        
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
      setIsRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your code? All changes will be lost.")) {
      setCode(initialCode);
      setOutput("");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    
    // Update editor font size if editor is mounted
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  // Define options for Monaco Editor
  const editorOptions = {
    fontSize: fontSize,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    suggestOnTriggerCharacters: true,
    formatOnPaste: true,
    formatOnType: true,
    lineNumbers: "on",
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      verticalHasArrows: false,
      horizontalHasArrows: false,
    }
  };

  // Map our language values to Monaco's language identifiers
  const getMonacoLanguage = (lang) => {
    const langMap = {
      javascript: "javascript",
      python: "python",
      java: "java",
    };
    return langMap[lang] || "javascript";
  };

  const isDarkTheme = theme === "vs-dark";
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Question Panel */}
      <div className={`p-4 ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"} border-b`}>
        <h2 className="text-xl font-bold mb-2">Problem Statement</h2>
        <div className="prose max-w-none">
          {question || "Write a function that reverses a string without using the built-in reverse method."}
        </div>
      </div>
      
      {/* Editor and Output Container */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r">
          <div className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center space-x-2">
              <select 
                className={`px-2 py-1 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                value={currentLanguage}
                onChange={handleLanguageChange}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
              >
                {isDarkTheme ? "☀️" : "🌙"}
              </button>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => changeFontSize(-1)}
                  className={`px-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  -
                </button>
                <span className={isDarkTheme ? "text-white" : "text-gray-800"}>
                  {fontSize}px
                </span>
                <button
                  onClick={() => changeFontSize(1)}
                  className={`px-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex-grow">
            <MonacoEditor
              height="100%"
              language={getMonacoLanguage(currentLanguage)}
              value={code}
              theme={theme}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={editorOptions}
            />
          </div>
        </div>
        
        {/* Output Console */}
        <div className={`flex-1 flex flex-col ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
          <div className="border-b p-2 font-medium">Output</div>
          <pre className={`flex-grow p-4 font-mono overflow-auto ${
            isDarkTheme ? "bg-gray-900 text-green-400" : "bg-gray-100 text-gray-800"
          }`}>
            {output || "Run your code to see output here..."}
          </pre>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className={`p-4 border-t flex justify-between items-center ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
      }`}>
        <div>
          <span className="text-sm">
            {isRunning ? "Running..." : "Ready"}
          </span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg ${
              isRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingEnvironment;
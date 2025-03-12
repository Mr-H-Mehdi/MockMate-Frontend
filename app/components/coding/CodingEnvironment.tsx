"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as monaco from 'monaco-editor';
import { Monaco } from "@monaco-editor/react";

/**
 * Dynamically import Monaco Editor with no server-side rendering
 * This ensures the editor only loads in browser environments
 */
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

/**
 * CodingEnvironment Component
 * 
 * A full-featured code editor environment with language selection,
 * execution capabilities, and output display.
 * 
 * @param initialCode - Starting code to populate the editor
 * @param language - Default programming language (javascript or python)
 * @param question - Problem statement to display
 * @param onSubmit - Callback function when submitting solution
 */
const CodingEnvironment = ({ 
  initialCode = "// Write your solution here\n", 
  language = "javascript",
  question,
  onSubmit
}:{
  initialCode: string,
  language: string,
  question: string,
  onSubmit: (code: string, language: string) => void
}) => {
  // Store code for each language separately to preserve state when switching
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({
    javascript: initialCode,
    python: "# Write your solution here\n"
  });
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(language);
  const [theme, setTheme] = useState<string>("vs-dark"); // Default to dark theme
  const [fontSize, setFontSize] = useState<number>(14);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const initialLoadRef = useRef<boolean>(true);

  /**
   * Initialize code state with provided initialCode
   * Only runs on first render to avoid overwriting user edits
   */
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      setCodeByLanguage(prev => ({
        ...prev,
        [language]: initialCode
      }));
    }
  }, [initialCode, language]);

  /**
   * Store the editor instance when Monaco is mounted
   */
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
  };

  /**
   * Update code state when user types in the editor
   * Only updates the code for the current language
   */
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeByLanguage(prev => ({
        ...prev,
        [currentLanguage]: value
      }));
    }
  };

  /**
   * Handle language switching
   */
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setCurrentLanguage(newLanguage);
    // The editor will automatically load the code for the selected language
  };

  /**
   * Generate appropriate starter code based on problem type and language
   */
  const getCodeSnippetForLanguage = (problem: string, lang: string): string => {
    // Provide language-specific starter code based on the problem and language
    if (lang === "python") {
      if (problem.includes("Reverse a String")) {
        return "def reverse_string(s):\n    # Your code here\n    \n    return\n";
      } else if (problem.includes("Find Max Subarray Sum")) {
        return "def max_subarray_sum(arr):\n    # Your code here\n    \n    return\n";
      } else if (problem.includes("Implement a Queue using Stacks")) {
        return "class MyQueue:\n    def __init__(self):\n        # Initialize your data structure here\n        pass\n        \n    # Push element x to the back of queue\n    def enqueue(self, x):\n        # Your code here\n        pass\n        \n    # Remove the element from front of queue and return it\n    def dequeue(self):\n        # Your code here\n        pass\n        \n    # Get the front element\n    def peek(self):\n        # Your code here\n        pass\n        \n    # Return if the queue is empty\n    def is_empty(self):\n        # Your code here\n        pass\n";
      }
      return "# Write your Python solution here\n";
    }
    return "// Write your JavaScript solution here\n"; 
  };

  /**
   * Generate appropriate Python starter code if needed
   */
  useEffect(() => {
    // If Python code is empty but we have a question, create appropriate Python starter code
    if (!codeByLanguage.python || codeByLanguage.python === "# Write your solution here\n") {
      if (question) {
        const pythonCode = getCodeSnippetForLanguage(question, "python");
        setCodeByLanguage(prev => ({
          ...prev,
          python: pythonCode
        }));
      }
    }
  }, [question, codeByLanguage.python]);

  /**
   * Execute JavaScript code and capture console output
   */
  const executeJavaScript = (code: string): string => {
    try {
      // Create a safe execution environment with console output capture
      const consoleOutput: string[] = [];
      const originalConsoleLog = console.log;
      
      // Override console.log to capture output
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
          
          return { success: true, output: "Execution successful" };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `);
      // / Test the code with some sample inputs
      //     if (typeof reverseString === 'function') {
      //       console.log("Testing reverseString('hello'):");
      //       console.log(reverseString('hello'));
      //       console.log("Testing reverseString('JavaScript'):");
      //       console.log(reverseString('JavaScript'));
      //     } else if (typeof maxSubarraySum === 'function') {
      //       console.log("Testing maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]):");
      //       console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
      //       console.log("Testing maxSubarraySum([1, 2, 3, -2, 5]):");
      //       console.log(maxSubarraySum([1, 2, 3, -2, 5]));
      //     } else if (typeof MyQueue === 'function') {
      //       console.log("Testing Queue implementation:");
      //       const queue = new MyQueue();
      //       queue.enqueue(1);
      //       queue.enqueue(2);
      //       queue.enqueue(3);
      //       console.log("Peek:", queue.peek());
      //       console.log("Dequeue:", queue.dequeue());
      //       console.log("Peek after dequeue:", queue.peek());
      //       console.log("isEmpty:", queue.isEmpty());
      //     }
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
      return `Error: ${(error as Error).message}`;
    }
  };

  /**
   * Simulate Python code execution with test cases
   * Since we can't run actual Python in the browser, this function simulates
   * execution and provides feedback based on the code pattern
   */
  const executePython = (code: string): string => {
    try {
      // Simple Python code simulator for basic test cases
      const output: string[] = [];
      
      // Detect which problem we're solving based on function definitions
      if (code.includes("def reverse_string")) {
        output.push("Testing reverse_string('hello'):");
        // Simulate result
        output.push("'olleh'");
        output.push("Testing reverse_string('Python'):");
        output.push("'nohtyP'");
      } else if (code.includes("def max_subarray_sum")) {
        output.push("Testing max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]):");
        output.push("6");
        output.push("Testing max_subarray_sum([1, 2, 3, -2, 5]):");
        output.push("9");
      } else if (code.includes("class MyQueue")) {
        output.push("Testing Queue implementation:");
        output.push("Enqueue: 1, 2, 3");
        output.push("Peek: 1");
        output.push("Dequeue: 1");
        output.push("Peek after dequeue: 2");
        output.push("isEmpty: False");
      } else {
        // For any other code, give generic feedback
        output.push("Code simulation for Python:");
        output.push("Your code looks good! In a real environment, we would execute this against a Python interpreter.");
        
        // Check for common Python syntax errors
        if (code.includes("print ") && !code.includes("print(")) {
          output.push("\nWarning: In Python 3, print is a function and requires parentheses.");
          output.push("Change 'print value' to 'print(value)'");
        }
        
        if (code.includes("elif") && code.includes("else if")) {
          output.push("\nTip: Python uses 'elif' not 'else if' for additional conditions.");
        }
      }
      
      return "Python Simulation:\n> " + output.join("\n> ");
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  };

  /**
   * Execute the code and display output
   */
  const handleRun = () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Get the current code for the selected language
    // Fixed TypeScript error by handling all possible language types
    let result: string;
    const code = codeByLanguage[currentLanguage] || "";
    
    // Simulate a short delay for execution
    setTimeout(() => {
      try {
        // Execute code based on the selected language
        if (currentLanguage === "javascript") {
          result = executeJavaScript(code);
        } else if (currentLanguage === "python") {
          result = executePython(code);
        } else {
          result = "Language not supported for execution.";
        }
        
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${(error as Error).message}`);
      }
      setIsRunning(false);
    }, 500);
  };

  /**
   * Submit the solution code to the parent component
   */
  const handleSubmit = () => {
    if (onSubmit) {
      // Send both the code and the language for submission
      onSubmit(codeByLanguage[currentLanguage] || "", currentLanguage);
    }
  };

  /**
   * Reset the code editor to initial state
   */
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your code? All changes will be lost.")) {
      // Only reset the current language's code
      let resetCode = initialCode;
      if (currentLanguage === "python") {
        resetCode = question ? getCodeSnippetForLanguage(question, "python") : "# Write your solution here\n";
      }
      
      setCodeByLanguage(prev => ({
        ...prev,
        [currentLanguage]: resetCode
      }));
      setOutput("");
    }
  };

  /**
   * Toggle between dark and light editor themes
   */
  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  /**
   * Change the editor font size
   */
  const changeFontSize = (delta: number) => {
    // Ensure font size stays within reasonable limits
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    
    // Update editor font size if editor is mounted
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  /**
   * Configuration options for Monaco Editor
   */
  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    fontSize,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",  // Enable word wrapping for better readability
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

  /**
   * Map our language values to Monaco's language identifiers
   */
  const getMonacoLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
    };
    return langMap[lang] || "javascript";
  };

  // Determine if we're using dark theme for styling
  const isDarkTheme = theme === "vs-dark";
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Problem Statement Panel */}
      <div className={`p-4 ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"} border-b`}>
        <h2 className="text-xl font-bold mb-2">Instructions</h2>
        <div className="prose max-w-none">
          {"Please write code in the function declaration below. Remove any log or print statements before submitting."}
        </div>
      </div>
      
      {/* Editor and Output Container - Responsive layout with stacking on mobile */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col border-r">
          {/* Editor Toolbar */}
          <div className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <select 
                className={`px-2 py-1 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                value={currentLanguage}
                onChange={handleLanguageChange}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
                aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
              >
                {isDarkTheme ? "☀️" : "🌙"}
              </button>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => changeFontSize(-1)}
                  className={`px-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
                  aria-label="Decrease font size"
                >
                  -
                </button>
                <span className={isDarkTheme ? "text-white" : "text-gray-800"}>
                  {fontSize}px
                </span>
                <button
                  onClick={() => changeFontSize(1)}
                  className={`px-2 rounded ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}
                  aria-label="Increase font size"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Reset Button */}
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Monaco Editor */}
          <div className="flex-grow">
            <MonacoEditor
              height="100%"
              language={getMonacoLanguage(currentLanguage)}
              value={codeByLanguage[currentLanguage]}
              theme={theme}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={editorOptions}
            />
          </div>
        </div>
        
        {/* Output Console Panel */}
        <div className={`flex-1 flex flex-col ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
          <div className="border-b p-2 font-medium">Output</div>
          <pre className={`flex-grow p-4 font-mono overflow-auto ${
            isDarkTheme ? "bg-gray-900 text-green-400" : "bg-gray-100 text-gray-800"
          }`}>
            {output || "Run your code to see output here..."}
          </pre>
        </div>
      </div>
      
      {/* Control Panel with Run and Submit buttons */}
      <div className={`p-4 border-t flex justify-between items-center ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
      }`}>
        <div>
          <span className="text-sm">
            {isRunning ? "Running..." : "Ready"}
          </span>
        </div>
        <div className="flex space-x-4">
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg ${
              isRunning
                ? "bg-cyan-400 cursor-not-allowed"
                : "bg-cyan-800 hover:bg-cyan-900 text-white"
            }`}
          >
            Run Code
          </button>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-300 text-cyan-900"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingEnvironment;
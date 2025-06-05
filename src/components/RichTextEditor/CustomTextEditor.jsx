'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaStrikethrough,
    FaHeading,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaCode,
    FaLink,
    FaImage,
    FaFont,
    FaPaintBrush,
    FaHighlighter,
    FaTag,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaUndo,
    FaRedo,
    FaSubscript,
    FaSuperscript,
    FaSun, // For light mode toggle
    FaMoon // For dark mode toggle
} from 'react-icons/fa';

// --- Image URL Input Modal Component ---
// This component provides a custom modal for users to input an image URL,
// replacing the native browser prompt for a better user experience and styling.
const ImageUrlModal = ({ onInsert, onCancel }) => {
    const [url, setUrl] = useState('');

    // Handles the "Insert" button click
    const handleInsert = () => {
        if (url.trim()) {
            onInsert(url.trim()); // Call the parent's onInsert with the trimmed URL
        } else {
            // In a real application, you'd show a more user-friendly error message
            // (e.g., a small text below the input) instead of a disruptive alert.
            console.error('Please enter a valid image URL.');
            // For this Canvas environment, we'll just log the error.
        }
    };

    return (
        <div className="fixed  inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-sm mx-auto space-y-4 transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insert Image URL</h3>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g., https://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleInsert}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Enhanced Rich Text Editor Component ---
const EnhancedRichTextEditor = () => {
    // State to hold the HTML content of the editor, primarily for output preview
    const [htmlContent, setHtmlContent] = useState('');
    // Ref to directly access the contentEditable div element
    const editorRef = useRef(null);
    // State for the overall font size of the editor's content
    const [fontSize, setFontSize] = useState('16px');
    // States for selected text and background colors
    const [textColor, setTextColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    // History management for Undo/Redo functionality
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // Ref to store the current selection range before DOM manipulations,
    // crucial for restoring cursor position.
    const savedRange = useRef(null);

    // State for controlling the visibility of the Heading dropdown
    const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
    // State for controlling the visibility of the Image URL input modal
    const [showImageUrlModal, setShowImageUrlModal] = useState(false);
    // State for managing the current theme ('light' or 'dark')
    const [theme, setTheme] = useState('light');

    // Callback to toggle between light and dark themes
    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    // Callback to save the current selection range
    const saveSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedRange.current = selection.getRangeAt(0);
        } else {
            savedRange.current = null;
        }
    }, []);

    // Callback to restore the saved selection range
    const restoreSelection = useCallback(() => {
        if (savedRange.current && editorRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges(); // Clear existing ranges
            selection.addRange(savedRange.current); // Add the saved range
        }
    }, []);

    // Callback to save the current editor HTML content to history
    const saveToHistory = useCallback(() => {
        if (!editorRef.current) return;

        const currentHtml = editorRef.current.innerHTML;
        // Only save if the content has actually changed from the last history entry
        if (history[historyIndex] !== currentHtml) {
            const newHistory = [...history.slice(0, historyIndex + 1), currentHtml];
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
        setHtmlContent(currentHtml); // Update the output preview state
    }, [history, historyIndex]);

    // Callback for Undo functionality
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[newIndex]; // Revert editor content
                setHtmlContent(history[newIndex]); // Update output preview state
                restoreSelection(); // Try to restore selection after undo
            }
        }
    }, [history, historyIndex, restoreSelection]);

    // Callback for Redo functionality
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[newIndex]; // Reapply editor content
                setHtmlContent(history[newIndex]); // Update output preview state
                restoreSelection(); // Try to restore selection after redo
            }
        }
    }, [history, historyIndex, restoreSelection]);

    // Initialize editor with an empty paragraph if it's empty on mount, and save to history
    useEffect(() => {
        if (editorRef.current && !editorRef.current.innerHTML.trim()) {
            editorRef.current.innerHTML = '<p><br></p>'; // Set initial empty paragraph
            setHtmlContent('<p><br></p>'); // Set initial content for preview
            setHistory(['<p><br></p>']); // Initialize history
            setHistoryIndex(0); // Set initial history index
        }
    }, []); // Runs only once on component mount

    // Generic callback function to apply formatting using document.execCommand
    const applyFormat = useCallback((command, value = null) => {
        if (editorRef.current) {
            saveSelection(); // Save selection before applying command
            editorRef.current.focus(); // Ensure editor is focused
            document.execCommand(command, false, value); // Execute browser command
            restoreSelection(); // Restore selection after command
            saveToHistory(); // Save state after applying format
        }
    }, [saveSelection, restoreSelection, saveToHistory]);

    // Callback to insert heading (H1-H6)
    const insertHeading = useCallback((level) => {
        if (editorRef.current) {
            saveSelection(); // Save selection
            editorRef.current.focus(); // Focus editor
            document.execCommand('formatBlock', false, `h${level}`); // Apply heading format
            restoreSelection(); // Restore selection
            saveToHistory(); // Save state
            setShowHeadingDropdown(false); // Close dropdown after selection
        }
    }, [saveSelection, restoreSelection, saveToHistory]);

    // Callback to insert image via URL (called by ImageUrlModal)
    const insertImageLogic = useCallback((url) => {
        if (url) {
            // HTML structure for the image, ensuring it's block-level and responsive
            const imgHtml = `<div><img src="${url}" alt="User uploaded image" style="max-width:100%; height:auto; display:block; margin:0 auto;"/></div><p><br></p>`;
            if (editorRef.current) {
                saveSelection(); // Save selection
                editorRef.current.focus(); // Focus editor
                document.execCommand('insertHTML', false, imgHtml); // Insert HTML
                restoreSelection(); // Restore selection
                saveToHistory(); // Save state
            }
        }
    }, [saveSelection, restoreSelection, saveToHistory]);

    // Callback to insert link
    const insertLink = useCallback(() => {
        // Using native prompt for link URL for simplicity; could be a custom modal too.
        const url = prompt('Enter URL:');
        if (url) {
            applyFormat('createLink', url); // Apply link format
        }
    }, [applyFormat]);

    // Callback to insert a custom HTML tag around selected text or at cursor
    const insertHTMLTag = useCallback(() => {
        const tag = prompt('Enter HTML tag (e.g., p, div, span, strong, em):');
        if (tag) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();

                saveSelection(); // Save selection before manual DOM manipulation

                if (selectedText) {
                    // If text is selected, wrap it with the new tag
                    const newElement = document.createElement(tag);
                    newElement.textContent = selectedText;
                    range.deleteContents(); // Remove selected text
                    range.insertNode(newElement); // Insert new element
                } else {
                    // If no text is selected, insert an empty tag with a <br>
                    // to allow cursor placement within the new block.
                    const newElement = document.createElement(tag);
                    newElement.innerHTML = '<br>';
                    range.insertNode(newElement);
                }
                restoreSelection(); // Restore selection after manipulation
                saveToHistory(); // Save state
            }
        }
    }, [saveSelection, restoreSelection, saveToHistory]);

    // Callback for editor input event (triggers saveToHistory)
    const handleInput = useCallback(() => {
        saveToHistory();
    }, [saveToHistory]);

    // Callback for paste event to clean up pasted content (plain text only)
    const handlePaste = useCallback((e) => {
        e.preventDefault(); // Prevent default paste behavior (which can bring unwanted styles)
        const text = e.clipboardData.getData('text/plain'); // Get plain text from clipboard

        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                saveSelection(); // Save selection before manipulation
                range.deleteContents(); // Delete any selected content
                range.insertNode(document.createTextNode(text)); // Insert plain text
                restoreSelection(); // Restore selection
                saveToHistory(); // Save state
            }
        }
    }, [saveSelection, restoreSelection, saveToHistory]);

    // Callback to handle changes to the overall editor font size dropdown
    const handleFontSizeChange = useCallback((e) => {
        const newSize = e.target.value;
        setFontSize(newSize);
        if (editorRef.current) {
            editorRef.current.style.fontSize = newSize; // Apply font size to the editor div
            saveToHistory(); // Save state
        }
    }, [saveToHistory]);

    // Callback to handle text color changes
    const handleTextColorChange = useCallback((e) => {
        const newColor = e.target.value;
        setTextColor(newColor);
        applyFormat('foreColor', newColor); // Apply text color
    }, [applyFormat]);

    // Callback to handle background color changes
    const handleBackgroundColorChange = useCallback((e) => {
        const newColor = e.target.value;
        setBackgroundColor(newColor);
        applyFormat('hiliteColor', newColor); // Apply background color ('hiliteColor' is the command)
    }, [applyFormat]);

    return (
        // Main container div with theme-based background and text colors
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
            <div className="container mx-auto p-4 space-y-4">
                {/* Header with Editor Title and Theme Toggle */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Enhanced Rich Text Editor</h2>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 sticky top-0 z-10">
                    {/* History Controls */}
                    <button
                        type='button'
                        onClick={undo}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Undo"
                        disabled={historyIndex <= 0}
                    >
                        <FaUndo className="h-5 w-5" />
                    </button>
                    <button
                        type='button'
                        onClick={redo}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Redo"
                        disabled={historyIndex >= history.length - 1}
                    >
                        <FaRedo className="h-5 w-5" />
                    </button>

                    {/* Separator */}
                    <div className="border-r border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

                    {/* Text Formatting Buttons */}
                    <button type='button' onClick={() => applyFormat('bold')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Bold">
                        <FaBold className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('italic')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Italic">
                        <FaItalic className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('underline')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Underline">
                        <FaUnderline className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('strikeThrough')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Strikethrough">
                        <FaStrikethrough className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('subscript')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Subscript">
                        <FaSubscript className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('superscript')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Superscript">
                        <FaSuperscript className="h-5 w-5" />
                    </button>

                    {/* Headings Dropdown */}
                    <div className="relative">
                        <button
                            type='button'
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                            title="Headings"
                            onClick={() => setShowHeadingDropdown(prev => !prev)} // Toggle dropdown visibility
                        >
                            <FaHeading className="h-5 w-5" />
                        </button>
                        {showHeadingDropdown && (
                            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-600">
                                {[1, 2, 3, 4, 5, 6].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => insertHeading(level)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Heading {level}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Separator */}
                    <div className="border-r border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

                    {/* Lists and Blocks Buttons */}
                    <button type='button' onClick={() => applyFormat('insertUnorderedList')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Bullet List">
                        <FaListUl className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('insertOrderedList')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Numbered List">
                        <FaListOl className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('formatBlock', 'blockquote')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Blockquote">
                        <FaQuoteLeft className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('formatBlock', 'pre')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Code Block">
                        <FaCode className="h-5 w-5" />
                    </button>

                    {/* Separator */}
                    <div className="border-r border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

                    {/* Insert Elements Buttons */}
                    <button type='button' onClick={insertLink} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Insert Link">
                        <FaLink className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => setShowImageUrlModal(true)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Insert Image">
                        <FaImage className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={insertHTMLTag} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Insert Custom HTML Tag">
                        <FaTag className="h-5 w-5" />
                    </button>

                    {/* Separator */}
                    <div className="border-r border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

                    {/* Alignment Buttons */}
                    <button type='button' onClick={() => applyFormat('justifyLeft')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Align Left">
                        <FaAlignLeft className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('justifyCenter')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Align Center">
                        <FaAlignCenter className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('justifyRight')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Align Right">
                        <FaAlignRight className="h-5 w-5" />
                    </button>
                    <button type='button' onClick={() => applyFormat('justifyFull')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" title="Justify">
                        <FaAlignJustify className="h-5 w-5" />
                    </button>

                    {/* Separator */}
                    <div className="border-r border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

                    {/* Color Pickers */}
                    <div className="flex items-center gap-1">
                        <label htmlFor="textColorPicker" className="sr-only">Text Color</label>
                        <input
                            type="color"
                            id="textColorPicker"
                            value={textColor}
                            onChange={handleTextColorChange}
                            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"
                            title="Text Color"
                        />
                        <FaFont className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div className="flex items-center gap-1">
                        <label htmlFor="bgColorPicker" className="sr-only">Background Color</label>
                        <input
                            type="color"
                            id="bgColorPicker"
                            value={backgroundColor}
                            onChange={handleBackgroundColorChange}
                            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"
                            title="Background Color"
                        />
                        <FaHighlighter className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                    </div>

                    {/* Font Size Dropdown */}
                    <div className="flex items-center ml-auto">
                        <select
                            value={fontSize}
                            onChange={handleFontSizeChange}
                            className="border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            title="Font Size"
                        >
                            {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40].map(size => (
                                <option key={size} value={`${size}px`}>{size}px</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    style={{ fontSize: fontSize }} // Apply overall font size
                    onInput={handleInput} // Save to history on every input
                    onPaste={handlePaste} // Handle paste event
                ></div>

                {/* HTML Output Preview */}
                <div className="mt-4 content-preview">
                    <div className="flex  justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white">HTML Output:</h4>
                        <button
                            type="button"
                            onClick={() => {
                                // Fallback for copying text to clipboard in iframes
                                const tempTextArea = document.createElement('textarea');
                                tempTextArea.value = htmlContent;
                                document.body.appendChild(tempTextArea);
                                tempTextArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(tempTextArea);
                                console.log('HTML copied to clipboard!'); // Log for Canvas environment
                            }}
                            className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200"
                        >
                            Copy HTML
                        </button>
                    </div>
                    <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 font-mono text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-words">{htmlContent || '<p><br></p>'}</pre>
                    </div>
                </div>
            </div>

            {/* Image URL Modal Render: Only show if showImageUrlModal is true */}
            {showImageUrlModal && (
                <ImageUrlModal
                    onInsert={(url) => {
                        insertImageLogic(url); // Call the logic to insert image
                        setShowImageUrlModal(false); // Close the modal
                    }}
                    onCancel={() => setShowImageUrlModal(false)} // Close the modal on cancel
                />
            )}
        </div>
    );
};

export default EnhancedRichTextEditor;

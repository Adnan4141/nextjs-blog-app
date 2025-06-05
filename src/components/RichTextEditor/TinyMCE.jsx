"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";


export default function TinyMCERichTextEditor({ setFormData, formData,initialValue="" }) {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme } = useTheme();
 
 


  


  useEffect(() => {
    setIsDarkMode(theme == "dark" ? true : false);
  }, [theme]);

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
    setContent(content);
  };


  const handleCopyToClipboard = () => {
    if (editorRef.current) {
      navigator.clipboard
        .writeText(editorRef.current.getContent())
        .then(() => alert("Content copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  return (
    <div  className={`p-4   ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Write your blog content
        </h1>
      </div>

      <Editor
        
        apiKey={process.env.NEXT_PUBLIC_RICH_EDITOR_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        onEditorChange={handleEditorChange}
         dangerouslySetInnerHTML={{ __html: initialValue }}
        init={{
          height: 500,
          menubar: false,
          skin: isDarkMode ? "oxide-dark" : "oxide",
          content_css: isDarkMode ? "dark" : "",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "emoticons",
            "pagebreak",
            "save",
            "visualchars",
            "quickbars",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media | " +
            "table hr pagebreak | code fullscreen preview | " +
            "emoticons charmap | removeformat | help",
          content_style: `
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              ${isDarkMode ? "color: #e0e0e0; background-color: #1e1e1e;" : ""}
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table, th, td {
              border: 1px solid ${isDarkMode ? "#555" : "#ccc"};
            }
            th, td {
              padding: 8px;
            }
          `,
          images_upload_handler: (blobInfo, success, failure) => {
            // Implement your own image upload logic here
            // For now, we'll just use a placeholder
            success(
              "https://via.placeholder.com/300x200?text=Upload+Your+Image"
            );
          },
          quickbars_insert_toolbar: "quickimage quicktable",
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote",
          paste_data_images: false, // Prevent pasting of images (base64)
          image_advtab: true, // Show advanced image options
          image_title: true, // Enable image title
          automatic_uploads: false, // Set to true if you want automatic uploads
          file_picker_types: "image", // Only allow image file picker
          branding: false, // Remove "Powered by Tiny" branding
        }}
      />

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy HTML to Clipboard
        </button>
        <button
          type="button"
          onClick={() => console.log(content)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Log Content
        </button>
      </div>

      {content && (
        <div
          className={`mt-6 p-4 border rounded ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            HTML Preview
          </h2>
          <div
            className={`p-3 rounded overflow-auto max-h-64 ${
              isDarkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-800"
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
}

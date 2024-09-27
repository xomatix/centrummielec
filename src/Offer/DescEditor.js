import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's snow theme

const DescEditor = ({ defaultValue, onTextChange }) => {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Handle editor change
  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    if (onTextChange) {
      onTextChange(content); // Call the callback function with updated content
    }
  };

  // All toolbar options
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "video"], //"image",
      ["clean"], // Clear formatting
    ],
  };

  // Supported formats
  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "check",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Wpisz opis..."
      />
    </div>
  );
};

export default DescEditor;

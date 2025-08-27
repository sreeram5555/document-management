
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api";

// const DocumentEditor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   const token = userInfo?.token;

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔹 Fetch document if editing
//   useEffect(() => {
//     const fetchDocument = async () => {
//       if (!id) return; // new file → no fetch needed

//       try {
//         const { data } = await API.get(`/documents/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTitle(data.title);
//         setContent(data.content);
//       } catch (err) {
//         console.error("Load failed:", err.response?.data || err.message);
//         setError("Failed to load document.");
//       }
//     };

//     fetchDocument();
//   }, [id, token]);

//   // 🔹 Save handler (new or edit)
//   const handleSave = async () => {
//     if (!title.trim()) {
//       setError("Title cannot be empty.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       if (id) {
//         // ✅ Editing existing doc
//         await API.put(
//           `/documents/${id}/edit`,
//           { title, content },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         // ✅ Creating new doc (no owner passed → backend uses req.user._id)
//         await API.post(
//           "/documents",
//           { title, content },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       setLoading(false);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Save failed:", err.response?.data || err.message);
//       setError("Failed to save document.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">
//         {id ? "Edit Document" : "New Document"}
//       </h2>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
//       )}

//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <textarea
//         placeholder="Content"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         rows={10}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <button
//         onClick={handleSave}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? "Saving..." : "Save"}
//       </button>
//     </div>
//   );
// };

// export default DocumentEditor;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api";

// const DocumentEditor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   const token = userInfo?.token;

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [editPassword, setEditPassword] = useState(""); // 🔑
//   const [viewPassword, setViewPassword] = useState(""); // 🔑
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔹 Fetch document if editing
//   useEffect(() => {
//     const fetchDocument = async () => {
//       if (!id) return; // new file → no fetch needed

//       try {
//         const { data } = await API.get(`/documents/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTitle(data.title);
//         setContent(data.content);
//         setEditPassword(data.editPassword || "");
//         setViewPassword(data.viewPassword || "");
//       } catch (err) {
//         console.error("Load failed:", err.response?.data || err.message);
//         setError("Failed to load document.");
//       }
//     };

//     fetchDocument();
//   }, [id, token]);

//   // 🔹 Save handler (new or edit)
//   const handleSave = async () => {
//     if (!title.trim()) {
//       setError("Title cannot be empty.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       if (id) {
//         // ✅ Editing existing doc
//         await API.put(
//           `/documents/${id}/edit`,
//           { title, content, editPassword, viewPassword },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         // ✅ Creating new doc
//         await API.post(
//           "/documents",
//           { title, content, editPassword, viewPassword },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       setLoading(false);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Save failed:", err.response?.data || err.message);
//       setError("Failed to save document.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">
//         {id ? "Edit Document" : "New Document"}
//       </h2>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
//       )}

//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <textarea
//         placeholder="Content"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         rows={10}
//         className="w-full p-2 border rounded mb-4"
//       />

//       {/* 🔑 Edit password field */}
//       <input
//         type="password"
//         placeholder="Edit Password"
//         value={editPassword}
//         onChange={(e) => setEditPassword(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       {/* 🔑 View password field */}
//       <input
//         type="password"
//         placeholder="View Password"
//         value={viewPassword}
//         onChange={(e) => setViewPassword(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <button
//         onClick={handleSave}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? "Saving..." : "Save"}
//       </button>
//     </div>
//   );
// };

// export default DocumentEditor;


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../api";

// const DocumentEditor = () => {
//   const { id } = useParams();
//   const currentUser = JSON.parse(localStorage.getItem("userInfo"));
//   const currentUserId = currentUser?._id;

//   const [document, setDocument] = useState(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false); // ✅ to check edit access
//   const [passwordInput, setPasswordInput] = useState("");

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         const { data } = await API.get(`/documents/${id}`);
//         setDocument(data);
//         setTitle(data.title);
//         setContent(data.content);

//         // ✅ If owner → auto authorized
//         if (data.owner === currentUserId) {
//           setAuthorized(true);
//         }
//       } catch (error) {
//         console.error("Failed to fetch document", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id, currentUserId]);

//   const handlePasswordCheck = () => {
//     if (passwordInput === document.editPassword) {
//       setAuthorized(true);
//     } else {
//       alert("❌ Incorrect password!");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   // ✅ If not authorized yet, show password input
//   if (!authorized) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h2 className="text-xl font-bold mb-4">Enter Edit Password</h2>
//         <input
//           type="password"
//           className="border p-2 rounded mb-2"
//           placeholder="Edit password"
//           value={passwordInput}
//           onChange={(e) => setPasswordInput(e.target.value)}
//         />
//         <button
//           onClick={handlePasswordCheck}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Submit
//         </button>
//       </div>
//     );
//   }

//   // ✅ If authorized → show editor
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Editing: {title}</h1>
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="w-full h-64 border rounded p-2"
//       />
//       {/* Save button etc. */}
//     </div>
//   );
// };

// export default DocumentEditor;
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api";

// const DocumentEditor = () => {
//   const { id } = useParams(); // undefined for /document/new
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem("userInfo"));
//   const currentUserId = currentUser?._id;

//   const [document, setDocument] = useState(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [viewPassword, setViewPassword] = useState("");
//   const [editPassword, setEditPassword] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);
//   const [passwordInput, setPasswordInput] = useState("");

//   useEffect(() => {
//     if (!id) {
//       // ✅ New document → allow editing directly
//       setAuthorized(true);
//       setLoading(false);
//       return;
//     }

//     // ✅ Existing document → fetch and check
//     const fetchDoc = async () => {
//       try {
//         const { data } = await API.get(`/documents/${id}`);
//         setDocument(data);
//         setTitle(data.title);
//         setContent(data.content);

//         if (data.owner === currentUserId) {
//           setAuthorized(true);
//         }
//       } catch (error) {
//         console.error("Failed to fetch document", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id, currentUserId]);

//   const handlePasswordCheck = () => {
//     if (passwordInput === document.editPassword) {
//       setAuthorized(true);
//     } else {
//       alert("❌ Incorrect password!");
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (!id) {
//         // ✅ Create new document
//         await API.post("/documents", {
//           title,
//           content,
//           viewPassword,
//           editPassword,
//         });
//         navigate("/dashboard");
//       } else {
//         // ✅ Update existing document
//         await API.put(`/documents/${id}`, { title, content });
//         alert("✅ Document saved!");
//       }
//     } catch (error) {
//       console.error("❌ Failed to save document:", error);
//       alert("❌ Failed to save document.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   // ✅ Only ask password for existing docs (not new)
//   if (!authorized && id) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h2 className="text-xl font-bold mb-4">Enter Edit Password</h2>
//         <input
//           type="password"
//           className="border p-2 rounded mb-2"
//           placeholder="Edit password"
//           value={passwordInput}
//           onChange={(e) => setPasswordInput(e.target.value)}
//         />
//         <button
//           onClick={handlePasswordCheck}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Submit
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">
//         {id ? `Editing: ${title}` : "Create New Document"}
//       </h1>

//       <input
//         type="text"
//         className="border p-2 w-full mb-2"
//         placeholder="Document Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       {/* ✅ Show password fields only when creating a new doc */}
//       {!id && (
//         <>
//           <input
//             type="password"
//             className="border p-2 w-full mb-2"
//             placeholder="Set View Password"
//             value={viewPassword}
//             onChange={(e) => setViewPassword(e.target.value)}
//           />
//           <input
//             type="password"
//             className="border p-2 w-full mb-2"
//             placeholder="Set Edit Password"
//             value={editPassword}
//             onChange={(e) => setEditPassword(e.target.value)}
//           />
//         </>
//       )}

//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="w-full h-64 border rounded p-2 mb-4"
//         placeholder="Start writing here..."
//       />

//       <button
//         onClick={handleSave}
//         className="bg-green-600 text-white px-6 py-2 rounded"
//       >
//         {id ? "Save Changes" : "Create Document"}
//       </button>
//     </div>
//   );
// };

// export default DocumentEditor;

// components/documents/DocumentEditor.jsx
// src/components/documents/DocumentEditor.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";

const DocumentEditor = () => {
  const { id } = useParams(); // undefined for /document/new
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userInfo?._id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newEditPassword, setNewEditPassword] = useState("");
  const [newViewPassword, setNewViewPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // New doc: allow owner to create immediately
    if (!id) {
      setIsOwner(true);
      setAuthorized(true);
      setLoading(false);
      return;
    }

    // Existing doc: fetch metadata (no passwords)
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/documents/${id}`);
        setTitle(data.title || "");
        setContent(data.content || "");
        const ownerMatch = String(data.owner) === String(currentUserId);
        setIsOwner(ownerMatch);
        setAuthorized(ownerMatch);
      } catch (err) {
        console.error("Load failed:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load document.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id, currentUserId]);

  // Non-owner submits password to unlock
  const handleVerifyPassword = async (e) => {
    e?.preventDefault();
    setError("");
    const trimmed = (enteredPassword || "").trim();
    if (!trimmed) { setError("Please enter the edit password."); return; }

    setLoading(true);
    try {
      const { data } = await API.post(`/documents/${id}/edit`, { password: trimmed });
      // server returns doc on success
      setTitle(data.title || "");
      setContent(data.content || "");
      setAuthorized(true);
      setIsOwner(false);
      setError("");
    } catch (err) {
      console.error("Verify failed:", err.response?.data || err.message);
      if (err.response?.status === 401) setError("Incorrect edit password.");
      else setError(err.response?.data?.message || "Failed to verify password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!title.trim()) { setError("Title cannot be empty."); return; }

    setLoading(true);
    try {
      if (!id) {
        // Create new doc (owner)
        const payload = {
          title,
          content,
          editPassword: newEditPassword ? newEditPassword.trim() : undefined,
          viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
        };
        const { data } = await API.post("/documents", payload);
        navigate(`/document/${data._id}/edit`);
        return;
      }

      // Editing existing doc
      if (isOwner) {
        // owner can change passwords too
        const payload = {
          title,
          content,
          editPassword: newEditPassword ? newEditPassword.trim() : undefined,
          viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
        };
        await API.put(`/documents/${id}/edit`, payload);
      } else {
        // non-owner must include the password they used to unlock
        await API.put(`/documents/${id}/edit`, {
          title,
          content,
          editPassword: (enteredPassword || "").trim(),
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save document.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // If existing doc and not authorized yet -> show password prompt
  if (!authorized && id) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl mb-4">Enter edit password to modify this document</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleVerifyPassword}>
          <input
            type="password"
            placeholder="Edit password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
            <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // Authorized editor UI (owner or verified non-owner)
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Document" : "Create Document"}</h2>
      {error && <div className="text-red-700 bg-red-100 p-2 mb-3 rounded">{error}</div>}

      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full p-2 border rounded mb-3" />

      {/* show password inputs only for owner (creating or owner editing) */}
      {(!id || isOwner) && (
        <>
          <input type="password" placeholder={id ? "Change edit password (leave blank to keep)" : "Set edit password"} value={newEditPassword} onChange={e => setNewEditPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <input type="password" placeholder={id ? "Change view password (leave blank to keep)" : "Set view password"} value={newViewPassword} onChange={e => setNewViewPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
        </>
      )}

      <div className="flex gap-3">
        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Saving..." : (id ? "Save Changes" : "Create Document")}</button>
        <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default DocumentEditor;

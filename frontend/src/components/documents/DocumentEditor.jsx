
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api";

// const DocumentEditor = () => {
//   const { id } = useParams(); // undefined for /document/new
//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   const currentUserId = userInfo?._id;

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [newEditPassword, setNewEditPassword] = useState("");
//   const [newViewPassword, setNewViewPassword] = useState("");
//   const [enteredPassword, setEnteredPassword] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);
//   const [isOwner, setIsOwner] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // New doc: allow owner to create immediately
//     if (!id) {
//       setIsOwner(true);
//       setAuthorized(true);
//       setLoading(false);
//       return;
//     }

//     // Existing doc: fetch metadata (no passwords)
//     const fetchDoc = async () => {
//       setLoading(true);
//       try {
//         const { data } = await API.get(`/documents/${id}`);
//         setTitle(data.title || "");
//         setContent(data.content || "");
//         const ownerMatch = String(data.owner) === String(currentUserId);
//         setIsOwner(ownerMatch);
//         setAuthorized(ownerMatch);
//       } catch (err) {
//         console.error("Load failed:", err.response?.data || err.message);
//         setError(err.response?.data?.message || "Failed to load document.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoc();
//   }, [id, currentUserId]);

//   // Non-owner submits password to unlock
//   const handleVerifyPassword = async (e) => {
//     e?.preventDefault();
//     setError("");
//     const trimmed = (enteredPassword || "").trim();
//     if (!trimmed) { setError("Please enter the edit password."); return; }

//     setLoading(true);
//     try {
//       const { data } = await API.post(`/documents/${id}/edit`, { password: trimmed });
//       // server returns doc on success
//       setTitle(data.title || "");
//       setContent(data.content || "");
//       setAuthorized(true);
//       setIsOwner(false);
//       setError("");
//     } catch (err) {
//       console.error("Verify failed:", err.response?.data || err.message);
//       if (err.response?.status === 401) setError("Incorrect edit password.");
//       else setError(err.response?.data?.message || "Failed to verify password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setError("");
//     if (!title.trim()) { setError("Title cannot be empty.");  return; }

//     setLoading(true);
//     try {
//       if (!id) {
//         // Create new doc (owner)
//         const payload = {
//           title,
//           content,
//           editPassword: newEditPassword ? newEditPassword.trim() : undefined,
//           viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
//         };
//         const { data } = await API.post("/documents", payload);
//         // navigate(`/document/${data._id}/edit`);
//         navigate("/dashboard");
//         return;
//       }

//       // Editing existing doc
//       if (isOwner) {
//         // owner can change passwords too
//         const payload = {
//           title,
//           content,
//           editPassword: newEditPassword ? newEditPassword.trim() : undefined,
//           viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
//         };
//         await API.put(`/documents/${id}/edit`, payload);
//       } else {
//         // non-owner must include the password they used to unlock
//         await API.put(`/documents/${id}/edit`, {
//           title,
//           content,
//           editPassword: (enteredPassword || "").trim(),
//         });
//       }

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Save failed:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to save document.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   // If existing doc and not authorized yet -> show password prompt
//   if (!authorized && id) {
//     return (
//       <div className="p-6 max-w-xl mx-auto">
//         <h2 className="text-xl mb-4">Enter edit password to modify this document</h2>
//         {error && <div className="text-red-600 mb-2">{error}</div>}
//         <form onSubmit={handleVerifyPassword}>
//           <input
//             type="password"
//             placeholder="Edit password"
//              value={enteredPassword}
//             onChange={(e) => setEnteredPassword(e.target.value)}
//             className="w-full p-2 border rounded mb-3"
//           />
//           <div className="flex gap-3">
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
//             <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // Authorized editor UI (owner or verified non-owner)
//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">{id ? "Edit Document" : "Create Document"}</h2>
//       {error && <div className="text-red-700 bg-red-100 p-2 mb-3 rounded">{error}</div>}

//       <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
//       <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full p-2 border rounded mb-3" />

//       {/* show password inputs only for owner (creating or owner editing) */}
//       {(!id || isOwner) && (
//         <>
//           <input type="password" placeholder={id ? "Change edit password (leave blank to keep)" : "Set edit password"} value={newEditPassword} onChange={e => setNewEditPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
//           <input type="password" placeholder={id ? "Change view password (leave blank to keep)" : "Set view password"} value={newViewPassword} onChange={e => setNewViewPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
//         </>
//       )}

//       <div className="flex gap-3">
//         <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Saving..." : (id ? "Save Changes" : "Create Document")}</button>
//         <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default DocumentEditor;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import bcrypt from "bcryptjs";

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

  // toggle states
  const [showEnteredPassword, setShowEnteredPassword] = useState(false);
  const [showNewEditPassword, setShowNewEditPassword] = useState(false);
  const [showNewViewPassword, setShowNewViewPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setIsOwner(true);
      setAuthorized(true);
      setLoading(false);
      return;
    }

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

  const handleVerifyPassword = async (e) => {
    e?.preventDefault();
    setError("");
    const trimmed = (enteredPassword || "").trim();
    if (!trimmed) { setError("Please enter the edit password."); return; }

    setLoading(true);
    try {
      const { data } = await API.post(`/documents/${id}/edit`, { password: trimmed });
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
    if (!title.trim()) { setError("Title cannot be empty.");  return; }

    setLoading(true);
    try {
      if (!id) {
        const payload = {
          title,
          content,
          editPassword: newEditPassword ? newEditPassword.trim() : undefined,
          viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
        };
        await API.post("/documents", payload);
        navigate("/dashboard");
        return;
      }

      if (isOwner) {
        const payload = {
          title,
          content,
          editPassword: newEditPassword ? newEditPassword.trim() : undefined,
          viewPassword: newViewPassword ? newViewPassword.trim() : undefined,
        };
        await API.put(`/documents/${id}/edit`, payload);
      } else {
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

  if (!authorized && id) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl mb-4">Enter edit password to modify this document</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleVerifyPassword}>
          <div className="flex gap-2 mb-3">
            <input
              type={showEnteredPassword ? "text" : "password"}
              placeholder="Edit password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowEnteredPassword((prev) => !prev)}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              {showEnteredPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
            <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Document" : "Create Document"}</h2>
      {error && <div className="text-red-700 bg-red-100 p-2 mb-3 rounded">{error}</div>}

      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full p-2 border rounded mb-3" />

      {(!id || isOwner) && (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type={showNewEditPassword ? "text" : "password"}
              placeholder={id ? "Change edit password (leave blank to keep)" : "Set edit password"}
              value={newEditPassword}
              onChange={e => setNewEditPassword(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowNewEditPassword((prev) => !prev)}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              {showNewEditPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type={showNewViewPassword ? "text" : "password"}
              placeholder={id ? "Change view password (leave blank to keep)" : "Set view password"}
              value={newViewPassword}
              onChange={e => setNewViewPassword(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowNewViewPassword((prev) => !prev)}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              {showNewViewPassword ? "Hide" : "Show"}
            </button>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
          {loading ? "Saving..." : (id ? "Save Changes" : "Create Document")}
        </button>
        <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default DocumentEditor;

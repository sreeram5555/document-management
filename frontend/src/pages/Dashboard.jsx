// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import API from "../api";
// import DocumentCard from "../components/documents/DocumentCard";
// import Spinner from "../components/common/Spinner";
// import { PlusIcon, MagnifyingGlassIcon,ArrowUpIcon  } from "@heroicons/react/24/solid";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import mammoth from "mammoth";

// const Dashboard = ({ userInfo, setUserInfo }) => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(""); 



//   const navigate = useNavigate();
//   const location = useLocation();

//   const currentUserId = userInfo?._id;

//   useEffect(() => {
//     const fetchDocs = async () => {
//       try {
//         setLoading(true);
//         const queryParams = new URLSearchParams(location.search);
//         const userId = queryParams.get("user");
//         const url = userId ? `/documents?user=${userId}` : "/documents";
//         const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

//         const { data } = await API.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setDocuments(data);
//       } catch (err) {
//         setError("Failed to fetch documents.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocs();
//   }, [location.search]);

//   //  const handleFileChange = (e) => {
//   //  const selectedFile = e.target.files[0];
//   // if (!selectedFile) return;

//   // const reader = new FileReader();

//   // reader.onload = (event) => {
//   //   const fileContent = event.target.result;

//   //   // Navigate to DocumentEditor with file data
//   //   navigate("/document/new", {
//   //     state: {
//   //       fileName: selectedFile.name,   // optional, for title
//   //       fileContent: fileContent       // content to prefill
//   //     }
//   //   });
//   // };

//   // reader.readAsText(selectedFile);
//   // };

//     const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     if (!selectedFile) return;

//     const fileType = selectedFile.type;

//     try {
//       let content = "";

//       if (fileType === "text/plain") {
//         // TXT
//         content = await selectedFile.text();
//       } else if (fileType === "application/pdf") {
//         // PDF
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           content += textContent.items.map((item) => item.str).join(" ") + "\n";
//         }
//       } else if (
//         fileType ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         // DOCX
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         content = result.value;
//       } else if (fileType === "application/json") {
//         // JSON
//         const text = await selectedFile.text();
//         content = JSON.stringify(JSON.parse(text), null, 2);
//       } else if (fileType === "text/csv") {
//         // CSV
//         const text = await selectedFile.text();
//         content = text;
//       } else {
//         content = "File type not supported for preview";
//       }

//       setDocuments([{ name: selectedFile.name, content }]);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to read file content");
//     }
//   };


  
//   const handleDelete = async (docId) => {
//     try {
//       const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
//       const res = await API.delete(`/documents/${docId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
//       } else {
//         alert(res.data.message);
//       }
//     } catch (error) {
//       const msg = error.response?.data?.message || error.message;
//       if (msg.includes("not found")) {
//         // Just ignore if already deleted
//         setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
//       } else {
//         alert("Error deleting document: " + msg);
//       }
//     }
//   };

//   const handleSearch = async (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value.length > 2) {
//       try {
//         const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
//         const { data } = await API.get(`/users?search=${e.target.value}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSearchResults(data);
//       } catch (error) {
//         console.error("Search failed", error);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner />
//       </div>
//     );
//   }

//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("user");

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-4xl font-bold text-gray-800">
//           {userId ? "User's Documents" : "Your Documents"}
//         </h1>

//         {!userId && (
//           <>
//             {/* <Link
//               to="/passwords"
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//             >
//               Passwords
//             </Link> */}

//             {/* <Link
//               to="/dashboard"
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//             >

              

//                   <ArrowUpIcon className="w-5 h-5" />
//       Upload File
//       <input
//         type="file"
//         className="hidden"
//         onChange={handleFileChange}
//       />
//             </Link> */}

//             {/* The visible button */}
//       <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 cursor-pointer">
//         <ArrowUpIcon className="w-5 h-5" />
//         Upload File
//         {/* Hidden file input */}
//         <input
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//         />
//       </label>

//             <Link
//               to="/document/new"
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//             >
//               <PlusIcon className="w-5 h-5" />
//               Create New
//             </Link>
//           </>
//         )}
//       </div>

//       {userInfo && (
//         <div className="relative w-full md:w-1/3 mb-6">
//           <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search for other members..."
//             value={searchQuery}
//             onChange={handleSearch}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           {searchResults.length > 0 && (
//             <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
//               {searchResults.map((user) => (
//                 <li
//                   key={user._id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchResults([]); // hide dropdown
//                     setSearchQuery(""); // clear search input
//                     navigate(`/dashboard?user=${user._id}`); // navigate to user docs
//                   }}
//                 >
//                   {user.username}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}

//       {error && (
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
//       )}

//       {/* Documents Grid */}
//       {documents.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             No documents found!
//           </h2>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {documents.map((doc) => (
//             <DocumentCard
//               key={doc._id}
//               document={doc}
//               onDelete={handleDelete}
//               currentUserId={currentUserId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import API from "../api";
// import DocumentCard from "../components/documents/DocumentCard";
// import Spinner from "../components/common/Spinner";
// import { PlusIcon, MagnifyingGlassIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// // import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import * as mammoth from "mammoth"; // DOCX reader
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;



// const Dashboard = ({ userInfo, setUserInfo }) => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentUserId = userInfo?._id;

//   useEffect(() => {
//     const fetchDocs = async () => {
//       try {
//         setLoading(true);
//         const queryParams = new URLSearchParams(location.search);
//         const userId = queryParams.get("user");
//         const url = userId ? /documents?user=${userId} : "/documents";
//         const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

//         const { data } = await API.get(url, {
//           headers: { Authorization: Bearer ${token} },
//         });

//         setDocuments(data);
//       } catch (err) {
//         setError("Failed to fetch documents.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDocs();
//   }, [location.search]);

  

//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     try {
//       let content = "";
//       const fileType = selectedFile.type;

//       if (fileType === "text/plain") {
//         content = await selectedFile.text();
//       } else if (fileType === "application/pdf") {
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           content += textContent.items.map((item) => item.str).join(" ") + "\n";
//         }
//       } else if (
//         fileType ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         content = result.value;
//       } else if (fileType === "application/json") {
//         const text = await selectedFile.text();
//         content = JSON.stringify(JSON.parse(text), null, 2);
//       } else if (fileType === "text/csv") {
//         content = await selectedFile.text();
//       } else if (fileType === "text/html") {
//         content = await selectedFile.text();
//       } else {
//         content = "File type not supported for preview";
//       }

//       // Navigate to new document page with file content
//       navigate("/document/new", {
//         state: { fileName: selectedFile.name, fileContent: content },
//       });
//     } catch (err) {
//       console.error(err);
//       setError("Failed to read file content");
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-4xl font-bold text-gray-800">Your Documents</h1>

//         {/* Upload + Create New */}
//         <div className="flex gap-2">
//           <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer">
//             <ArrowUpIcon className="w-5 h-5" />
//             Upload File
//             <input type="file" className="hidden" onChange={handleFileChange} />
//           </label>

//           <Link
//             to="/document/new"
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
//           >
//             <PlusIcon className="w-5 h-5" />
//             Create New
//           </Link>
//         </div>
//       </div>

//       {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

//       {/* Documents Grid */}
//       {documents.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-700">No documents found!</h2>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {documents.map((doc) => (
//             <DocumentCard
//               key={doc._id}
//               document={doc}
//               currentUserId={currentUserId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import API from "../api";
// import DocumentCard from "../components/documents/DocumentCard";
// import Spinner from "../components/common/Spinner";
// import { PlusIcon, MagnifyingGlassIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import * as mammoth from "mammoth"; // DOCX reader

// // Set PDF.js worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const Dashboard = ({ userInfo, setUserInfo }) => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentUserId = userInfo?._id;

//   useEffect(() => {
//     const fetchDocs = async () => {
//       try {
//         setLoading(true);
//         const queryParams = new URLSearchParams(location.search);
//         const userId = queryParams.get("user");
//         const url = userId ? `/documents?user=${userId}` : "/documents";
//         const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

//         const { data } = await API.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setDocuments(data);
//       } catch (err) {
//         setError("Failed to fetch documents.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDocs();
//   }, [location.search]);

//   const handleDeleteDocument = (docId) => {
//   setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
// };


//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     try {
//       let content = "";
//       const fileType = selectedFile.type;

//       if (fileType === "text/plain") {
//         content = await selectedFile.text();
//       } else if (fileType === "application/pdf") {
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           content += textContent.items.map((item) => item.str).join(" ") + "\n";
//         }
//       } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//         const arrayBuffer = await selectedFile.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         content = result.value;
//       } else if (fileType === "application/json") {
//         const text = await selectedFile.text();
//         content = JSON.stringify(JSON.parse(text), null, 2);
//       } else if (fileType === "text/csv") {
//         content = await selectedFile.text();
//       } else if (fileType === "text/html") {
//         content = await selectedFile.text();
//       } else {
//         content = "File type not supported for preview";
//       }

//       // Navigate to new document page with file content
//       navigate("/document/new", {
//         state: { fileName: selectedFile.name, fileContent: content },
//       });
//     } catch (err) {
//       console.error(err);
//       setError("Failed to read file content");
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-4xl font-bold text-gray-800">Your Documents</h1>

//         {/* Upload + Create New */}
//         <div className="flex gap-2">
//           <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer">
//             <ArrowUpIcon className="w-5 h-5" />
//             Upload File
//             <input type="file" className="hidden" onChange={handleFileChange} />
//           </label>

//           <Link
//             to="/document/new"
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
//           >
//             <PlusIcon className="w-5 h-5" />
//             Create New
//           </Link>
//         </div>
//       </div>

//       {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

//       {/* Documents Grid */}
//       {documents.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-700">No documents found!</h2>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {documents.map((doc) => (
//             <DocumentCard
//               key={doc._id}
//               document={doc}
//               currentUserId={currentUserId}
//               onDelete={handleDeleteDocument}  
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import DocumentCard from "../components/documents/DocumentCard";
import Spinner from "../components/common/Spinner";
import { PlusIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as mammoth from "mammoth"; // DOCX reader

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Dashboard = ({ userInfo, setUserInfo }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = userInfo?._id;

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get("user");
        const url = userId ? `/documents?user=${userId}` : "/documents";
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        const { data } = await API.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDocuments(data);
      } catch (err) {
        setError("Failed to fetch documents.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [location.search]);

 const handleDeleteDocument = async (docId) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    await API.delete(`/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove from local state immediately
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));

  } catch (err) {
    console.error("Failed to delete document", err.response?.data || err.message);
    alert("Could not delete the document.");
  }
};


  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      let content = "";
      const fileType = selectedFile.type;

      if (fileType === "text/plain") {
        content = await selectedFile.text();
      } else if (fileType === "application/pdf") {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          content += textContent.items.map((item) => item.str).join(" ") + "\n";
        }
      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } else if (fileType === "application/json") {
        const text = await selectedFile.text();
        content = JSON.stringify(JSON.parse(text), null, 2);
      } else if (fileType === "text/csv" || fileType === "text/html") {
        content = await selectedFile.text();
      } else {
        content = "File type not supported for preview";
      }

      navigate("/document/new", {
        state: { fileName: selectedFile.name, fileContent: content },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to read file content");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Your Documents</h1>

        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer">
            <ArrowUpIcon className="w-5 h-5" />
            Upload File
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          <Link
            to="/document/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Create New
          </Link>
        </div>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">No documents found!</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              currentUserId={currentUserId}
               onDelete={handleDeleteDocument}  // <-- fix here
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

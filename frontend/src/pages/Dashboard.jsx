
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
  setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
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
  doc._id && (
    <DocumentCard
      key={doc._id}
      document={doc}
      currentUserId={currentUserId}
      onDelete={handleDeleteDocument}
    />
  )
))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

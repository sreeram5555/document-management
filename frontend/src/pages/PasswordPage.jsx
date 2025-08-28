import React from "react";
import { useEffect, useState } from "react";
import API from "../api";

const PasswordsPage = () => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const { data } = await API.get("/documents/passwords/all");
        setPasswords(data);
      } catch (err) {
        console.error("Error fetching passwords", err);
      }
    };
    fetchPasswords();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Document Passwords</h1>
      {passwords.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        <div className="space-y-4">
          {passwords.map((doc) => (
            <div
              key={doc._id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <h2 className="font-semibold text-lg">{doc.title}</h2>
              <p>
                <strong>View Password:</strong> {doc.viewPassword}
              </p>
              <p>
                <strong>Edit Password:</strong> {doc.editPassword}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

  
  );
};

export default PasswordsPage;

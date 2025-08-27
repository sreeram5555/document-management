

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
// import API from '../../api';

// const DocumentCard = ({ document, onDelete, currentUserId }) => {
//     const navigate = useNavigate();
//     const isOwner = document.owner === currentUserId; // check ownership

//     const handleEdit = () => {
//         navigate(`/document/${document._id}/edit`, { state: { isOwner } });
//     };
    
//     const handleView = () => {
//                     navigate(`/document/${document._id}/view`, { state: { isOwner } });
//     };

//     const handleDelete = async () => {
//         if (!isOwner) return alert("Only the owner can delete this document.");
//         if (window.confirm('Are you sure you want to delete this document?')) {
//             try {
//                 await API.delete(`/documents/${document._id}`);
//                 onDelete(document._id);
//             } catch (error) {
//                 console.error("Failed to delete document", error);
//                 alert("Could not delete the document.");
//             }
//         }
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
//             <div>
//                 <h3 className="text-xl font-bold text-gray-800 truncate">{document.title}</h3>
//                 <p className="text-sm text-gray-500 mt-2">
//                     Last updated: {new Date(document.updatedAt).toLocaleDateString()}
//                 </p>
//             </div>
//             <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-100">
//                 <button onClick={handleView} className="p-2 hover:text-green-600 rounded-full">
//                     <EyeIcon className="w-5 h-5"/>
//                 </button>
//                 <button onClick={handleEdit} className="p-2 hover:text-blue-600 rounded-full">
//                     <PencilIcon className="w-5 h-5"/>

//                 </button>
//                 {/* {isOwner && ( */}
//                   <button onClick={handleDelete} className="p-2 hover:text-red-600 rounded-full">
//                       <TrashIcon className="w-5 h-5"/>
//                   </button>
//                  {/* )} */}
//             </div>
//         </div>
//     );
// };

// export default DocumentCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import API from '../../api';

const DocumentCard = ({ document, onDelete, currentUserId }) => {
    const navigate = useNavigate();
    const isOwner = document.owner === currentUserId; // check ownership

    const handleEdit = () => {
        navigate(`/document/${document._id}/edit`, { state: { isOwner } });
    };

    const handleView = () => {
        navigate(`/document/${document._id}/view`, { state: { isOwner } });
    };

    const handleDelete = async () => {
        if (!isOwner) return alert("Only the owner can delete this document.");
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const token = userInfo?.token;

                await API.delete(`/documents/${document._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                onDelete(document._id); // update parent state (Dashboard)
            } catch (error) {
                console.error("Failed to delete document", error.response?.data || error.message);
                alert("Could not delete the document.");
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-800 truncate">{document.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                    Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                </p>
            </div>
            <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button onClick={handleView} className="p-2 hover:text-green-600 rounded-full">
                    <EyeIcon className="w-5 h-5"/>
                </button>
                <button onClick={handleEdit} className="p-2 hover:text-blue-600 rounded-full">
                    <PencilIcon className="w-5 h-5"/>
                </button>
                {/* {isOwner && ( */}
                    <button onClick={handleDelete} className="p-2 hover:text-red-600 rounded-full">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                {/* )} */}
            </div>
        </div>
    );
};

export default DocumentCard;

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { generatePDF } from '../utils/generatePDF';


const ModerationPage = () => {
    const [pendingAudits, setPendingAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingAudits();
    }, []);

    const fetchPendingAudits = async () => {
        try {

            const response = await fetch('http://localhost:3000/api/audits/pending');
            const result = await response.json();
            if (result.success) {
                setPendingAudits(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch pending audits:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (auditId, newStatus) => {
        try {

            const response = await fetch(`http://localhost:3000/api/audits/${auditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ verification_status: newStatus }),
            });

            const result = await response.json();

            if (result.success) {
                setPendingAudits((prevAudits) => 
                    prevAudits.filter((audit) => audit.id !== auditId)
                );
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating audit:", error);
        }
    };

    const handleExportPDF = () => {
        if (pendingAudits.length === 0) {
            alert("No pending audits to export.");
            return;
        }

        generatePDF(
            "Maendeleo Moderation Queue",
            [
                { header: "Project", key: "project_name" },
                { header: "User ID", key: "user_id" },
                { header: "Ground Status", key: "ground_status" },
                { header: "Progress", key: "progress_estimate", format: (audit) => `${audit.progress_estimate ?? "N/A"}%` },
                { header: "Quality", key: "quality_assessment" },
                { header: "Safety", key: "safety_assessment" },
            ],
            pendingAudits,
            "maendeleo_moderation_queue"
        );
    };

    if (loading) return <div className="p-6 text-gray-500">Loading pending reports...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Moderation Queue</h1>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                    <Download className="w-4 h-4" /> Export PDF
                </button>
            </div>
            
            {pendingAudits.length === 0 ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                    You're all caught up! No pending reports.
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingAudits.map((audit) => (
                        <div key={audit.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                            
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-xl font-semibold text-blue-600">
                                    Project: {audit.project_name || 'Unknown Project'}
                                </h2>
                                <p className="text-sm text-gray-500 mb-2">Submitted by User ID: {audit.user_id}</p>
                                <div className="grid grid-cols-2 gap-x-8 text-sm">
                                    <p><span className="font-medium text-gray-700">Ground Status:</span> {audit.ground_status}</p>
                                    <p><span className="font-medium text-gray-700">Progress:</span> {audit.progress_estimate}%</p>
                                    <p><span className="font-medium text-gray-700">Quality:</span> {audit.quality_assessment}</p>
                                    <p><span className="font-medium text-gray-700">Safety:</span> {audit.safety_assessment}</p>
                                </div>
                                {audit.comments && (
                                    <p className="mt-2 text-gray-600 italic">"{audit.comments}"</p>
                                )}
                            </div>

                            <div className="flex space-x-3 w-full md:w-auto">
                                <button 
                                    onClick={() => handleUpdateStatus(audit.id, 'Approved')}
                                    className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(audit.id, 'Rejected')}
                                    className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModerationPage;
import React, { useEffect, useState } from 'react';
import { getSiteVisits } from '../../services/siteVisit.service';
import { format } from 'date-fns';
import { Clock, Phone, User, Search, MapPin, Loader2 } from 'lucide-react';

export default function Sitevisits() {
    const [siteVisits, setSiteVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSiteVisits();
    }, []);

    const fetchSiteVisits = async () => {
        try {
            setLoading(true);
            const response = await getSiteVisits();
            if (response.success) {
                setSiteVisits(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch site visits:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVisits = siteVisits.filter(visit =>
        visit.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.phone?.includes(searchTerm) ||
        visit.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Site Visits</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all customer site visits.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search leads, associates, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="h-full">
                    {filteredVisits.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredVisits.map((visit) => (
                                <div key={visit.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow flex flex-col h-full relative">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{visit.leadName}</h3>

                                    <div className="space-y-2 mt-3 mb-8">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{visit.phone}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span>{visit.user?.firstName} {visit.user?.lastName}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
                                        {visit.date ? format(new Date(visit.date), 'MMM dd, yyyy') : 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                            <p className="text-gray-500">No site visits found matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

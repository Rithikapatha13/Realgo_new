import { useState } from "react";
import { useReportSales } from "../../hooks/useReports";
import { useGetAllProjects } from "../../hooks/useProject";
import { exportToExcel, printHTMLTable } from "../../utils/exportExcel";
import { Download, Printer, Search } from "lucide-react";

export default function SalesReport() {
    const [filters, setFilters] = useState({
        project: "",
        status: "all",
        id: "", // Associate ID
        teamHeadId: "",
        startDate: "",
        endDate: "",
    });

    const { data, isLoading } = useReportSales(filters);
    const { data: projectsData } = useGetAllProjects();

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = () => {
        if (data?.items) {
            exportToExcel(data.items, "Sales_Report.xlsx");
        }
    };

    const handlePrint = () => {
        if (data?.items) {
            printHTMLTable(data.items, "Sales Report");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold text-slate-900 mb-6">Sales Report</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Project</label>
                    <select
                        name="project"
                        value={filters.project}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="">All Projects</option>
                        {projectsData?.items?.map(proj => (
                            <option key={proj.id} value={proj.id}>{proj.projectName}</option>
                        ))}
                    </select>
                </div>

                <div className="w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="all">Booked & Registered</option>
                        <option value="BOOKED">Booked Only</option>
                        <option value="REGISTERED">Registered Only</option>
                    </select>
                </div>

                <div className="w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Associate ID</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="id"
                            value={filters.id}
                            onChange={handleFilterChange}
                            placeholder="Associate ID..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Team Head ID</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="teamHeadId"
                            value={filters.teamHeadId}
                            onChange={handleFilterChange}
                            placeholder="Team Head ID..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="w-40">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    />
                </div>

                <div className="w-40">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    />
                </div>

                <div className="flex gap-2">
                    <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
                        <Printer size={16} /> Print
                    </button>
                    <button
                        onClick={() => setFilters({ project: "", status: "all", id: "", teamHeadId: "", startDate: "", endDate: "" })}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Project Name</th>
                                <th className="px-6 py-4">Plot Number</th>
                                <th className="px-6 py-4">Facing</th>
                                <th className="px-6 py-4">Sqr. Yards</th>
                                <th className="px-6 py-4">Customer Name</th>
                                <th className="px-6 py-4">Customer Phone</th>
                                <th className="px-6 py-4">Associate</th>
                                <th className="px-6 py-4">Team Head</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-8 text-center text-slate-500">Loading records...</td>
                                </tr>
                            ) : data?.items?.length > 0 ? (
                                data.items.map((plot, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{plot.projectName}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.plotNumber}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.facing || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.sqrYards}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.customerName || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.customerPhone || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.name || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.teamHeadName || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{plot.date || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plot.status === 'REGISTERED' ? 'bg-primary-100 text-primary-800' :
                                                    plot.status === 'BOOKED' ? 'bg-primary-500/10 text-primary-700' :
                                                        'bg-slate-100 text-slate-800'
                                                }`}>
                                                {plot.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-8 text-center text-slate-500">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {data?.items?.length > 0 && (
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-sm text-slate-500">
                        Showing {data.items.length} records.
                    </div>
                )}
            </div>
        </div>
    );
}

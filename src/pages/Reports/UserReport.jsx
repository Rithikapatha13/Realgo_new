import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useReportUsers } from "../../hooks/useReports";
import { useGetAllRoles } from "../../hooks/useRoles";
import { exportToExcel, printHTMLTable } from "../../utils/exportExcel";
import { Download, Printer, Search, ArrowLeft } from "lucide-react";

export default function UserReport() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        userId: "",
        active: "ALL",
        designation: "",
        startDate: "",
        endDate: "",
    });

    const { data, isLoading } = useReportUsers(filters);
    const { data: rolesData } = useGetAllRoles();

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = () => {
        if (data?.items) {
            exportToExcel(data.items, "User_Report.xlsx");
        }
    };

    const handlePrint = () => {
        if (data?.items) {
            printHTMLTable(data.items, "Users Report");
        }
    };

    return (
        <div className="p-6">
            
            <h1 className="text-xl font-semibold text-slate-900 mb-6">Users Report</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Search Target User ID</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            name="userId"
                            value={filters.userId}
                            onChange={handleFilterChange}
                            placeholder="Enter User Auth ID..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="w-full sm:w-40">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                    <select
                        name="active"
                        value={filters.active}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="PENDING">Pending</option>
                        <option value="HOLD">Hold</option>
                        <option value="REJECT">Reject</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="w-full sm:w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Designation</label>
                    <select
                        name="designation"
                        value={filters.designation}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="">All Designations</option>
                        {rolesData?.items?.map(role => (
                            <option key={role.id} value={role.id}>{role.roleName}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-40">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    />
                </div>

                <div className="w-full sm:w-40">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button onClick={handleExport} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handlePrint} className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center justify-center gap-2">
                        <Printer size={16} /> Print
                    </button>
                    <button
                        onClick={() => setFilters({ userId: "", active: "ALL", designation: "", startDate: "", endDate: "" })}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 justify-center flex"
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
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Auth ID</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Upliner</th>
                                <th className="px-6 py-4">Team Head</th>
                                <th className="px-6 py-4">Joining Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-slate-500">Loading records...</td>
                                </tr>
                            ) : data?.items?.length > 0 ? (
                                data.items.map((user, idx) => (
                                    <tr key={user.id || idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.userAuthId || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.phone}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.title || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.referrer_name || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.teamHeadName || "-"}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.joining_date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                                user.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-slate-500">No records found.</td>
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

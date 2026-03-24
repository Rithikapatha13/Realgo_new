import React, { useState, useEffect } from "react";
import { useGetProjectById } from "@/hooks/useProject";
import { updateProject, getAllHighways } from "../../services/project.service";
import FileInput from "../../components/Common/FileUpload";
import {
    MapPin,
    CheckCircle2,
    FileText,
    Download,
    ExternalLink,
    Layers,
    Info,
    Navigation,
    Sparkles,
    Building,
    ShieldCheck,
    ChevronRight,
    Pencil,
    Save,
    X,
    Plus,
    Trash2,
    Video,
    Smartphone,
    Globe,
    Settings
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectDetails = ({ projectId, onClose }) => {
    const { data: response, isLoading, refetch } = useGetProjectById(projectId);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [highways, setHighways] = useState([]);

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

    const parseData = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return data ? [data] : [];
        }
    };

    useEffect(() => {
        if (response?.project) {
            const p = response.project;
            setFormData({
                ...p,
                sliders: parseData(p.sliders),
                images: parseData(p.images),
                brochures: parseData(p.brochures),
                flyers: parseData(p.flyers),
                videos: parseData(p.videos),
                layoutImage: parseData(p.layoutImage),
                highlights: parseData(p.highlights),
                approvals: parseData(p.approvals),
                approvalCopies: parseData(p.approvalCopies),
                amenities: parseData(p.amenities),
                incentivesLevel: parseData(p.incentivesLevel),
                qrCode: parseData(p.qrCode),
            });
        }
    }, [response]);

    useEffect(() => {
        if (isEditing) {
            fetchHighways();
        }
    }, [isEditing]);

    const fetchHighways = async () => {
        try {
            const res = await getAllHighways();
            if (res.success) setHighways(res.items);
        } catch (error) {
            console.error("Error fetching highways:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await updateProject(projectId, formData);
            if (res.success) {
                toast.success("Project updated successfully");
                setIsEditing(false);
                refetch();
            } else {
                toast.error(res.message || "Failed to update project");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating the project");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium">Loading project information...</p>
            </div>
        );
    }

    const project = response?.project;
    if (!project) return <div className="p-20 text-center text-slate-500 font-medium">Project not found</div>;

    if (isEditing && formData) {
        return (
            <div className="max-h-[85vh] overflow-y-auto p-8 space-y-12 bg-white rounded-2xl hide-scrollbar">
                {/* 1. Header with Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-500/10 rounded-2xl">
                            <Settings className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Venture Editor</h2>
                            <p className="text-slate-500 text-sm font-medium">Update media assets and project specifications.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary-600 text-white px-8 py-2.5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 hover:shadow-primary-500/30 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Update Project
                        </button>
                    </div>
                </div>

                {/* 2. Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-primary-600 pl-3">
                            Core Specifications
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Project Name</label>
                                <input
                                    name="projectName"
                                    value={formData.projectName || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Highway / Region</label>
                                <select
                                    name="highwayId"
                                    value={formData.highwayId || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium bg-white"
                                >
                                    <option value="">Select Highway</option>
                                    {highways.map(h => (
                                        <option key={h.id} value={h.id}>{h.highwayName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Site Address</label>
                                <textarea
                                    name="projectAddress"
                                    value={formData.projectAddress || ""}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Venture Description</label>
                                <textarea
                                    name="projectDescription"
                                    value={formData.projectDescription || ""}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* External Connections */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                            Direct Connections
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Latitude</label>
                                    <input
                                        name="latitude"
                                        value={formData.latitude || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                        placeholder="e.g. 17.3850"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Longitude</label>
                                    <input
                                        name="longitude"
                                        value={formData.longitude || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                        placeholder="e.g. 78.4867"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Virtual Tour URL</label>
                                <div className="relative">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        name="projectVirtualViewLink"
                                        value={formData.projectVirtualViewLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                        placeholder="https://my.matterport.com/..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Official Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        name="projectWebsiteUrl"
                                        value={formData.projectWebsiteUrl || ""}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                        placeholder="https://www.projectwebsite.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Media Assets */}
                <div className="space-y-10 pt-6">
                    <section>
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                            Primary Media Assets
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FileInput
                                label="Main Cover Image"
                                helperText="The primary image seen on the project list."
                                existingFile={formData.projectImage}
                                onChange={(e) => setFormData(p => ({ ...p, projectImage: e.target.value }))}
                            />
                            <FileInput
                                label="Layout Map / Master Plan"
                                helperText="Technical layout image of the venture."
                                existingFile={formData.layoutImage?.[0]}
                                onChange={(e) => setFormData(p => ({ ...p, layoutImage: [e.target.value] }))}
                            />
                            <FileInput
                                label="Venture QR Code"
                                helperText="QR code for site location or booking."
                                existingFile={formData.qrCode?.[0]}
                                onChange={(e) => setFormData(p => ({ ...p, qrCode: [e.target.value] }))}
                            />
                        </div>
                    </section>

                    {/* Gallery Sections (Arrays) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Sliders Editor */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Project Sliders</h4>
                                <button onClick={() => addArrayItem('sliders')} className="text-primary-600 font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add Slider
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.sliders.map((s, i) => (
                                    <div key={i} className="relative group">
                                        <FileInput
                                            existingFile={s}
                                            onChange={(e) => handleArrayChange('sliders', i, e.target.value)}
                                        />
                                        <button
                                            onClick={() => removeArrayItem('sliders', i)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images Editor */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Gallery Images</h4>
                                <button onClick={() => addArrayItem('images')} className="text-primary-600 font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add Image
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.images.map((s, i) => (
                                    <div key={i} className="relative group">
                                        <FileInput
                                            existingFile={s}
                                            onChange={(e) => handleArrayChange('images', i, e.target.value)}
                                        />
                                        <button
                                            onClick={() => removeArrayItem('images', i)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resources (Brochures & Flyers) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Brochures Editor */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Brochures (PDF)</h4>
                                <button onClick={() => addArrayItem('brochures')} className="text-primary-600 font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add Brochure
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.brochures.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <FileInput
                                                accept=".pdf"
                                                existingFile={s}
                                                onChange={(e) => handleArrayChange('brochures', i, e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeArrayItem('brochures', i)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Flyers Editor */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Marketing Flyers</h4>
                                <button onClick={() => addArrayItem('flyers')} className="text-primary-600 font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add Flyer
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.flyers.map((s, i) => (
                                    <div key={i} className="relative group">
                                        <FileInput
                                            existingFile={s}
                                            onChange={(e) => handleArrayChange('flyers', i, e.target.value)}
                                        />
                                        <button
                                            onClick={() => removeArrayItem('flyers', i)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Technical Documents (Approvals) */}
                    <div className="space-y-6 pt-6 border-t">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Technical Approvals & Documentation
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Approvals Titles */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-600">Approval Labels</h4>
                                    <button onClick={() => addArrayItem('approvals')} className="text-primary-600 text-[10px] font-black uppercase hover:underline flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Add Label
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.approvals.map((ap, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                value={ap}
                                                onChange={(e) => handleArrayChange('approvals', i, e.target.value)}
                                                className="flex-1 px-4 py-2 border rounded-xl underline"
                                                placeholder="e.g. HMDA Approved"
                                            />
                                            <button onClick={() => removeArrayItem('approvals', i)} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Approval Copies */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-600">Approval Copies (Image/PDF)</h4>
                                    <button onClick={() => addArrayItem('approvalCopies')} className="text-primary-600 text-[10px] font-black uppercase hover:underline flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Add Copy
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.approvalCopies.map((ap, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <FileInput
                                                    existingFile={ap}
                                                    onChange={(e) => handleArrayChange('approvalCopies', i, e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => removeArrayItem('approvalCopies', i)} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer sticky bar */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3 z-10 rounded-b-2xl shadow-lg -mx-8 -mb-8">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Back to View
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        );
    }

    const highlights = parseData(project.highlights);
    const approvals = parseData(project.approvals);
    const approvalCopies = parseData(project.approvalCopies);
    const locationHighlights = parseData(project.locationHighlights);
    const images = parseData(project.images);
    const sliders = parseData(project.sliders);
    const flyers = parseData(project.flyers);
    const brochures = parseData(project.brochures);
    const layoutImages = parseData(project.layoutImage);
    const videos = parseData(project.videos);
    const qrCodes = parseData(project.qrCode);

    return (
        <div className="max-h-[85vh] overflow-y-auto hide-scrollbar">
            {/* 1. Hero banner matching Projects.jsx card style */}
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
                <img
                    src={project.projectImage ? `${IMAGE_BASE_URL}/${project.projectImage}` : "https://via.placeholder.com/1200x600?text=Project+View"}
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-wider mb-2">
                            <Layers className="w-4 h-4" />
                            <span>{project.highway?.highwayName || "Venture"}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            {project.projectName}
                        </h2>
                        <div className="flex items-center gap-2 text-white/90 mt-1">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <p className="text-sm font-medium">{project.projectAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end mb-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-white transition-all duration-300 group"
                        >
                            <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Edit Project</span>
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Active Venture</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-1">

                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-12">

                    {/* About Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-primary-600" />
                            <h3 className="text-lg font-bold text-slate-800">Project Overview</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            {project.projectDescription || project.projectDesc || "This premium venture offers a unique opportunity for high-quality living with modern amenities and excellent connectivity."}
                        </p>
                    </section>

                    {/* 1. Venture Sliders */}
                    {sliders.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Project Sliders</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar">
                                {sliders.map((img, idx) => (
                                    <div key={idx} className="min-w-[300px] md:min-w-[500px] h-[200px] md:h-[300px] rounded-2xl overflow-hidden snap-start shadow-md border border-slate-100 flex-shrink-0">
                                        <img
                                            src={`${IMAGE_BASE_URL}/${img}`}
                                            className="w-full h-full object-cover"
                                            alt={`Slider ${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 2. Site Images */}
                    {images.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Layers className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Project Images</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar">
                                {images.map((img, idx) => (
                                    <div key={idx} className="min-w-[200px] md:min-w-[320px] h-[160px] md:h-[220px] rounded-2xl overflow-hidden snap-start shadow-sm border border-slate-100 flex-shrink-0">
                                        <img
                                            src={`${IMAGE_BASE_URL}/${img}`}
                                            className="w-full h-full object-cover"
                                            alt={`Image ${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. Layout Images / Master Plan */}
                    {layoutImages.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Navigation className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Layout & Master Plan</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar">
                                {layoutImages.map((img, idx) => (
                                    <div key={idx} className="min-w-[280px] md:min-w-[450px] h-[180px] md:h-[280px] rounded-2xl overflow-hidden snap-start shadow-sm border border-slate-100 flex-shrink-0 bg-slate-50">
                                        <img
                                            src={`${IMAGE_BASE_URL}/${img}`}
                                            className="w-full h-full object-contain"
                                            alt={`Layout ${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Highlights & Amenities */}
                    {highlights.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Amenities & Features</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-primary-200 group">
                                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Location Advantages */}
                    {locationHighlights.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Navigation className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Location Advantages</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {locationHighlights.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl group hover:shadow-sm transition-shadow">
                                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-primary-500" />
                                        <span className="text-sm font-medium text-slate-600 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Video Gallery */}
                    {videos.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <ExternalLink className="w-5 h-5 text-primary-600" />
                                <h3 className="text-lg font-bold text-slate-800">Project Videos</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {videos.map((vid, idx) => (
                                    <div key={idx} className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.open(`${IMAGE_BASE_URL}/${vid}`, "_blank")}
                                                className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm"
                                            >
                                                Play Video
                                            </button>
                                        </div>
                                        <video
                                            src={`${IMAGE_BASE_URL}/${vid}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Info Column */}
                <div className="space-y-6">

                    {/* Quick Stats Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Inventory Status</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-bold">{project.availablePlots || 0}</span>
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Plots Remaining</span>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                {[
                                    { label: "Compliance", val: "Approved", icon: ShieldCheck },
                                    { label: "Structure", val: "Verified", icon: Building },
                                    { label: "Bank Loan", val: "Available", icon: CheckCircle2 }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full -translate-y-16 translate-x-16"></div>
                    </div>

                    {/* 4. Brochure Cabinet */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4 mt-8">Brochures Cabinet</h4>
                        {brochures.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {brochures.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={`${IMAGE_BASE_URL}/${doc}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-primary-200 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg group-hover:scale-105 transition-transform">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">E-Brochure {brochures.length > 1 ? `#${idx + 1}` : ""}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Download PDF</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic px-2">No brochures available.</p>
                        )}
                    </div>

                    {/* 5. Marketing Flyers */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4 mt-8">Marketing Flyers</h4>
                        {flyers.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {flyers.map((flyer, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => window.open(`${IMAGE_BASE_URL}/${flyer}`, "_blank")}
                                        className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-primary-300 transition-colors relative group"
                                    >
                                        <img src={`${IMAGE_BASE_URL}/${flyer}`} className="w-full h-full object-cover" alt={`Flyer ${idx}`} />
                                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ExternalLink className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic px-2">No flyers available.</p>
                        )}
                    </div>

                    {/* 6. Technical Approvals */}
                    {(approvals.length > 0 || approvalCopies.length > 0) && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4 mt-8">Technical Approvals</h4>
                            <div className="space-y-3">
                                {approvals.map((app, idx) => (
                                    <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl relative group">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                                                <p className="text-sm font-bold text-emerald-900">{app}</p>
                                            </div>
                                            {approvalCopies[idx] && (
                                                <button
                                                    onClick={() => window.open(`${IMAGE_BASE_URL}/${approvalCopies[idx]}`, "_blank")}
                                                    className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                                                    title="View Document"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QR Code Section */}
                    {qrCodes.length > 0 && (
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl mt-8">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Project QR Code</p>
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                                    <img src={`${IMAGE_BASE_URL}/${qrCodes[0]}`} className="w-full h-full object-contain" alt="QR Code" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`, "_blank")}
                                className="flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary-500/10 hover:border-primary-200 transition-all group"
                            >
                                <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Maps</span>
                            </button>
                            <button
                                disabled={!project.projectVirtualViewLink}
                                onClick={() => project.projectVirtualViewLink && window.open(project.projectVirtualViewLink, "_blank")}
                                className="flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary-500/10 hover:border-primary-200 transition-all group disabled:opacity-40"
                            >
                                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Virtual</span>
                            </button>
                        </div>
                        {project.projectWebsiteUrl && (
                            <button
                                onClick={() => window.open(project.projectWebsiteUrl, "_blank")}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary-500/10 hover:border-primary-200 transition-all group"
                            >
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visit Project Website</span>
                            </button>
                        )}
                        <button className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md hover:bg-primary-700 transition-all active:scale-[0.98] mt-4">
                            Contact Sales Team
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer sticky area */}
            <div className="mt-12 flex justify-center pb-8 border-t border-slate-100 pt-8">
                <button
                    onClick={onClose}
                    className="px-10 py-3 bg-slate-100 text-slate-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                    Close Detail View
                </button>
            </div>
        </div>
    );
};

export default ProjectDetails;

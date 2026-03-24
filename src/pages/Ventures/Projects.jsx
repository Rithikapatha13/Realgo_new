import React, { useState, useEffect } from "react";
import { getAllHighways, getProjects } from "../../services/project.service";
import { X, MapPin, Layout, Layers, Loader2 } from "lucide-react";
import ModalWrapper from "../../components/Common/ModalWrapper";
import ProjectDetails from "./ProjectDetails";

export default function Projects() {
  const [highways, setHighways] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHighwayId, setSelectedHighwayId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    fetchHighways();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [selectedHighwayId, searchQuery]);

  const fetchHighways = async () => {
    try {
      const response = await getAllHighways();
      if (response.success) {
        setHighways(response.items);
      }
    } catch (error) {
      console.error("Error fetching highways:", error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects({
        highwayId: selectedHighwayId,
        name: searchQuery
      });
      if (response.success) {
        setProjects(response.items);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (id) => {
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Venture Projects</h1>
          <p className="text-gray-500 font-medium">Explore premium real estate ventures across various highways.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Layout className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search ventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Highways Filter - Horizontal Scroll */}
      <div className="flex items-start gap-5 overflow-x-auto pb-4 hide-scrollbar">
        <div
          onClick={() => setSelectedHighwayId("")}
          className="flex flex-col items-center gap-3 cursor-pointer group min-w-[90px]"
        >
          <div className={`w-15 h-15 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm 
                        ${!selectedHighwayId
              ? 'border-primary-600 bg-primary-500/10 shadow-primary-500/20 scale-105'
              : 'border-gray-100 bg-white group-hover:border-primary-300 group-hover:bg-gray-50'}`}>
            <X className={`w-8 h-8 transition-colors duration-300 ${!selectedHighwayId ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${!selectedHighwayId ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'}`}>All</span>
        </div>

        {highways.map((highway) => (
          <div
            key={highway.id}
            onClick={() => setSelectedHighwayId(highway.id)}
            className="flex flex-col items-center gap-3 cursor-pointer group min-w-[90px]"
          >
            <div className={`w-15 h-15 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm
                            ${selectedHighwayId === highway.id
                ? 'border-primary-600 ring-4 ring-primary-500/10 scale-105 shadow-primary-500/20'
                : 'border-gray-100 group-hover:border-primary-300 group-hover:shadow-md'}`}>
              {highway.highwayIcon ? (
                <img
                  src={`${IMAGE_BASE_URL}/${highway.highwayIcon}`}
                  alt={highway.highwayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-primary-300">
                  <Layout className="w-8 h-8" />
                </div>
              )}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-center truncate w-24 transition-colors duration-300
                            ${selectedHighwayId === highway.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'}`}>
              {highway.highwayName}
            </span>
          </div>
        ))}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Fetching ventures for you...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 border border-gray-100 flex flex-col h-full cursor-pointer"
              onClick={() => handleExplore(project.id)}
            >
              {/* Image Wrapper */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.projectImage ? `${IMAGE_BASE_URL}/${project.projectImage}` : "https://via.placeholder.com/600x400?text=No+Venture+Image"}
                  alt={project.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Available Tag */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-black text-gray-800">
                    {project.availablePlots} <span className="font-bold text-gray-400 uppercase text-[10px] ml-1">Plots</span>
                  </span>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                {/* Quick Info overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                    {project.highway?.highwayName || "Special Project"}
                  </span>
                </div>
              </div>

              {/* Details section */}
              <div className="p-6 flex flex-col flex-grow bg-white">
                <div className="mb-4">
                  <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                    {project.projectName}
                  </h3>
                </div>

                <div className="flex items-start gap-2.5 text-gray-500 mb-6 flex-grow">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary-500" />
                  <p className="text-sm font-medium leading-relaxed line-clamp-2">{project.projectAddress}</p>
                </div>

                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Status</span>
                    <span className="text-sm font-bold text-green-600">Active Listing</span>
                  </div>
                  <button
                    className="bg-primary-600 text-gray-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 hover:shadow-primary-500/30 transition-all duration-300 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore(project.id);
                    }}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
            <Layout className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Ventures Found</h3>
          <p className="text-gray-500 font-medium">We couldn't find any projects matching your selection.</p>
          <button
            onClick={() => setSelectedHighwayId("")}
            className="mt-8 text-primary-600 font-bold hover:underline"
          >
            View all projects instead
          </button>
        </div>
      )}

      {/* Project Details Modal */}
      <ModalWrapper
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Project Preview"
        width="max-w-6xl"
      >
        <ProjectDetails
          projectId={selectedProjectId}
          onClose={() => setIsModalOpen(false)}
        />
      </ModalWrapper>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTeamTree } from '@/hooks/useTeam';
import { useGetUsersNames } from '@/hooks/useUser';
import { useGetAllRoles, useGetRoleById } from '@/hooks/useRoles';
import { getUser } from '@/services/auth.service';
import TeamTreeChart from '@/components/TeamTreeChart';
import { LoadingIndicator } from '@/components';
import { Check, ChevronsUpDown, X, Search, ZoomIn, ZoomOut, RotateCcw, Filter, Users } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const TeamTree = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  // Guard: Disable for Telecallers
  const roleName = (user?.role?.roleName || user?.role || "").toLowerCase();
  const isTelecallerRole = roleName.includes("telecaller") || roleName.includes("teelcaller");

  useEffect(() => {
    if (isTelecallerRole) {
      navigate('/myteam');
    }
  }, [isTelecallerRole, navigate]);

  const [id, setId] = useState(undefined);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('VERIFIED');
  const [roleId, setRoleId] = useState('');
  const [isAssociateOpen, setIsAssociateOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetTeamTree(id, status, roleId);

  const {
    data: usersData,
  } = useGetUsersNames();

  const {
    data: rolesData,
  } = useGetAllRoles();

  const userRoleId = user?.roleId || user?.role;
  const {
    data: roleData,
  } = useGetRoleById(userRoleId);

  const filteredUsers = usersData?.data?.items?.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const loggedUserRoleNumber = roleData?.items?.role || 0;
  const filteredRoles = rolesData?.roles?.filter(
    (item) => item.roleNo >= loggedUserRoleNumber
  ) || [];

  useEffect(() => {
    refetch();
  }, [id, status, roleId, refetch]);

  const handleNodeClick = (nodeId, nodeName) => {
    // Only update if it's a different node to avoid flickering
    if (id !== nodeId) {
      setId(nodeId);
      setUsername(nodeName);
      setRoleId('');
      // The useEffect will handle the refetch automatically
    }
  };

  const handleClearAll = () => {
    setUsername('');
    setRoleId('');
    setStatus('VERIFIED');
    setId(undefined);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) return <div className="p-6 text-red-500 text-center">Error fetching team data</div>;

  const teamData = response?.items;

  // Selected User Detail (from the tree response items)
  const findNodeById = (node, targetId) => {
    if (!node) return null;
    if (node.id === targetId) return node;
    if (node.childs) {
      for (let child of node.childs) {
        const found = findNodeById(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNodeById(teamData, id);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[9px] font-bold uppercase tracking-[0.1em] rounded">Platform</span>
              <span className="text-slate-300">/</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Team Hierarchy</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20">
               <Users size={20} />
             </div>
             Organization <span className="text-primary-600">Tree</span>
           </h1>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Associate Selector */}
          <div className="relative">
            <button
              onClick={() => { setIsAssociateOpen(!isAssociateOpen); setIsRoleOpen(false); }}
              className="h-11 bg-white border border-slate-200 rounded-2xl px-4 text-sm font-bold text-slate-700 hover:border-primary-400 transition-all flex items-center gap-2 min-w-[200px] justify-between shadow-sm"
            >
              <span className="truncate">{username || 'Search Associate'}</span>
              <ChevronsUpDown size={14} className="text-slate-400" />
            </button>

            {isAssociateOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search name..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {filteredUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { setId(u.id); setUsername(u.username); setIsAssociateOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between mb-1 ${id === u.id ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span>{u.username}</span>
                      {id === u.id && <Check size={14} />}
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">No Results Found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleClearAll}
            className="h-11 w-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
            title="Reset Tree"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* TREE CANVAS */}
        <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden relative group">
          <TransformWrapper
            initialScale={0.8}
            minScale={0.2}
            maxScale={3}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
                  <button onClick={() => zoomIn()} className="p-3 bg-white shadow-xl border border-slate-100 rounded-2xl text-slate-500 hover:bg-primary-500 hover:text-white transition-all">
                    <ZoomIn size={18} />
                  </button>
                  <button onClick={() => zoomOut()} className="p-3 bg-white shadow-xl border border-slate-100 rounded-2xl text-slate-500 hover:bg-primary-500 hover:text-white transition-all">
                    <ZoomOut size={18} />
                  </button>
                  <button onClick={() => resetTransform()} className="p-3 bg-white shadow-xl border border-slate-100 rounded-2xl text-slate-500 hover:bg-primary-500 hover:text-white transition-all">
                    <RotateCcw size={18} />
                  </button>
                </div>

                <TransformComponent wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing">
                  <div className="p-20 min-w-max min-h-max flex justify-center">
                    {!teamData ? (
                      <div className="flex flex-col items-center justify-center text-slate-300 py-40">
                         <Filter size={48} className="mb-4 opacity-20" />
                         <p className="font-bold uppercase tracking-widest text-[10px]">No tree data found</p>
                      </div>
                    ) : (
                      <TeamTreeChart data={teamData} onNodeClick={handleNodeClick} />
                    )}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* SIDE PANEL (DETAIL) */}
        {selectedNode && (
          <div className="w-80 bg-white rounded-[32px] border border-slate-200 shadow-xl p-6 animate-in slide-in-from-right duration-300 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Node Detail</h2>
              <button onClick={() => setId(undefined)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
            </div>

            <div className="flex flex-col items-center text-center py-4">
               <div className="w-24 h-24 rounded-full border-4 border-primary-50 p-1 mb-4 relative">
                  <img 
                    src={selectedNode.image || `https://ui-avatars.com/api/?name=${selectedNode.name}&background=6366f1&color=fff`} 
                    className="w-full h-full rounded-full object-cover shadow-inner"
                    alt="" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
               </div>
               <h3 className="text-lg font-bold text-slate-900">{selectedNode.name}</h3>
               <p className="text-primary-600 text-xs font-black uppercase tracking-widest mt-1">{selectedNode.title || 'Associate'}</p>
            </div>

            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{selectedNode.email || 'N/A'}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-sm font-bold text-slate-700">{selectedNode.phone || 'N/A'}</p>
               </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
               <button 
                  onClick={() => navigate(`/profile?id=${selectedNode.id}`)}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                 View Full Profile
               </button>
            </div>
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div className="mt-4 flex items-center justify-center gap-8 text-[9px] text-slate-400 font-bold tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50"></div>
          <span>Primary Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-px bg-slate-300"></div>
          <span>Direct Connection</span>
        </div>
      </div>
    </div>
  );
};

export default TeamTree;

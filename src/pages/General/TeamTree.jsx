import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTeamTree } from '@/hooks/useTeam';
import { useGetUsersNames } from '@/hooks/useUser';
import { useGetAllRoles, useGetRoleById } from '@/hooks/useRoles';
import { getUser } from '@/services/auth.service';
import TeamTreeChart from '@/components/TeamTreeChart';
import { LoadingIndicator } from '@/components';
import { Check, ChevronsUpDown, X, Search, Filter, ZoomIn, ZoomOut, RotateCcw, ArrowLeft } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const TeamTree = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  // Guard: Disable for Telecallers and Telecaller Admins
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
    isLoading: isLoadingUsers,
  } = useGetUsersNames();

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
  } = useGetAllRoles();

  const userRoleId = user?.roleId || user?.role; // Safety check

  const {
    data: roleData,
    isLoading: isPendingRole,
  } = useGetRoleById(userRoleId);

  // Filter users for the dropdown
  const filteredUsers = usersData?.data?.items?.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter roles
  const loggedUserRoleNumber = roleData?.items?.role || 0;
  const filteredRoles = rolesData?.roles?.filter(
    (item) => item.roleNo >= loggedUserRoleNumber
  ) || [];

  useEffect(() => {
    refetch();
  }, [id, status, roleId, refetch]);

  const handleNodeClick = (nodeId, nodeName) => {
    setId(nodeId);
    setUsername(nodeName);
    setRoleId('');
  };

  const handleClearAll = () => {
    setUsername('');
    setRoleId('');
    setStatus('VERIFIED');
    setId(undefined);
    setSearchTerm('');
  };

  if (isLoading || isLoadingRoles || isPendingRole) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) return <div className="p-6 text-red-500 text-center">Error fetching team data</div>;

  const teamData = Array.isArray(response?.items) ? response.items : [response?.items].filter(Boolean);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-4">
        
      </div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-primary-500 pl-4">Team Hierarchy</h1>
          <p className="text-slate-500 text-sm mt-1 ml-4">Analyze and manage your organization structure</p>
        </div>

        {/* FILTERS SECTION - TAILWIND ONLY */}
        <div className="flex flex-wrap items-center gap-3">
          {/* CUSTOM ASSOCIATE SELECT */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAssociateOpen(!isAssociateOpen);
                setIsRoleOpen(false);
              }}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all flex items-center gap-2 min-w-[160px] justify-between shadow-sm"
            >
              <span className="truncate">{username || 'Select Associate'}</span>
              <ChevronsUpDown size={16} className="text-slate-400" />
            </button>

            {isAssociateOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-xs text-slate-400 text-center">No results found</div>
                  ) : (
                    filteredUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setId(u.id);
                          setUsername(u.username);
                          setIsAssociateOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${id === u.id ? 'bg-primary-500/10 text-primary-500 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span>{u.username}</span>
                        {id === u.id && <Check size={14} />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CUSTOM DESIGNATION SELECT */}
          <div className="relative">
            <button
              onClick={() => {
                setIsRoleOpen(!isRoleOpen);
                setIsAssociateOpen(false);
              }}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all flex items-center gap-2 min-w-[140px] justify-between shadow-sm"
            >
              <span className="truncate">
                {roleId ? filteredRoles.find(r => r.id === roleId)?.roleName : 'Designation'}
              </span>
              <ChevronsUpDown size={16} className="text-slate-400" />
            </button>

            {isRoleOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => { setRoleId(''); setIsRoleOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 mb-1 font-semibold"
                >
                  All Designations
                </button>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredRoles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRoleId(r.id);
                        setIsRoleOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${roleId === r.id ? 'bg-primary-500/10 text-primary-500 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span>{r.roleName}</span>
                      {roleId === r.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleClearAll}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
            title="Clear Filters"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* CHART VIEWPORT */}
      <div className="w-full h-[calc(100vh-280px)] bg-white rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative group">
        {/* ZOOM CONTROLS - TAILWIND ONLY */}
        <div className="absolute right-6 top-6 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button id="zoom-in" className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 text-slate-600 hover:bg-primary-500 hover:text-white transition-all ring-1 ring-black/5">
            <ZoomIn size={20} />
          </button>
          <button id="zoom-out" className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 text-slate-600 hover:bg-primary-500 hover:text-white transition-all ring-1 ring-black/5">
            <ZoomOut size={20} />
          </button>
          <button id="reset-zoom" className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 text-slate-600 hover:bg-primary-500 hover:text-white transition-all ring-1 ring-black/5">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="w-full h-full">
          {!response || (Array.isArray(response?.items) && response.items.length === 0) ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Filter size={32} />
              </div>
              <p className="font-medium">No results found for the selected criteria</p>
              <button onClick={handleClearAll} className="mt-4 text-sm text-primary-500 font-semibold hover:underline">
                Reset Filters
              </button>
            </div>
          ) : (
            <TransformWrapper
              initialScale={1}
              minScale={0.2}
              maxScale={3}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => {
                // Re-attaching events to buttons (hacky but works with Tailwind bits)
                useEffect(() => {
                  const zin = document.getElementById('zoom-in');
                  const zout = document.getElementById('zoom-out');
                  const rz = document.getElementById('reset-zoom');
                  if (zin) zin.onclick = () => zoomIn();
                  if (zout) zout.onclick = () => zoomOut();
                  if (rz) rz.onclick = () => resetTransform();
                }, []);

                return (
                  <TransformComponent wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing">
                    <div className="p-10 min-w-max min-h-max">
                      {teamData.map((data, index) => (
                        <div key={index} className="mb-12 last:mb-0">
                          <TeamTreeChart data={data} onNodeClick={handleNodeClick} />
                        </div>
                      ))}
                    </div>
                  </TransformComponent>
                );
              }}
            </TransformWrapper>
          )}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 flex items-center justify-center gap-12 text-[10px] text-slate-400 font-bold tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
          <span>Manager</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <span>Associate</span>
        </div>
      </div>
    </div>
  );
};

export default TeamTree;

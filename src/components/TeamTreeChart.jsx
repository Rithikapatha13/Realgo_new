import React from 'react';
import { toTitleCase } from '@/constants/common';

const TeamTreeChart = ({ data, onNodeClick }) => {
    if (!data) return null;

    const renderNode = (node) => {
        return (
            <div className="flex flex-col items-center" key={node.id}>
                {/* NODE CARD */}
                <div className="p-1 mx-2 shadow-sm cursor-pointer flex flex-col items-center gap-0 lg:gap-1 group">
                    <div
                        className="relative"
                        onClick={() => node.id && onNodeClick(node.id, node.name)}
                    >
                        <img
                            src={node.image || `https://ui-avatars.com/api/?name=${node.name || 'User'}`}
                            alt={node.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white p-0.5 object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-s-4 border-e-4 border-blue-500 opacity-70"></div>
                        </div>
                    </div>
                    <div
                        className="flex flex-col justify-center items-center text-center mt-2 px-3 py-1 bg-white rounded-xl shadow-sm border border-slate-100"
                        onClick={() => node.id && onNodeClick(node.id, node.name)}
                    >
                        <div className="text-xs md:text-sm font-bold text-slate-800">
                            {toTitleCase(node.name)}
                        </div>
                        <div className="text-[9px] sm:text-xs text-white bg-blue-600 rounded-full px-2 py-0.5 mt-1 font-medium ring-2 ring-blue-100">
                            {toTitleCase(node.title || node.actor || "No Role")}
                        </div>
                        <div className="text-[9px] sm:text-xs text-slate-400 mt-1 font-mono">
                            {node.user_auth_id || node.id?.substring(0, 8)}
                        </div>
                    </div>
                </div>

                {/* CHILDREN */}
                {node.childs && node.childs.length > 0 && (
                    <div className="flex flex-row mt-10 relative">
                        {/* Vertical line from parent down to the horizontal line */}
                        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-px h-[40px] bg-slate-300"></div>

                        {node.childs.map((child, index) => (
                            <div key={child.id} className="relative px-2 flex flex-col items-center">
                                {/* Horizontal line segments */}
                                {node.childs.length > 1 && (
                                    <div className={`absolute top-0 h-px bg-slate-300 
                                        ${index === 0 ? 'left-1/2 right-0' : index === node.childs.length - 1 ? 'left-0 right-1/2' : 'left-0 right-0'}
                                    `}></div>
                                )}

                                {/* Vertical line from horizontal branch down to the child node */}
                                <div className="w-px h-10 bg-slate-300"></div>

                                {renderNode(child)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="inline-block min-w-full p-8 overflow-visible">
            <div className="flex justify-center">
                {renderNode(data)}
            </div>
        </div>
    );
};

export default TeamTreeChart;

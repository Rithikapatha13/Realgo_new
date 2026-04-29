import React from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { toTitleCase } from '@/constants/common';
import { resolveImageUrl } from '@/utils/common';

const TeamTreeChart = ({ data, onNodeClick }) => {
  if (!data) return null;

  // Transform backend 'childs' to react-orgchart 'children'
  const transformNode = (node) => {
    return {
      ...node,
      name: node.name || node.username || "User",
      actor: node.title || node.role?.displayName || node.role?.roleName || "Associate",
      children: (node.childs || []).map(transformNode)
    };
  };

  const chartData = transformNode(data);

  const MyNodeComponent = ({ node }) => (
    <div className="p-1 mx-2 shadow-sm cursor-pointer flex flex-col items-center gap-0 lg:gap-1 group">
      <div
        className="relative"
        onClick={() => node.id && onNodeClick(node.id, node.name)}
      >
        <img
          src={resolveImageUrl(node.image) || `https://ui-avatars.com/api/?name=${node.name}`}
          alt={node.name}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white p-0.5 object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-s-4 border-e-4 border-primary-500 opacity-70"></div>
        </div>
      </div>
      <div
        className="flex flex-col justify-center items-center text-center mt-2 px-3 py-1 bg-white rounded-xl shadow-sm border border-slate-100 min-w-[120px]"
        onClick={() => node.id && onNodeClick(node.id, node.name)}
      >
        <div className="text-xs md:text-sm font-bold text-slate-800">
          {toTitleCase(node.name)}
        </div>
        <div className="text-[9px] sm:text-xs text-white bg-primary-600 rounded-full px-2 py-0.5 mt-1 font-medium ring-2 ring-primary-100">
          {toTitleCase(node.actor)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-tree-container">
      <OrgChart tree={chartData} NodeComponent={MyNodeComponent} />
      <style>{`
        .orgNodeChildGroup .node {
           padding: 0 !important;
           border: none !important;
           display: inline-block !important;
        }
        .orgNodeChildGroup .connectorLine {
           background-color: #cbd5e1 !important; /* slate-300 */
        }
        .orgNodeChildGroup .horizontalConnector {
           border-top: 1px solid #cbd5e1 !important;
        }
        .orgNodeChildGroup .verticalConnector {
           border-left: 1px solid #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
};

export default TeamTreeChart;

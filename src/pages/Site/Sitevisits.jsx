import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Sitevisits() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      
      <div>Site Visits</div>
    </div>
  );
}

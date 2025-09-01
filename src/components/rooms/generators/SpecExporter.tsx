'use client';

import React, { useState } from 'react';
import { Download, Mail, FileText, Check, AlertCircle } from 'lucide-react';
import { UnifiedRoomData } from './shared/types';
import { AIContentEngine } from './AIContentEngine';

interface SpecExporterProps {
  roomData: Partial<UnifiedRoomData>;
  onExport: (type: 'download' | 'email') => void;
}

export function SpecExporter({ roomData, onExport }: SpecExporterProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generatePDFContent = (): string => {
    const aiEngine = new AIContentEngine();
    const responses = {
      challenge: roomData.purpose || '',
      audience: roomData.targetAudience || '',
      impact: roomData.expectedOutcomes?.[0] || '',
      approach: roomData.description || ''
    };
    
    const sections = aiEngine.generateFullSpec(responses);
    
    let content = `
# ${roomData.name || 'Focus Room'} Specification

**Generated:** ${new Date().toLocaleDateString()}
**Category:** ${roomData.category || 'Community Building'}
**Completeness:** ${roomData.completeness || 85}%

---

## Executive Summary

This Focus Room specification outlines a comprehensive approach to ${roomData.purpose?.toLowerCase() || 'community collaboration'}. Designed for ${roomData.targetAudience?.toLowerCase() || 'community members'}, this space will facilitate meaningful collaboration and measurable impact.

**Key Outcomes:**
${roomData.expectedOutcomes?.map(outcome => `- ${outcome}`).join('\n') || '- Enhanced community collaboration\n- Measurable progress toward shared goals'}

---

`;

    sections.forEach(section => {
      content += `## ${section.title}\n\n${section.content}\n\n---\n\n`;
    });

    content += `
## Implementation Roadmap

### Phase 1: Setup (Weeks 1-2)
- Recruit initial participants
- Set up digital platform
- Establish communication channels
- Create resource library foundation

### Phase 2: Launch (Weeks 3-6)
- Begin regular activities
- Refine processes based on feedback
- Build participation momentum
- Track initial outcomes

### Phase 3: Growth (Weeks 7-12)
- Expand participation
- Develop leadership pipeline
- Measure and report impact
- Plan for sustainability

---

## Contact Information

For questions about this specification or implementation support:
- **Admin:** mike@kamunityconsulting.com
- **Platform:** kamunitydemo.org
- **Community:** kamunity.org

---

*This specification was generated using the Kamunity Focus Room Designer. Visit kamunitydemo.org to create your own community space.*
`;

    return content;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    onExport('download');
    
    try {
      const content = generatePDFContent();
      
      // Create downloadable file
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${roomData.name?.replace(/\s+/g, '_') || 'focus_room'}_specification.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('📧 SpecExporter download error:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔘 SpecExporter email submit clicked!', { email: email.trim() });
    
    if (!email.trim()) {
      console.log('⚠️ No email provided, returning early');
      return;
    }
    
    setIsGenerating(true);
    onExport('email');
    
    try {
      const content = generatePDFContent();
      
      console.log('📧 Calling /api/demo/spec-email endpoint');
      
      const response = await fetch('/api/demo/spec-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          roomName: roomData.name,
          specification: content,
          roomData: roomData
        })
      });

      console.log('📡 Spec email API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 Spec email API error:', errorText);
        throw new Error(`Failed to send specification email: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('📡 Spec email API response:', responseData);
      
      setExportStatus('success');
      setShowEmailForm(false);
      setEmail('');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('📧 SpecExporter email error:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showEmailForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Email Specification</h3>
          <p className="text-gray-600 mb-4">
            We'll send the complete Focus Room specification to your email and notify our team.
          </p>
          
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isGenerating || !email.trim()}
              >
                {isGenerating ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : exportStatus === 'success' ? (
          <>
            <Check className="w-4 h-4" />
            Downloaded
          </>
        ) : exportStatus === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4" />
            Error
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download
          </>
        )}
      </button>
      
      <button
        onClick={() => setShowEmailForm(true)}
        disabled={isGenerating}
        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <Mail className="w-4 h-4" />
        Email
      </button>
      
      {exportStatus === 'success' && (
        <div className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Export successful!
        </div>
      )}
      
      {exportStatus === 'error' && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Export failed
        </div>
      )}
    </div>
  );
}

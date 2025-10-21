'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Copy } from 'lucide-react';
import { api } from '@/lib/api';

export default function AnswerForm({ questionId, onAnswerSubmitted }) {
  const [body, setBody] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [pasteDetected, setPasteDetected] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const tabLeaveTimeRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  useEffect(() => {
    // Start heartbeat
    startHeartbeat();

    // Tab visibility detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabLeaveTimeRef.current = Date.now();
      } else {
        if (tabLeaveTimeRef.current) {
          const timeAway = Date.now() - tabLeaveTimeRef.current;
          if (timeAway > 5000) {
            // User was away for more than 5 seconds
            resetForm();
            showToast('Session expired. Please stay active while answering.', 'warning');
            setTabSwitchWarning(true);
          }
          tabLeaveTimeRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopHeartbeat();
    };
  }, []);

  function startHeartbeat() {
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        await api.ping();
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 4000);
  }

  function stopHeartbeat() {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  }

  function resetForm() {
    setBody('');
    setReasoning('');
    setPasteDetected(false);
  }

  function handlePaste(e) {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.length > 50) {
      setPasteDetected(true);
      showToast('Copied text detected — reduced rewards possible.', 'warning');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!body.trim() || !reasoning.trim()) {
      showToast('Please fill in both answer and reasoning fields.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await api.createAnswer(questionId, {
        body: body.trim(),
        reasoning: reasoning.trim(),
        pasteDetected,
      });

      showToast('Answer submitted successfully!', 'success');
      resetForm();
      setTabSwitchWarning(false);
      
      if (onAnswerSubmitted) {
        onAnswerSubmitted();
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit answer', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function showToast(message, type = 'info') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>

      {tabSwitchWarning && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Session was reset</strong> because you left the tab for more than 5 seconds. 
            Please stay active while answering to ensure quality responses.
          </div>
        </div>
      )}

      {pasteDetected && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3">
          <Copy className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-800">
            <strong>Copied content detected.</strong> Pasted answers may receive reduced rewards (50% less).
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Answer
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onPaste={handlePaste}
            className="input min-h-[120px] resize-y"
            placeholder="Write your answer here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Explain Your Reasoning <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            onPaste={handlePaste}
            className="input min-h-[100px] resize-y"
            placeholder="Explain why your answer is correct and how you arrived at it..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps verify the authenticity of your answer and improves your reward potential.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-yellow-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

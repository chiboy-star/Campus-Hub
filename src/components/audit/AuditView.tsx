import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Copy, Check, Search, Shield, Filter } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const AuditView: React.FC = () => {
  const { auditLogs, showToast } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast({
      type: 'info',
      title: 'Copied Reference',
      description: `Copied ${text} to clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = auditLogs.filter(
    log =>
      log.auditId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (log.bookingId && log.bookingId.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Immutable System Audit Log
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald/20 text-emerald font-semibold">
              NFR-07 Audit Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident chronological event trail for every state transition, approval, rejection, and bursary calculation.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter audit entries or IDs..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor (User ID)</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Associated Token</th>
                <th className="py-2.5 px-3 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.auditId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {log.auditId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-semibold text-oxford dark:text-slate-200">
                      {log.userId}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300 max-w-md">
                    <div>{log.action}</div>
                    {log.details && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {log.details}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {log.bookingId ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {log.bookingId}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleCopy(`${log.auditId}: ${log.action}`)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Copy audit entry"
                    >
                      {copiedId === `${log.auditId}: ${log.action}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

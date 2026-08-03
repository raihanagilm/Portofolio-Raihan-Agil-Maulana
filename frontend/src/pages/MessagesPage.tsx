import React, { useState } from 'react';
import { mockMessages } from '../data/mockData';
import type { Message } from '../types';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0] || null);

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: true } : null));
    }
  };

  const deleteMsg = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage(updated[0] || null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-background">Manajemen Pesan</h1>
        <p className="text-sm text-secondary">Pesan dan pertanyaan yang dikirim pengunjung melalui website portofolio Anda.</p>
      </div>

      {/* Inbox split view matching Stitch Screen 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List Panel */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold text-sm text-on-background">Kotak Masuk ({messages.length})</h3>
          </div>

          <div className="divide-y divide-outline-variant max-h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  markAsRead(msg.id);
                }}
                className={`p-4 cursor-pointer transition-all hover:bg-surface-container-high/40 ${
                  selectedMessage?.id === msg.id ? 'bg-primary-fixed/30 border-l-4 border-primary' : ''
                } ${!msg.is_read ? 'font-semibold' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-on-background truncate max-w-[140px]">{msg.sender_name}</span>
                  <span className="text-[10px] text-secondary">{new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <p className="text-xs text-primary truncate mb-0.5">{msg.subject}</p>
                <p className="text-xs text-secondary line-clamp-1">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail View Panel */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-outline-variant pb-4">
                <div>
                  <h2 className="text-lg font-bold text-on-background mb-1">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span className="font-semibold text-on-surface">{selectedMessage.sender_name}</span>
                    <span>({selectedMessage.sender_email})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMsg(selectedMessage.id)}
                    className="p-2 text-secondary hover:text-error rounded-lg"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              <div className="text-sm text-on-background leading-relaxed whitespace-pre-line p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                {selectedMessage.message}
              </div>

              {/* Reply Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.sender_email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">reply</span>
                  <span>Balas via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-secondary space-y-2">
              <span className="material-symbols-outlined text-4xl">mail</span>
              <p className="text-xs">Pilih pesan dari daftar untuk melihat detail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

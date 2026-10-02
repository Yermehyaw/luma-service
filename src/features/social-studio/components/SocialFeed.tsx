'use client';

import React, { useState } from 'react';
import { CustomerMessage, SocialPost } from '../../../types/social';
import { MessageSquare, Send, Sparkles, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

interface SocialFeedProps {
  posts: SocialPost[];
  messages: CustomerMessage[];
  onReply?: (id: string, text: string) => void;
  onCreatePost?: (content: string, platform: SocialPost['platform']) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ posts, messages, onReply, onCreatePost }) => {
  const [newPostText, setNewPostText] = useState('');
  const [platform, setPlatform] = useState<SocialPost['platform']>('twitter');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    if (onCreatePost) onCreatePost(newPostText, platform);
    setNewPostText('');
  };

  const getPlatformIcon = (plat: SocialPost['platform']) => {
    switch (plat) {
      case 'twitter': return <Twitter className="h-4 w-4 text-sky-500" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Social Publisher */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Social Studio Studio Publisher
          </h3>

          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Broadcast branch queue updates or announcements..."
              className="h-28 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-[var(--tenant-primary,#0057B8)] focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPost['platform'])}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <option value="twitter">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-[var(--tenant-primary,#0057B8)] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                <Send className="h-3.5 w-3.5" />
                Publish Post
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Broadcasts</h4>
          {posts.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  {getPlatformIcon(p.platform)}
                  {p.authorName}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{p.status}</span>
              </div>
              <p className="mt-2 text-slate-600">{p.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Care Inbox & AI Sentiment */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <MessageSquare className="h-4 w-4 text-[var(--tenant-primary,#0057B8)]" />
          Customer Care & Sentiment Radar
        </h4>

        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">{m.authorName}</span>
                {m.handle && <span className="ml-2 text-[11px] text-slate-400">{m.handle}</span>}
              </div>
              {m.sentimentScore !== undefined && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    m.sentimentScore > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  Sentiment: {m.sentimentScore > 0 ? 'Positive' : 'Negative'} ({m.sentimentScore})
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{m.body}</p>

            {m.reply ? (
              <div className="border-l-2 border-[var(--tenant-primary,#0057B8)] pl-3 text-xs text-slate-500">
                <span className="font-bold text-slate-700">Replied: </span>
                {m.reply}
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type AI smart reply..."
                  value={replyText[m.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [m.id]: e.target.value })}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                />
                <button
                  onClick={() => {
                    if (onReply && replyText[m.id]) {
                      onReply(m.id, replyText[m.id]);
                      setReplyText({ ...replyText, [m.id]: '' });
                    }
                  }}
                  className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

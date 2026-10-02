'use client';

import React, { useState } from 'react';
import { TenantStaffLayout } from '../../../../../components/layouts/TenantStaffLayout';
import { SocialFeed } from '../../../../../features/social-studio/components/SocialFeed';
import { MOCK_MESSAGES, MOCK_SOCIAL_POSTS } from '../../../../../mock/social';
import { SocialPost, CustomerMessage } from '../../../../../types/social';
import { FeatureGate } from '../../../../../lib/feature-flags';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function SocialStudioPage() {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [messages, setMessages] = useState<CustomerMessage[]>(MOCK_MESSAGES);

  const handleCreatePost = (content: string, platform: SocialPost['platform']) => {
    const newP: SocialPost = {
      id: `post_${Date.now()}`,
      tenantId: 'tenant_001',
      content,
      platform,
      status: 'published',
      createdAt: new Date().toISOString(),
      authorName: 'Staff Admin',
    };
    setPosts([newP, ...posts]);
  };

  const handleReply = (id: string, text: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, reply: text, status: 'resolved' } : m)));
  };

  return (
    <TenantStaffLayout>
      <FeatureGate
        feature="social"
        fallback={
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-amber-600 mx-auto" />
            <h3 className="font-bold text-amber-900 text-lg">Social Studio Module Disabled</h3>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              Social Studio is not enabled in this tenant plan. Upgrade your tenant features configuration to unlock AI social care.
            </p>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Social Studio Workstation</h1>
              <p className="text-xs text-slate-500">Monitor social care sentiment, broadcast queue updates, and dispatch AI smart replies.</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700 border border-pink-200">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Social Sentiment Engine Active
            </span>
          </div>

          <SocialFeed
            posts={posts}
            messages={messages}
            onCreatePost={handleCreatePost}
            onReply={handleReply}
          />
        </div>
      </FeatureGate>
    </TenantStaffLayout>
  );
}

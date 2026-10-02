import { CustomerMessage, SocialPost } from '../../../types/social';
import { MOCK_MESSAGES, MOCK_SOCIAL_POSTS } from '../../../mock/social';

export interface SocialRepository {
  getPostsByTenant(tenantId: string): Promise<SocialPost[]>;
  createPost(post: Partial<SocialPost>): Promise<SocialPost>;
  getMessagesByTenant(tenantId: string): Promise<CustomerMessage[]>;
  replyToMessage(id: string, replyText: string): Promise<CustomerMessage | null>;
}

export class MockSocialRepository implements SocialRepository {
  private posts: SocialPost[] = [...MOCK_SOCIAL_POSTS];
  private messages: CustomerMessage[] = [...MOCK_MESSAGES];

  async getPostsByTenant(tenantId: string): Promise<SocialPost[]> {
    return Promise.resolve(this.posts.filter((p) => p.tenantId === tenantId));
  }

  async createPost(post: Partial<SocialPost>): Promise<SocialPost> {
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      tenantId: post.tenantId || 'tenant_001',
      content: post.content || '',
      platform: post.platform || 'twitter',
      status: post.status || 'published',
      scheduledFor: post.scheduledFor,
      createdAt: new Date().toISOString(),
      authorName: post.authorName || 'Social Admin',
    };
    this.posts.unshift(newPost);
    return Promise.resolve(newPost);
  }

  async getMessagesByTenant(tenantId: string): Promise<CustomerMessage[]> {
    return Promise.resolve(this.messages.filter((m) => m.tenantId === tenantId));
  }

  async replyToMessage(id: string, replyText: string): Promise<CustomerMessage | null> {
    const msg = this.messages.find((m) => m.id === id);
    if (msg) {
      msg.reply = replyText;
      msg.status = 'resolved';
      return Promise.resolve(msg);
    }
    return Promise.resolve(null);
  }
}

export const socialRepository: SocialRepository = new MockSocialRepository();

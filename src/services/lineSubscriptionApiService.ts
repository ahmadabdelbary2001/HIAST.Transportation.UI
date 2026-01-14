// src/services/lineSubscriptionApiService.ts

import type { LineSubscription, LineSubscriptionListDto, CreateLineSubscriptionDto, UpdateLineSubscriptionDto } from '@/types/index';
import { fetchWithAuth } from './apiHelper';

export const lineSubscriptionApiService = {
  /**
   * Fetches a list of all line subscriptions.
   */
  getAll: async (): Promise<LineSubscriptionListDto[]> => {
    const response = await fetchWithAuth('/api/LineSubscription');
    return response.json();
  },

  /**
   * Fetches the detailed information for a single subscription.
   */
  getById: async (id: number): Promise<LineSubscription> => {
    const response = await fetchWithAuth(`/api/LineSubscription/${id}`);
    return response.json();
  },

  /**
   * Deletes a subscription by its ID.
   */
  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/api/LineSubscription/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Creates a new line subscription.
   */
  create: async (subscription: CreateLineSubscriptionDto): Promise<number> => {
    const response = await fetchWithAuth('/api/LineSubscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
    return response.json();
  },

  /**
   * Updates an existing line subscription.
   */
  update: async (subscription: UpdateLineSubscriptionDto): Promise<void> => {
    const response = await fetchWithAuth(`/api/LineSubscription/${subscription.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update subscription ${subscription.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};





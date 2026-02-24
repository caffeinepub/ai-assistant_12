import { useState, useCallback } from 'react';
import { useConversationHistory, useSendMessage } from './useQueries';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '../backend';

export function useChat() {
    const queryClient = useQueryClient();
    const { data: messages = [], isLoading: isLoadingHistory } = useConversationHistory();
    const sendMessageMutation = useSendMessage();
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return;

            const optimisticUserMsg: Message = {
                role: 'user',
                content: content.trim(),
                timestamp: BigInt(Date.now()) * BigInt(1_000_000),
            };

            setOptimisticMessages([optimisticUserMsg]);

            try {
                await sendMessageMutation.mutateAsync(content.trim());
                setOptimisticMessages([]);
            } catch (err) {
                setOptimisticMessages([]);
                console.error('Failed to send message:', err);
            }
        },
        [sendMessageMutation]
    );

    const clearConversation = useCallback(() => {
        queryClient.setQueryData(['conversationHistory'], []);
        setOptimisticMessages([]);
    }, [queryClient]);

    const allMessages = [...messages, ...optimisticMessages];
    const isTyping = sendMessageMutation.isPending;

    return {
        messages: allMessages,
        isLoadingHistory,
        isTyping,
        sendMessage,
        clearConversation,
        error: sendMessageMutation.error,
    };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message } from '../backend';

export function useConversationHistory() {
    const { actor, isFetching } = useActor();

    return useQuery<Message[]>({
        queryKey: ['conversationHistory'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getConversationHistory();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useSendMessage() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userMessage: string): Promise<Message> => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.sendMessage(userMessage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
        },
    });
}

export function useClearConversation() {
    const queryClient = useQueryClient();

    return {
        clearLocal: () => {
            queryClient.setQueryData(['conversationHistory'], []);
        },
    };
}

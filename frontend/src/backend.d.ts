import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: string;
    timestamp: Time;
    gamePayload?: string;
}
export type Time = bigint;
export interface backendInterface {
    getConversationHistory(): Promise<Array<Message>>;
    sendMessage(userMessage: string): Promise<Message>;
}

import {ComponentType} from "react";
import type {BaseComponentMessageRegistry, ComponentMessageRegistry} from "./index";

// TODO: Type this better

// Message Types
export const MessageTypes = {
    SIMPLE: 'simple',
    COMPONENT: 'component',
} as const;

export type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

// Message IDs - Creating a type-safe approach for message IDs
export type MessageId = string | number | symbol;

// Base Message interface
interface BaseMessage {
    id: MessageId;
    type: MessageType;
    createdAt: number;
    lastUpdatedAt: number;
}

// Text Message
export interface SimpleMessage extends BaseMessage {
    type: typeof MessageTypes.SIMPLE;
    title: string;
    description: string;
    severity: "success" | "error" | "warning" | "info"
}

// Component Message with a specific component key for type inference
export interface ComponentMessage<
    T extends BaseComponentMessageRegistry = ComponentMessageRegistry,
    K extends keyof T = MessageId> extends BaseMessage {
    id: K;
    type: typeof MessageTypes.COMPONENT;
    component: ComponentType<T[K]>;
    props: T[K];
}

// Union type for all message types
export type Message = SimpleMessage | ComponentMessage;

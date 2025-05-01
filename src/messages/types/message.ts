import {ComponentType} from "react";

// TODO: Type this better

// Message Types
export const MessageTypes = {
    SIMPLE: 'simple',
    COMPONENT: 'component',
} as const;

export type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

// Message IDs - Creating a type-safe approach for message IDs
export type MessageId = string | number;

// Component registry for type safety
export interface ComponentMessageRegistry {
    [key: string]: object
}

// This allows components to register their props types
// Components will extend this interface in their own files
declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ComponentMessagePropTypes extends ComponentMessageRegistry {}
}

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
export interface ComponentMessage<K extends keyof ComponentMessagePropTypes = string | number> extends BaseMessage {
    id: K;
    type: typeof MessageTypes.COMPONENT;
    component: ComponentType<ComponentMessagePropTypes[K]>;
    props: ComponentMessagePropTypes[K];
}

// Union type for all message types
export type Message = SimpleMessage | ComponentMessage;

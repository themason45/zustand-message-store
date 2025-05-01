import {create} from "zustand";
import {ComponentMessage, Message, MessageId, SimpleMessage} from "../types/message";
import moment from "moment";

type ChangeableMessage<M extends Message> = Omit<M, 'id' | 'type' | 'createdAt' | 'lastUpdatedAt'>

export type MessageStoreType = {
    /**
     * The stack of current messages
     */
    messages: Map<MessageId, Message>
    /**
     * Push a new simple message onto the stack
     * @param message The message to push
     */
    pushSimpleMessage: (id: MessageId, args: ChangeableMessage<SimpleMessage>) => void
    /**
     * Push a new component message onto the stack
     * @param message The message to push
     */
    pushComponentMessage: <K extends keyof ComponentMessagePropTypes>(
        id: K,
        args: ChangeableMessage<ComponentMessage<K>>) => void
    /**
     * Get a message by its ID
     * @param id The ID of the message to get
     * @returns The message, if it exists, or undefined otherwise
     */
    getMessageById: (id: MessageId) => Message | undefined
    /**
     * Updates a specified simple message in the stack.
     * You cannot use this to update the `messageId` property.
     */
    updateSimpleMessage: (id: MessageId, updates: Partial<ChangeableMessage<SimpleMessage>>) => void;
    /**
     * Updates the props of a specified component message in the stack.
     *
     */
    updateComponentMessage: <K extends keyof ComponentMessagePropTypes>(
        id: K,
        mutator: (current: ComponentMessagePropTypes[K]) => Partial<ComponentMessagePropTypes[K]>) => void
    /**
     * Remove a specified message from the stack
     */
    removeMessage: (message: Message['id']) => void

}

// Actions
// addTextMessage: (title: string, description: string) => MessageId;
// addComponentMessage: <P>(component: ComponentType<P>, props: P) => MessageId;
// updateTextMessage: (id: MessageId, updates: Partial<Omit<TextMessage, 'id' | 'type' | 'createdAt'>>) => void;
// updateComponentProps: <P>(id: MessageId, newProps: Partial<P>) => void;
// removeMessage: (id: MessageId) => void;
// getMessageById: <T extends Message = Message>(id: MessageId) => T | undefined;

/**
 * Creates a new message store
 */
export const createMessageStore = () => {
    return create<MessageStoreType>((set, get) => ({
        messages: new Map<MessageId, Message>(),
        pushSimpleMessage: (id, args) => set((s) => {
            const newMessage: SimpleMessage = {
                id,
                type: "simple",
                createdAt: moment().unix(),
                lastUpdatedAt: moment().unix(),
                ...args
            }

            const messages = s.messages;
            messages.set(newMessage.id, newMessage)

            return {
                messages: messages
            }
        }),
        pushComponentMessage: <K extends keyof ComponentMessagePropTypes>(
            id: K,
            args: ChangeableMessage<ComponentMessage<K>>
        ) => set((s) => {
            const newMessage: ComponentMessage = {
                id,
                type: "component",
                createdAt: moment().unix(),
                lastUpdatedAt: moment().unix(),
                ...args
            }
            const messages = s.messages;
            messages.set(newMessage.id, newMessage)
            console.log("Added new message", messages)

            return {
                messages: messages
            }
        }),
        getMessageById: (id) => get().messages.get(id),
        updateSimpleMessage: (id, updates) => set((s) => {
            const message = s.messages.get(id as MessageId);
            if (!message || message.type !== 'simple') {
                return s;
            }
            const newMessage = {
                ...message,
                ...updates,
                lastUpdatedAt: moment().unix()
            }

            const messages = s.messages;
            messages.set(newMessage.id, newMessage)

            return {
                messages: messages
            }
        }),
        updateComponentMessage: (id, mutator) => set((s) => {
            const message = s.messages.get(id as MessageId);
            if (!message || message.type !== 'component') {
                return s;
            }

            const props = message.props
            const newMessage = {
                ...message,
                props: mutator(props),
                lastUpdatedAt: moment().unix()
            }

            const messages = s.messages;
            messages.set(message.id, newMessage)

            return {
                messages: messages
            }
        }),
        removeMessage: (id) => set(s => {
            const messages = s.messages
            messages.delete(id)

            return {
                messages: messages
            };
        })
    }))
}
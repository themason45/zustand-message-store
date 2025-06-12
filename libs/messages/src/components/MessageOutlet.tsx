/**
 * Provides an outlet for messages to be displayed
 */
import {useMessageStore, useMessageStoreWithEqualityFunction} from "../store/MessageStoreContext";
import {HTMLAttributes, useId} from "react";
import {MessageComponent} from "./MessageComponent";
import {MessageId} from "../types/message";
import {shallow} from "zustand/vanilla/shallow";

type MessageOutletProps = {
    /**
     * The maximum number of messages to display
     */
    maxMessages?: number,
    /**
     * The absolute positioning offsets for the `MessageOutlet`
     */
    offsets: {
        top?: number,
        bottom?: number
        left?: number,
        right?: number,
    }
    /**
     * The z-index of the `MessageOutlet` and hence all messages it displays
     */
    zIndex: number,
    messageClassName?: Pick<HTMLAttributes<HTMLDivElement>, "className">
}

/**
 * An outlet to display messages to the user. Use this in conjunction with a MessageStoreContext
 * to send messages from different parts of the app.
 */
export const MessageOutlet = ({maxMessages: _maxMessages, offsets, zIndex, messageClassName}: MessageOutletProps) => {
    const maxMessages = _maxMessages || 3;
    // A random ID for this message outlet
    const outletId = useId();

    const messages = useMessageStoreWithEqualityFunction(state => {
        return Array.from(state.messages.keys())
    }, shallow);

    const removeMessage = useMessageStore(state => state.removeMessage);

    return <div id={`message-outlet-${outletId}`}
                className={" flex flex-col-reverse gap-2"}
                style={{
                    position: "absolute",
                    ...offsets,
                    zIndex: zIndex,
                }}>
        {(messages
            .slice(0, maxMessages)
            .map(id => <MessageComponent
                key={id as string}
                messageID={id}
                className={messageClassName as string}
                handleClose={() => removeMessage(id as unknown as MessageId)}/>
            ))}
    </div>
}
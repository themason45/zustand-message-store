/**
 * A message component to be rendered in the message stack
 */
import {createElement} from "react";
import {ComponentMessage, Message, MessageId, SimpleMessage} from "../types/message";
import {useMessageStore} from "../store/MessageStoreContext";

type MessageComponentProps<T extends Message> = {
    /**
     * The message to display.
     */
    message: T,
    /**
     * The close handler for this message.
     */
    handleClose: () => void,
}

/**
 * A component to render a simple message.
 *
 * TODO: Add colours based on message type
 *
 * @param message The message to display
 */
const SimpleMessageComponent = ({message, handleClose}: MessageComponentProps<SimpleMessage>) => {

    return <div className={"flex flex-col gap-1 items-start"}>
        <div className={"flex items-center justify-between w-full"}>
            <p className={"text-lg font-bold"}>{message.title}</p>
            <button className={"px-1 p-0"} onClick={() => handleClose()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                     className={"fill-black dark:fill-white"}>
                    <path
                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </button>
        </div>
        <p>{message.description}</p>
    </div>
}

/**
 * A component to render a dynamically defined component as a message.
 *
 * @param message The message to render
 */
const ComponentMessageComponent = ({message}: MessageComponentProps<ComponentMessage>) => {
    return <>
        {createElement(message.component, message.props)}
    </>
}

/**
 * A component which displays a message, to be used in the message stack.
 */
export const MessageComponent = ({messageID, handleClose}: { messageID: MessageId, handleClose: () => void }) => {
    const message = useMessageStore(state => {
        console.log(state.messages.get(messageID)?.lastUpdatedAt)
        return state.messages.get(messageID)
    })

    if (!message) return <></>

    return <div className={"p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-black"}>
        <div>
            {/* Create a message if it is a string-based one */}
            {message.type == "simple" &&
                <SimpleMessageComponent message={message} handleClose={handleClose}/>
            }
            {/* Render the message if it is a component-based one */}
            {message.type == "component" &&
                // Message is a component
                <ComponentMessageComponent message={message} handleClose={handleClose}/>
            }
        </div>
    </div>
}

import {useComponentMessageCRUD, useSimpleMessageCRUD} from "@themason45/zustand-message-store";
import {FunctionComponent, useState} from "react";
// Import the message store to allow for name autocompletion

type MessageCompProps = {
    name: string
    counter: number
}

import "@themason45/zustand-message-store"
declare module "@themason45/zustand-message-store" {
    // noinspection JSUnusedGlobalSymbols This is used by the message library
    interface ComponentMessageRegistry {
        "test-component-message": MessageCompProps;
    }
}

const MessageComp: FunctionComponent<MessageCompProps> = ({name, counter}: MessageCompProps) => {
    return <div className={"p-4 bg-gray-200"}>THE MESSAGE: {name}. You have {counter} apples.</div>
}

export const InnerComponent = () => {
    const {pushMessage, updateMessage, destroyMessage} = useComponentMessageCRUD()
    const {pushMessage: pushSimpleMessage, destroyMessage: destroySimpleMessage} = useSimpleMessageCRUD()

    const send = () => {
        pushMessage("test-component-message", {
            component: MessageComp,
            props: {
                name: "Initial",
                counter: 0
            }
        })
    }

    const [simpleCounter, setSimpleCounter] = useState(0)
    const sendSimple = () => {
        pushSimpleMessage(`test-simple-message-${simpleCounter}`, {
            title: "Hello",
            description: `This is a simple message ${simpleCounter}`,
            severity: "success"
        })
        setSimpleCounter(simpleCounter + 1)
    }

    const increment = () => updateMessage("test-component-message", (props) => {
        props.counter++
        return props;
    })

    const decrement = () => updateMessage("test-component-message", (props) => {
        props.counter--
        return props;
    })

    const remove = () => destroyMessage("test-component-message")
    const removeSimple = () => {
        destroySimpleMessage(`test-simple-message-${simpleCounter}`)
        setSimpleCounter(simpleCounter - 1)
    }

    return <div className={"flex flex-col gap-8"}>
        <div className="flex flex-col gap-2">
            <p>Hello, press <button className={"button"} onClick={() => send()}>here</button> to add message.</p>
            <p>Then press <button className={"button"} onClick={() => increment()}>here</button> to add some apples the
                message
            </p>
            <p>Then press <button className={"button"} onClick={() => decrement()}>here</button> to remove some apples
                the message
            </p>
            <p>Then press <button className={"button"} onClick={() => remove()}>here</button> to delete the message</p>
        </div>

        <div className="flex flex-col gap-2">
            <p>Or if you're feeling basic, press <button className={"button"}
                                                         onClick={() => sendSimple()}>here</button> to add a simple
                message.
            </p>
            <p>You can delete the most recent one by pressing <button className={"button"}
                                                                      onClick={() => removeSimple()}>here</button>.
            </p>
        </div>
    </div>
};
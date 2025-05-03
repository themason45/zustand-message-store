import {useMessageStore} from "../store/MessageStoreContext";

/**
 * A hook to provide CRUD operation functions
 * for component-based messages within the current
 * message store.
 *
 * The current message store is resolved using
 * the `MessageStoreContext` context provider.
 * Make sure that a message store has been provided.
 */
export const useComponentMessageCRUD = () => {
    const create = useMessageStore(s => s.pushComponentMessage)
    const read = useMessageStore(s => s.getMessageById)
    const update = useMessageStore(s => s.updateComponentMessage)
    const destroy = useMessageStore(s => s.removeMessage)

    return {pushMessage: create, readMessage: read, updateMessage: update, destroyMessage: destroy}
}
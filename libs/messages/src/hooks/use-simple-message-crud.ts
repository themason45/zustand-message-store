import {useMessageStore} from "../store/MessageStoreContext";

/**
 * A hook to provide CRUD operation functions
 * for simple text-based messages within the current
 * message store.
 *
 * The current message store is resolved using
 * the `MessageStoreContext` context provider.
 * Make sure that a message store has been provided.
 */
export const useSimpleMessageCRUD = () => {
    const create = useMessageStore(s => s.pushSimpleMessage)
    const read = useMessageStore(s => s.getMessageById)
    const update = useMessageStore(s => s.updateSimpleMessage)
    const destroy = useMessageStore(s => s.removeMessage)

    return {pushMessage: create, readMessage: read, updateMessage: update, destroyMessage: destroy}
}
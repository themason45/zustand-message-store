import './App.css'
import {MessageStoreContext, useCreateMessageStore} from "./messages/store/MessageStoreContext.ts";
import {MessageOutlet} from "./messages/components/MessageOutlet.tsx";
import {InnerComponent} from "./InnerComponent.tsx";

function App() {
    const messageStore = useCreateMessageStore()

    return (
        <MessageStoreContext value={messageStore.current}>
            <div>
                <InnerComponent/>
            </div>

            <MessageOutlet offsets={{
                bottom: 15, right: 15
            }} zIndex={100}/>
        </MessageStoreContext>
    )
}

export default App

import {
    MessageOutlet,
    MessageStoreContext,
    useCreateMessageStore
} from '@themason45/zustand-message-store';
import './App.css'
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

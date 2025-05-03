# Visivi 4 Message passing system

Within Visivi4 there are multiple cases when an interaction somewhere in the app could require the display
of user-facing "messages". This module provides a method for which that can be attained.

## Module break-down:

The message system is made up of four main parts:

- The store: Where the messages and the associated mutation functions are located.
- The rendering components: Components which are used to display the various messages.
- The hooks: Hooks to assist with accessing the message store.
- The context: React context to provide the message service to multiple parts of the app.

### The store

The message store is a `zustand` store which primarily stores the current set of messages that are to be
displayed.
Along with the messages, it also hosts a collection of mutators and getters to make interacting with the
store easier.

The message model is split into two types:

- Simple messages: Ones which are text-based and whose contents are rendered in a standard way for each simple message
- Component messages: Ones whose main constituent is another React component, allowing for a more complex display.

### The rendering components

The rendering components provide a method in which to display the messages in a standard way.
This makes use of the context and the store to display any existing messages within a given container.

You can place the [`MessageOutlet`](src/components/MessageOutlet.tsx) component at any point in the app as long
as it has access to a [`MessageContext`](src/store/MessageStoreContext.ts).
It is suggested to put this as high up in the DOM as possible as to maximise the coverage of the
[`MessageContext`](src/store/MessageStoreContext.ts).

### The hooks

To make using the message store easier, a set of hooks are provided for both types of message:

- The [`useSimpleMessageCRUD`](src/hooks/use-simple-message-crud.ts) provides CRUD operations for simple messages.
- The [`useComponentMessageCRUD`](src/hooks/use-component-message-crud.ts) provides CRUD operations for component based
  messages.

These can be used in order to simplify interaction with the message store, and reduce the reliance on using
`useMessageStore(s => s.[...])`.

### The context

A React context is also defined to enable to passing of message stores to sub-components without the need to
"prop-drill", and to avoid the default Zustand pattern of a global store.
This makes it really easy to access the state within any component.

At the highest point in the app where messages are needed you can add the following:

```typescript jsx
const myComponent = () => {
      const messageStore = useCreateMessageStore();
      // ...
      
      return <MessageStoreContext value={messageStore.current}>
            <div>
                <InnerComponent/>
                {/*...*/}
            </div>
        </MessageStoreContext>
}
```

## Message types

As mentioned before, there are two types of message:
 - Simple messages
 - Component messages

This section goes over, in detail, the two types, and provides examples on how best to use them:

### Simple messages

[//]: # (TODO)

### Component messages

Component messages are inherently more complicated than their "simple" counterparts.
To ensure type safety, these messages require the registering of their respective component's `prop` types.
While this is optional, it significantly improves developer experience when dealing with complex components.

#### Registering components

For enhanced type safety you should register your message's component's props against the message's ID.
Currently this limits the number of component messages with a given ID to just one, howver, in a lot of cases this
is all that is required.

In order to register the props we make use of Typescript's name-space system:
```typescript
type TestMessageComponentProps = {
    text: string,
    image: Uint8Array
}

const TestMessageComponent = (props: TestMessageComponentProps) => {
    // ...
}

// Register this component's props in the global registry
declare global {
    interface ComponentMessagePropTypes {
        "test-message": MessageCompProps;
    }
}
```

This will ensure that when both pushing (creating), and updating a message, the `prop` types will have consistent
and proper typing reducing the risk of errors.

#### Component-based message example:

An example making use of component-based messages assuming that a [`MessageContext`](src/store/MessageStoreContext.ts)
has been provided above, and a [`MessageOutlet`](src/components/MessageOutlet.tsx) is present somewhere within that context:
```typescript jsx
type MessageCompProps = {
  name: string
  counter: number
}

const MessageComp: FunctionComponent<MessageCompProps> = ({name, counter}: MessageCompProps) => {
  return <div className={"p-4 bg-gray-200"}>THE MESSAGE: {name}. You have {counter} apples.</div>
}

// Register this component's props in the global registry
declare global {
  interface ComponentMessagePropTypes {
    "test-message": MessageCompProps;
  }
}

export const InnerComponent = () => {
  const {pushMessage, updateMessage, destroyMessage} = useComponentMessageCRUD()

  /**
   An initial message creation function. You can pass this the actual component to
   render, along with its initial `prop`s.
   */
  const send = () => {
    pushMessage("test-message", {
      component: MessageComp,
      props: {
        name: "Initial",
        counter: 0
      }
    })
  }

  /**
   * An example mutation function. You may use these to update the props of the component.
   * Every update to this will re-render the message's component.
   */
  const increment = () => updateMessage("test-message", (props) => {
    props.counter++
    return props;
  })

  return <div className={"flex flex-col gap-2"}>
    <p>Hello, press <button onClick={() => send()}>here</button> to add message.</p>
    <p>Then press <button onClick={() => increment()}>here</button> to add some apples the message</p>
  </div>
}
```

## The component outlet

The component outlet provides a place to display the messages that have been pushed to the message store.
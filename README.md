# react-context-api

> !!!The library is not stable now!!!

<p>
  <a href="https://www.npmjs.com/package/react-context-api">
    <img
      alt="npm version"
      src="https://badge.fury.io/js/react-context-api.svg"
    />
  </a>
  <a href="https://coveralls.io/github/purepennons/react-context-api?branch=master">
    <img src="https://coveralls.io/repos/github/purepennons/react-context-api/badge.svg?branch=master" alt="Coverage Status" />
  </a>
  <a href="https://github.com/purepennons/react-context-api/blob/master/LICENSE">
    <img
      alt="license mit"
      src="https://img.shields.io/badge/License-MIT-blue.svg"
    />
  </a>
  <a href="https://circleci.com/gh/purepennons/react-context-api/tree/master">
    <img
      alt="circle ci"
      src="https://circleci.com/gh/purepennons/react-context-api/tree/master.svg?style=svg"
    />
  </a>
</p>

This is a React 16.3 [context api](https://reactjs.org/docs/context.html) wrapper. The purpose of the library is giving a convenience way to use `Context API` as a react global store.

## Basic Usage

Create your context (store) like below format.
It is good to define by features.

```jsx
// todos.jsx
import { createContext, Component } from 'react'
const cx = createContext({});
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      actions: {
        addTodo: this.addTodo
      }
    };
  }

  addTodo = todo => {
    this.setState(prev => ({todos: prev.todos.concat(todo)}));
  };

  render(){
    return (
      <cx.Provider value={this.state}>{this.props.children}</cx.Provider>
    );
  }
}

export default {
  Provider: Provider,
  Consumer: cx.Consumer
};

// other.jsx
import { createContext, Component } from 'react'
const cx = createContext({});
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      other: [],
      actions: {
        otherAction: this.otherAction
      }
    };
  }

  otherAction = () => {
    // do something...
  };

  render(){
    return (
      <cx.Provider value={this.state}>{this.props.children}</cx.Provider>
    );
  }
}

export default {
  Provider: Provider,
  Consumer: cx.Consumer
};
```

### Render Props

Inject context to your App by `ContextProvider` and consume by `ContextConsumer`

```jsx
import createContextAPI from 'react-context-api';
import todos from './todos';
import others from './others';

const { ContextProvider, ContextConsumer } = createContextAPI({ todos, others });

const Child = props => (
  // you can specific fields by `contextToRenderProps` prop like
  // <ContextConsumer contextToRenderProps={['todos']}>
  // the render props will only get the `todos` field.
  <ContextConsumer>
    {({ todos, others }) => (
      <div>
        <ul>{todos.todos.map(todo => <li>{todo}</li>)}</ul>
        <button onClick={evt => todos.actions.addTodo('new todo')}>ADD</button>
      </div>
    )}
  </ContextConsumer>
);

const App = props => (
  <ContextProvider>
    <Child />
  <ContextProvider/>
);
```

### HOC

If you prefer HOC styles, you can use `withContextProvider` and `withContextConsumer`.

> You can use render props api and HOC api together.

```jsx
const { withContextProvider, withContextConsumer } = createContextAPI({
  todos,
  others
});

const Child = withContextConsumer(['todos', 'others'])(({ todos, others }) => (
  <div>
    <ul>{todos.todos.map(todo => <li>{todo}</li>)}</ul>
    <button onClick={evt => todos.actions.addTodo('new todo')}>ADD</button>
  </div>
));

const App = withContextProvider(Child);
```

## API Reference

### createContextAPI(contextList: Object) => ({ContextProvider, ContextConsumer, withContextProvider, withContextConsumer, getContextConsumer})
`contextList` must be a object which value is a context pair (`{ Provider, Consumer }`):
```jsx
import { createContext, Component } from 'react'
const cx = createContext({});
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return (
      <cx.Provider value={this.state}>{this.props.children}</cx.Provider>
    );
  }
}
const contextPair {
  Provider: Provider,
  Consumer: cx.Consumer
};

const contextList = { contextName: contextPair }
```

### <ContextProvider />
A render-props api which provider the context into your App.

### <ContextConsumer />
You can get your context in your component anywhere through `<ContextConsumer />` API.
#### Props
- contextToRenderProps<string[]>: specific fields that you want to consume. If no `contextToRenderProps` is supplied or `contextToRenderProps` is an empty array, it will return all context instead.

### withContextProvider(Component) => WrapperedComponent
Same as `<ContextProvider/>`, but use HOC styling. Inject the context into `Component`.

### withContextConsumer(contextToRenderProps: string[]) => (Component) => WrapperedComponent
Same as `<ContextConsumer />`, but use HOC styling. The specific fields will be injected as props into your `Component`.

### getContextConsumer(field: string[]) => ContextConsumerWithoutContextToRenderProps
If you prefer get `Consumer` with specific field statically instead of changing with `contextToRenderProps` **props** dynamically. You can use `getContextConsumer` directly. It will return a `<ContextConsumer />` component with specific context and no `contextToRenderProps` prop.

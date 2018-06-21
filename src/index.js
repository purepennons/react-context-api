// Any sub store defeined in the `context` folder
// can be merged and injected as a global store
// by `withContext` API.

import React, { Component } from 'react'
import { adopt } from 'react-adopt'

import todos from './todos'

// Register all sub stores in the `context` variable.
export const context = { todos }

// If yout want to get all store, use `ContextConsumer` API instead.
// e.g. <ContextConsumer>{allStore => {}}</ContextConsumer>
export const ContextConsumer = adopt(
  Object.keys(context).reduce((acc, cxKey) => {
    const C = context[cxKey].Consumer
    acc[cxKey] = <C />
    return acc
  }, {})
)

// `withContext` is a high-order-component that can pass
// all store states in to a component and accessed by
// store consumer.
export function withContext(Base) {
  const WrappedComponent = Object.values(context).reduce((HOC, cx) => {
    class Context extends Component {
      render() {
        return (
          <cx.Provider>
            <HOC {...this.props} />
          </cx.Provider>
        )
      }
    }
    return Context
  }, Base)

  WrappedComponent.displayName = `ContextProvider`
  return WrappedComponent
}
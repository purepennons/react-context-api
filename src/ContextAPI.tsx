import * as React from "react";
import { adopt } from "react-adopt";

export declare type ChildrenFn<P> = (props: P) => JSX.Element | null;

export declare type RPC<RP, P = {}> = React.ComponentType<
  P & {
    children: ChildrenFn<RP>;
  }
>;

interface Props {
  [k: string]: any;
}

interface State {
  [k: string]: any;
}

export interface ContextType<T> {
  Provider: React.ComponentType;
  Consumer: React.Consumer<T>;
}

export interface DefaultContextType {
  [k: string]: any;
}

export interface ContextListType {
  [k: string]: ContextType<DefaultContextType>;
}

export interface ContextAPIProviderProps {
  children: JSX.Element;
}

export interface ContextAPIContextProps {
  contextToRenderProps: string[];
  children: ChildrenFn<any>;
}

export declare type ContextProvider = React.Component<
  Props & ContextAPIProviderProps
>;
export declare type ContextConsumer = RPC<any, Props>;
export interface ContextAPIType {
  ContextProvider;
  ContextConsumer;
  getContextConsumer: (contextToRenderProps?: string[]) => ContextConsumer;
  withContextProvider: (Base: React.ComponentType) => React.ComponentType;
  withContextConsumer: (
    contextToRenderProps?: string[]
  ) => (Base: React.ComponentType) => React.ComponentType;
}

export default function createContextAPI(
  contextList: ContextListType
): ContextAPIType {
  /**
   * ContextProvider
   */
  class ContextProvider extends React.Component<
    Props & ContextAPIProviderProps
  > {
    render(): JSX.Element {
      return Object.values(contextList).reduce(
        (Parent: JSX.Element, cx: ContextType<DefaultContextType>) => (
          <cx.Provider>
            {React.cloneElement(Parent, {
              ...this.props
            })}
          </cx.Provider>
        ),
        this.props.children
      );
    }
  }

  const withContextProvider = (Base: React.ComponentType<any>) => {
    class WithContextProvider extends React.Component<
      Props & { forwardedRef: React.Ref<any> }
    > {
      static displayName = "WithContextProvider";

      render(): JSX.Element {
        const { forwardedRef, ...rest } = this.props;
        return (
          <ContextProvider>
            <Base ref={forwardedRef} {...rest} />
          </ContextProvider>
        );
      }
    }

    return React.forwardRef((props, ref) => (
      <WithContextProvider {...props} forwardedRef={ref} />
    ));
  };

  /**
   * ContextConsumer
   */

  const getContextConsumer = (contextToRenderProps?: string[]) => {
    let pickedContextList: ContextListType = contextList;
    if (contextToRenderProps && contextToRenderProps.length > 0) {
      pickedContextList = contextToRenderProps.reduce((acc, cxKey) => {
        if (contextList[cxKey]) acc[cxKey] = contextList[cxKey];
        return acc;
      }, {});
    }

    return adopt(
      Object.keys(pickedContextList).reduce((acc, cxKey) => {
        const PatialConsumer: React.ComponentType =
          pickedContextList[cxKey].Consumer;
        acc[cxKey] = <PatialConsumer />;
        return acc;
      }, {})
    );
  };

  class ContextConsumer extends React.Component<
    Props & ContextAPIContextProps
  > {
    render(): JSX.Element {
      const Consumer = getContextConsumer(this.props.contextToRenderProps);
      return <Consumer>{this.props.children}</Consumer>;
    }
  }

  const withContextConsumer = (contextToRenderProps?: string[]) => (
    Base: React.ComponentType<any>
  ) => {
    const Consumer = getContextConsumer(contextToRenderProps);
    class WithContextConsumer extends React.Component<
      Props & { forwardedRef: React.Ref<any> }
    > {
      static displayName = "WithContextConsumer";

      render(): JSX.Element {
        const { forwardedRef, ...rest } = this.props;
        return (
          <Consumer>
            {data => <Base ref={forwardedRef} {...data} {...rest} />}
          </Consumer>
        );
      }
    }
    return React.forwardRef((props, ref) => (
      <WithContextConsumer {...props} forwardedRef={ref} />
    ));
  };

  return {
    ContextProvider,
    ContextConsumer,
    getContextConsumer,
    withContextProvider,
    withContextConsumer
  };
}

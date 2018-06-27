import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import createContextAPI, { ChildrenFn } from '../src/';

Enzyme.configure({ adapter: new Adapter() });

interface Props {
  [k: string]: any;
  // children: React.ReactNode;
}

interface State {
  [k: string]: any;
  actions: {
    [actionKey: string]: (...args: any[]) => any;
  };
}

function createTestContext() {
  const s1Cx = React.createContext({});
  class S1Provider extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        s1: 's1',
        actions: {
          setS1: this.setS1
        }
      };
    }

    setS1 = (v: any): void => {
      this.setState({ s1: v });
    };

    render(): JSX.Element {
      return (
        <s1Cx.Provider value={this.state}>{this.props.children}</s1Cx.Provider>
      );
    }
  }

  const s1 = { Provider: S1Provider, Consumer: s1Cx.Consumer };

  const s2Cx = React.createContext({});
  class S2Provider extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        s2: 's2',
        actions: {
          setS2: this.setS2
        }
      };
    }

    setS2 = (v: any): void => {
      this.setState({ s2: v });
    };

    render(): JSX.Element {
      return (
        <s2Cx.Provider value={this.state}>{this.props.children}</s2Cx.Provider>
      );
    }
  }

  const s2 = { Provider: S2Provider, Consumer: s2Cx.Consumer };

  return { s1, s2 };
}

describe('createContextAPI', () => {
  let contextList = null;

  beforeEach(() => {
    contextList = createTestContext();
  });

  it('render props version', () => {
    const { ContextProvider, ContextConsumer } = createContextAPI(contextList);
    const Child: React.StatelessComponent<
      Props & { render: ChildrenFn<any> }
    > = ({ render, contextToRenderProps }) => (
      <div>
        <ContextConsumer contextToRenderProps={contextToRenderProps}>
          {render}
        </ContextConsumer>
      </div>
    );

    const Parent: React.StatelessComponent<
      Props & { render: ChildrenFn<any>; contextToRenderProps?: string[] }
    > = ({ render, contextToRenderProps }) => (
      <ContextProvider>
        <Child render={render} contextToRenderProps={contextToRenderProps} />
      </ContextProvider>
    );

    const wrapper = Enzyme.mount(<Parent render={expectAllContext} />);

    wrapper.setProps({ contextToRenderProps: null });
    wrapper.setProps({ contextToRenderProps: [] });
    wrapper.setProps({ contextToRenderProps: ['s1', 's2'] });
    wrapper.setProps({ contextToRenderProps: ['s1'], render: expectS1Context });

    function expectAllContext(renderProps) {
      expect(renderProps).toHaveProperty('s1');
      expect(renderProps).toHaveProperty('s2');
      expect(renderProps.s1.s1).toBe('s1');
      expect(renderProps.s1.actions.setS1).toBeInstanceOf(Function);
      expect(renderProps.s2.s2).toBe('s2');
      expect(renderProps.s2.actions.setS2).toBeInstanceOf(Function);
      return null;
    }

    function expectS1Context(renderProps) {
      expect(renderProps).toHaveProperty('s1');
      expect(renderProps).not.toHaveProperty('s2');
      expect(renderProps.s1.s1).toBe('s1');
      expect(renderProps.s1.actions.setS1).toBeInstanceOf(Function);
      return null;
    }
  });
});

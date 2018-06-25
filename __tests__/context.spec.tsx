import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import createContextAPI from '../src/ContextAPI';

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

describe('withContext', () => {
  beforeEach(() => {});
});

test('basic', () => {
  const context = { s1, s2 };
  const { ContextProvider, ContextConsumer } = createContextAPI(context);
  const S1 = (props: Props): JSX.Element => (
    <ContextConsumer contextToRenderProps={['s2']}>
      {data => {
        console.log('data', data);
        return <div>S1</div>;
      }}
    </ContextConsumer>
  );

  const wrapper = Enzyme.mount(<ContextProvider><S1 /></ContextProvider>);
});

/*

Have `Portal` create a new DOM element, append it to document.body and then
render its children into a portal. We want to have portal create the new dom
node when it mounts, and remove it when it unmounts.

Tips:

- in componentDidMount, create a new dom node and append it to the body
  - `document.createElement('div')`
  - `document.body.append(node)`
- in componentWillUnmount, remove the node from the body with
  `document.body.removeChild(node)`

Finally, the menu will be rendered out of DOM context so the styles will be all
wrong, you'll need to provide a `style` prop with fixed position and left/top
values.  To help out, we've imported `Rect`. Go check the docs for Rect
(https://ui.reach.tech/rect) and then use it to put the menu by the button.

*/

//put the ref on the button because that is what
// we're putting the list onto
// use rect.top and rect.left to position it

import React from "react";
import { createPortal } from "react-dom";
import Rect from "@reach/rect";

// let portal = document.createElement('div'); // moves into instance
// document.body.appendChild(portal);  //same

class Portal extends React.Component {
  state = {
    isMounted: false,  //portal is better state name
  }

  let portal = document.createElement('div');  //name change?

  componentDidMount() {
    let node = document.createElement('div');
    document.body.append(this.node);
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
    this.setState({ isMounted: false });
  }

  render() {
    // return this.createPortal(this.props.children);//if else
    //especially if rendering on server
    return this.props.children;
  }
}

class Select extends React.Component {
  state = {
    value: this.props.defaultValue,
    isOpen: false
  };

  handleToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    let label;
    const children = React.Children.map(this.props.children, child => {
      const { value } = this.state;
      if (child.props.value === value) {
        label = child.props.children;
      }

      return React.cloneElement(child, {
        onSelect: () => {
          this.setState({ value: child.props.value });
        }
      });
    });

//styles go in the ul with rect.left and rect.top
//when it puts it in state, it re renders
// it tracks it for movement and triggers call
    return (
      <Rect>
        {({ rect, ref }) => (
          <div onClick={this.handleToggle} className="select">
            <button ref={Rect.ref} className="label">
              {label} <span className="arrow">▾</span>
            </button>
            {isOpen && (
              <Portal>
                <ul className="options">{children}</ul>
              </Portal>
            )}
          </div>
        )}
      </Rect>
    );
  }
}

class Option extends React.Component {
  render() {
    return (
      <li className="option" onClick={this.props.onSelect}>
        {this.props.children}
      </li>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="block">
          <h2>Portal Party</h2>
          <Select defaultValue="tikka-masala">
            <Option value="tikka-masala">Tikka Masala</Option>
            <Option value="tandoori-chicken">Tandoori Chicken</Option>
            <Option value="dosa">Dosa</Option>
            <Option value="mint-chutney">Mint Chutney</Option>
          </Select>
        </div>
      </div>
    );
  }
}

export default App;

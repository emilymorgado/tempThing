// 1. click something, move focus
  // blue outline === focus
//close focus
//3. keyboard events
  //downarrow
//aria attributes
//native dropdown select is aria compliant

//2. tell in option whether or not it's highlighted
  // cloneElement
  //aria-haspopup='listbox' put this on the button to help the screenreader

//bad aria is worse than no ARIA
//don't use aria if you don't have to
//make sure to always test with a screenreader


import React from "react";
import PropTypes from "prop-types";
import Rect from "@reach/rect";

class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  };

  state = {
    value: this.props.defaultValue,
    isOpen: false
  };

  //componentDidUpdate for focus
  //add listRef to node
  //needs a tabIndex in order to focus, it makes something tabable
  // use '-1' (focusable but not by using tab, programmer in charge, not user)


  handleToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  isControlled() {
    return this.props.value != null;
  }

  render() {
    const { isOpen } = this.state;
    let label;
    const children = React.Children.map(this.props.children, child => {
      const { value } = this.isControlled() ? this.props : this.state;
      if (child.props.value === value) {
        label = child.props.children;
      }

      return React.cloneElement(child, {
        onSelect: () => {
          if (this.isControlled()) {
            this.props.onChange(child.props.value);
          } else {
            this.setState({ value: child.props.value });
          }
        }
      });
    });

    return (
      <Rect>
        {({ rect, ref }) => (
          <div onClick={this.handleToggle} className="select">
            <button ref={ref} className="label">
              {label} <span className="arrow">▾</span>
            </button>
            {isOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: rect.top,
                  left: rect.left
                }}
                className="options"
              >
                {children}
              </ul>
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
  state = {
    selectValue: "dosa"
  };

  setToMintChutney = () => {
    this.setState({
      selectValue: "mint-chutney"
    });
  };

  render() {
    return (
      <div className="app">
        <div className="block">
          <h2>WAI-ARIA</h2>
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

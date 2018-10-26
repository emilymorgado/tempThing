import React, { Component } from "react";
import FaPlay from "react-icons/lib/fa/play";
import FaPause from "react-icons/lib/fa/pause";
import FaForward from "react-icons/lib/fa/forward";
import FaBackward from "react-icons/lib/fa/backward";

class RadioGroup extends Component {
  state = {
    // this represents onSelect value
    value: 'back'
  }

  render() {
    let clones = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        isActive: child.props.value === this.state.selectedValue,
        onSelect: () => this.setState({ value: child.props.value })
      });
    });
    return (
      <fieldset className='radio-group'>
        <legend>{this.props.legend}</legend>
        {clones}
      </fieldset>
    )
  }
}


class RadioButton extends Component {
  render() {
    const { isActive, onSelect } = this.props;
    const className = "radio-button " + (isActive ? "active" : "");
    return <button onClick={onSelect} className={className}>{this.props.children}</button>;
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup legend="Radio Group">
          <RadioButton value="back">
            <FaBackward />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default App;

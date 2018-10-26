/*
tabIndex takes ternary
onKeyDown on fieldset - pass in a function with event and conditonal and setState
findNextValue takes in his simple CS code
button.createRef() - react handles ref creation

ref={radioGroup =>} //BAD
ref={this.buttonRef} //good

Follow the WAI ARIA Radio Group example at:
https://www.w3.org/TR/wai-aria-practices-1.1/examples/radio/radio-1/radio-1.html

- Turn the span into a button to get keyboard and focus events - DONE
- Use tabIndex to allow only the active button to be tabbable - DONE
- Use left/right arrows to select the next/previous radio button
  - Tip: you can figure out the next value with React.Children.forEach(fn),
    or React.Children.toArray(children).reduce(fn)
- Move the focus in cDU to the newly selected item
  - Tip: do it in RadioOption not RadioGroup
  - Tip: you'll need a ref
- Add the aria attributes
  - radiogroup
  - radio
  - aria-checked
  - aria-label on the icons


//blue === focus
reference: https://www.w3.org/TR/wai-aria-practices-1.1/#radiobutton
//and: https://www.w3.org/TR/wai-aria-practices-1.1/examples/radio/radio-2/radio-2.html
-1 not active
0 active
react.children.count
*/

import React, { Component } from "react";
import FaPlay from "react-icons/lib/fa/play";
import FaPause from "react-icons/lib/fa/pause";
import FaForward from "react-icons/lib/fa/forward";
import FaBackward from "react-icons/lib/fa/backward";

// let arr = [1, 2, 3]
// let currentIndex
//
// let next = (index + 1) % arr.length
// let prev = (index - 1) % arr.length

function findIndexFromValue(children, value) {
  let index = -1;
  React.Children.forEach(children, (child, childIndex) => {
    if (child.props.value === value) {
      index = childIndex;
    }
  });
  return index;
}

function findValueFromIndex(children, index) {
  return React.Children.toArray(children).reduce(
    (nextValue, child, childIndex) => {
      if (index === childIndex) {
        return child.props.value;
      }
      return nextValue;
    },
    null
  );
}

class RadioGroup extends Component {
  state = {
    value: this.props.defaultValue,
    highlightedIndex: findIndexFromValue(
      this.props.children,
      this.props.defaultValue
    ),
  };

  render() {
    const { highlightedIndex, value } = this.state
    let activeDescendantId
    let label

    const children = React.Children.map(this.props.children, (child, index) => {
      let isHighlighted = index === highlightedIndex;

      if (isHighlighted) {
        activeDescendantId = child.props.value;
      }

      if (child.props.value === value) {
        label = child.props.children;
      }

      return React.cloneElement(child, {
        isActive: child.props.value === this.state.value,
        onSelect: () => this.setState({ value: child.props.value })
      });
    });

    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {children}
      </fieldset>
    );
  }
}

class RadioButton extends Component {
  render() {
    const { isActive, onSelect } = this.props;
    const className = "radio-button " + (isActive ? "active" : "");
    return (
      <button className={className} onClick={onSelect}  tabIndex={isActive ? 0 : -1}>
        {this.props.children}
      </button>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup defaultValue="pause" legend="Radio Group">
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
        <RadioGroup defaultValue="pause" legend="Radio Group">
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

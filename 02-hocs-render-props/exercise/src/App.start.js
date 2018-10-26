import React from "react";
import createMediaListener from "./lib/createMediaListener";
import { Galaxy, Trees, Earth } from "./lib/screens";
import { CSSTransition } from "react-transition-group";

const media = createMediaListener({
  big: "(min-width : 1000px)",
  tiny: "(max-width: 600px)"
});

class Media extends React.Component {
  state = {
    media: media.getState()
  };

  componentDidMount() {
    media.listen(media => this.setState({ media }));
  }

  componentWillUnmount() {
    media.dispose();
  }
  render() {
    return this.props.children(this.state.media);
  }
}

class App extends React.Component {
  render() {
    return (
      <Media >
        {media => (
          <CSSTransition classNames="fade" timeout={300}>
            {media.big ? (
              <Galaxy key="galaxy" />
            ) : media.tiny ? (
              <Trees key="trees" />
            ) : (
              <Earth key="earth" />
            )}
          </CSSTransition>
        )}
      </Media>
    );
  }
}

export default App;

// Made an HOC from a render props
// function withMedia(queries, Comp) {
//   function NewComponent(props) {
//     return (
//       <Media queries={queries}>
//         {media => (
//         <Comp {...props} />
//       )}
//     </Media>
//     )
//   }
// }

// let withMedia = queries => Comp => props => (
//   <Media queries={queries}>
//     {media => {
//       <Comp {...props} />
//     }}
//   </Media>
// )

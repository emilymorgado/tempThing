// HOC solution

import React from "react";
import createMediaListener from "./lib/createMediaListener";
import { Galaxy, Trees, Earth } from "./lib/screens";
import { CSSTransition } from "react-transition-group";

const media = createMediaListener({
  big: "(min-width : 1000px)",
  tiny: "(max-width: 600px)"
});

const withMedia = (Comp) => {
  return class WithMedia extends React.Component {
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
    return <Comp media={this.state.media} />
  }
}
}

class App extends React.Component {
  render() {
    const { media } = this.props;

    return (
      <CSSTransition classNames="fade" timeout={300}>
        {media.big ? (
          <Galaxy key="galaxy" />
        ) : media.tiny ? (
          <Trees key="trees" />
        ) : (
          <Earth key="earth" />
        )}
      </CSSTransition>
    );
  }
}
export default withMedia(App);

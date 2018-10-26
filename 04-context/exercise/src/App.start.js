/*
- Make the Play button work - DONE
- Make the Pause button work - DONE
- Disable the play button if it's playing - DONE
- Disable the pause button if it's not playing - DONE
- Make the PlayPause button work - DONE
- Make the JumpForward button work - DONE
- Make the JumpBack button work - DONE
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
let rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import React, { createContext } from "react";
import podcast from "./lib/podcast.mp4";
import mario from "./lib/mariobros.mp3";
import FaPause from "react-icons/lib/fa/pause";
import FaPlay from "react-icons/lib/fa/play";
import FaRepeat from "react-icons/lib/fa/repeat";
import FaRotateLeft from "react-icons/lib/fa/rotate-left";

let PlayerContext = createContext();
// the consumer goes up the tree until it finds the first provider
// the consumer takes 'context' which is just an argument, it can be destructured, etc

class AudioPlayer extends React.Component {
  //this component has the state, so it will provide
  state = {
    isPlaying: false,
    play: () => {
      this.audio.play();
      this.setState({ isPlaying: true });
    },  //this can be passed down to a provider
    pause: () => {
      this.audio.pause();
      this.setState({ isPlaying: false })
    },
    jumpAround: amount => {
      this.audio.currentTime = this.audio.currentTime + amount
    },
    duration: null, // progress bar
    currentTime: 0, // progress bar
    loaded: false, // progress bar
    setTime: time => {
      this.audio.currentTime = time;
    }
  };

  render() {
    return (
      <PlayerContext.Provider value={this.state}>
        <div className="audio-player">
          <audio
            src={this.props.source}
            onTimeUpdate={() => {
              this.setState({
                currentTime: this.audio.currentTime,
                duration: this.audio.duration
              });
            }}
            onLoadedData={() => {
              this.setState({
                duration: this.audio.duration,
                loaded: true
              });
            }}
            onEnded={() => {
              this.setState({
                isPlaying: false
              });
            }}
            ref={n => (this.audio = n)}
          />
          {this.props.children}
        </div>
      </PlayerContext.Provider>
    );
  }
}

// no state: consumer
class Play extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.play}
            disabled={context.isPlaying}
            title="play"
          >
            <FaPlay />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.pause}
            disabled={!context.isPlaying}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (context.isPlaying ? <Pause /> : <Play />)}
      </PlayerContext.Consumer>
    );
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={() => context.jumpAround(10)}
            disabled={null}
            title="Forward 10 Seconds"
          >
            <FaRepeat />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={() => context.jumpAround(-10)}
            disabled={null}
            title="Back 10 Seconds"
          >
            <FaRotateLeft />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class Progress extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => {
          let { loaded, duration, currentTime, setTime } = context;

          return (
            <div
              className="progress"
              ref={n => (this.node = n)}
              onClick={event => {
                let rect = this.node.getBoundingClientRect();
                let clientLeft = event.clientX;
                let relativeLeft = clientLeft - rect.left;
                setTime(relativeLeft / rect.width * duration);
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: loaded ? `${currentTime / duration * 100}%` : "0%"
                }}
              />
            </div>
          );
        }}
      </PlayerContext.Consumer>
    );
  }
}

let Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{" "}
      <span className="player-text">Workshop.me Podcast Episode 02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;

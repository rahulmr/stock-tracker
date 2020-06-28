import React, {Component} from 'react';
import {bindAll} from 'lodash';

class Music extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: true,
            pause: false
        };

        bindAll(this, ['play', 'pause']);

        this.url = 'http://streaming.tdiradio.com:8000/house.mp3';
        this.audio = new Audio(this.url);
    }

    play(){
        this.setState({
            play: true,
            pause: false
        });
        console.log(this.audio);
        this.audio.play();
    }

    pause(){
        this.setState({play: false, pause: true});
        this.audio.pause();
        this.props.pauseAudio();
    }

    componentDidMount() {
        this.audio.play();
    }

    componentDidUpdate() {
        this.audio.play();
    }

    render() {

        return (
            <div>
                <button onClick={this.pause}>Pause</button>
            </div>
        );
    }
}


export default Music;
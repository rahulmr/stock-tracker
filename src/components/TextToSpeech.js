import React, {Component} from 'react';

import {Button} from 'antd';
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

        var synthesis = window.speechSynthesis;
        this.voice = synthesis.getVoices().filter((voice) => voice.lang === 'en')[0];
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
        
        const {speechText = ''} = this.props;
        // Create an utterance object
        var utterance = new SpeechSynthesisUtterance(speechText);

        // Set utterance properties
        utterance.voice = this.voice;
        utterance.pitch = 1.5;
        utterance.rate = 1.25;
        utterance.volume = 0.8;
      
        // Speak the utterance
        synthesis.speak(utterance);

        return (
            <div>
                <Button onClick={this.pause} className="ant-btn ant-btn-primary" >Pause</Button>
            </div>
        );
    }
}


export default Music;
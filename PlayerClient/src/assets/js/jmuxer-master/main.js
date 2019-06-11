import JMuxer from 'jmuxer';

const jmuxer = new JMuxer({
              node: 'player',
              debug: true
            });
            
 /* Now feed media data using feed method. audio and video is buffer data and duration is in miliseconds */
 jmuxer.feed({
      audio: audio,
      video: video,
      duration: duration
 });
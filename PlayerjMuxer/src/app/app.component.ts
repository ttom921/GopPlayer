import { Component, OnInit } from '@angular/core';
import { JMuxmer } from "./jmuxer/jmuxer.js";
//declare var JMuxer: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PlayerjMuxer';
  ngOnInit(): void {
    var socketURL = 'wss://jmuxer-demo-server.herokuapp.com';
    var jmuxer = new JMuxmer({
      node: 'player',
      debug: true
    });

    var ws = new WebSocket(socketURL);
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('message', function (event) {
      var data = AppComponent.dataparse(event.data);
      jmuxer.feed(data);
    });

    ws.addEventListener('error', function (e) {
      console.log('Socket Error');
    });
  }



  static dataparse(data) {
    var input = new Uint8Array(data),
      dv = new DataView(input.buffer),
      duration,
      audioLength,
      audio,
      video;

    duration = dv.getUint16(0, true);
    audioLength = dv.getUint16(2, true);
    audio = input.subarray(4, (audioLength + 4));
    video = input.subarray(audioLength + 4);

    return {
      audio: audio,
      video: video,
      duration: duration
    };
  }
}

import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import JMuxer from 'jmuxer';
//有關264的元件
//declare var JMuxer: any;
declare var PCMPlayer: any;
@Component({
  selector: 'app-disp264',
  templateUrl: './disp264.component.html',
  styleUrls: ['./disp264.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Disp264Component implements OnInit, AfterViewInit {
  clientclassname = this.constructor.name;
  @Input() title: string = "aaaaaaaaaaaaaaa";

  //#regin H264相關
  jmuxer: any;
  pcmPlayer: any;

  //#endregin H264相關


  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    console.log(this.title);
    //初始化畫面元件
    this.jmuxer = new JMuxer({
      node: this.title,
      mode: 'both', /* available values are: both, audio and video */
      debug: true,
      duration: 1000
    });
    this.pcmPlayer = new PCMPlayer({
      encoding: '16bitInt',
      channels: 1,
      sampleRate: 8000,
      flushingTime: 0
    });
  }
  public SetVideoAudioData(videodataarray, audiodataarray) {
    this.jmuxer.feed({
      node: this.title,
      video: new Uint8Array(videodataarray),
      //audio: new Uint8Array(this.audiodataarray[index])
      audio: audiodataarray
    });
  }
}

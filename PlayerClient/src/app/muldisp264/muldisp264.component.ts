import { Component, OnInit } from '@angular/core';
import { ImageFileService } from '../services/image-file.service';
import { H264DataService } from '../services/h264-data.service';
import JMuxer from 'jmuxer';
//有關264的元件
//declare var JMuxer: any;
declare var PCMPlayer: any;

@Component({
  selector: 'app-muldisp264',
  templateUrl: './muldisp264.component.html',
  styleUrls: ['./muldisp264.component.scss']
})
export class Muldisp264Component implements OnInit {
  title = 'mdisp264';
  jmuxers = [];
  pcmPlayers = [];
  videodataarray = [];
  audiodataarray = [];
  constructor(
    private imageFileService: ImageFileService,
    private h264DataService: H264DataService
  ) { }

  ngOnInit() {
    for (let index = 0; index < 8; index++) {
      let jmuxer = new JMuxer({
        node: `player${index}`,
        mode: 'both', /* available values are: both, audio and video */
        debug: false,
        duration: 1000
      });
      this.jmuxers.push(jmuxer);

      let pcmPlayer = new PCMPlayer({
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 0
      });
      this.pcmPlayers.push(jmuxer);

    }
  }
  //發送影像資料
  public Upload(file: HTMLInputElement) {
    if (file.value.length === 0) return;
    //讀所有的檔案
    const uploadPromises = [];
    const files: FileList = file.files;
    let Bufferary = new ArrayBuffer(files.length);
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      //fmtmsg = element.name;
      //console.log(fmtmsg);
      let uploadPromise = this.imageFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
    }
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
      }
      //#region 使用遞回
      let maximgnum = files.length;
      let count = 0;
      this.h264DataService.get264data(count, maximgnum, Bufferary, false, /* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[],  this.videodataarray, this.audiodataarray);
      //console.log("data video get end " + this.videodataarray.length);
      //console.log("data audio get end " + this.audiodataarray.length);
      let index = 0;
      setInterval(() => {
        this.jmuxers.forEach((item, idx) => {
          item.feed({
            node: 'player' + idx,
            video: new Uint8Array(this.videodataarray[index]),
            audio: this.audiodataarray[index]
          });
        });

        // this.jmuxer.feed({
        //   node: 'player',
        //   video: new Uint8Array(this.videodataarray[index]),
        //   //audio: new Uint8Array(this.audiodataarray[index])
        //   audio: this.audiodataarray[index]
        // });
        index = (index + 1) % this.videodataarray.length;
      }, 800);
      //#endregion 使用遞回
    });
  }
}

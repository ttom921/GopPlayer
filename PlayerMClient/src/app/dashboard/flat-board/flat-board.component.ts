import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { H264DataService } from 'src/app/services/h264-data.service';
import { Disp264Component } from '../disp264/disp264.component';
import { ImageFileService } from 'src/app/services/image-file.service';

@Component({
  selector: 'app-flat-board',
  templateUrl: './flat-board.component.html',
  styleUrls: ['./flat-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatBoardComponent implements OnInit, AfterViewInit {

  @ViewChild('player0', { static: true }) player0: Disp264Component
  @ViewChild('player1', { static: true }) player1: Disp264Component
  @ViewChild('player2', { static: true }) player2: Disp264Component
  @ViewChild('player3', { static: true }) player3: Disp264Component
  @ViewChild('player4', { static: true }) player4: Disp264Component
  @ViewChild('player5', { static: true }) player5: Disp264Component
  @ViewChild('player6', { static: true }) player6: Disp264Component
  @ViewChild('player7', { static: true }) player7: Disp264Component

  videodataarray = [];
  audiodataarray = [];
  channels = ["player0", "player1", "player2", "player3",
    "player4", "player5", "player6", "player7"];
  play264s = [];
  constructor(
    private imageFileService: ImageFileService,
    private h264DataService: H264DataService
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.play264s.push(this.player0);
    this.play264s.push(this.player1);
    this.play264s.push(this.player2);
    this.play264s.push(this.player3);
    this.play264s.push(this.player4);
    this.play264s.push(this.player5);
    this.play264s.push(this.player6);
    this.play264s.push(this.player7);
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
      this.h264DataService.get264data(count, maximgnum, Bufferary, false, /* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[], this.videodataarray, this.audiodataarray);
      console.log("data video get end " + this.videodataarray.length);
      console.log("data audio get end " + this.audiodataarray.length);
      let index = 0;
      setInterval(() => {
        for (let idx = 0; idx < this.play264s.length; idx++) {
          const element = this.play264s[idx];
          element.SetVideoAudioData(this.videodataarray[index], this.audiodataarray[index]);

        }
        // this.play264s.forEach(element => {
        //   element.SetVideoAudioData(this.videodataarray[index], this.audiodataarray[index]);
        // });
        //this.play0.SetVideoAudioData(this.videodataarray[index], this.audiodataarray[index]);
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

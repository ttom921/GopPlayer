import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageFileService } from '../services/image-file.service';
declare var JMuxer: any;
declare var PCMPlayer: any;
declare var msgpack: any;
declare var fdkAac: any;

@Component({
  selector: 'app-ver1',
  templateUrl: './ver1.component.html',
  styleUrls: ['./ver1.component.scss']
})
export class Ver1Component implements OnInit {
  title = 'ver1';
  jmuxer: any;
  pcmPlayer: any;
  files = ["1557749607.gop", "1557749608.gop", "1557749609.gop", "1557749610.gop", "1557749611.gop", "1557749612.gop", "1557749613.gop", "1557749614.gop", "1557749615.gop", "1557749616.gop", "1557749617.gop", "picture.jpg"]; // 蔡依林
  videodataarray = [];
  constructor(
    private http: HttpClient,
    private imageFileService: ImageFileService
  ) { }

  ngOnInit() {
    this.jmuxer = new JMuxer({
      node: 'player',
      mode: 'video', /* available values are: both, audio and video */
      debug: true,
      // fps :30
    });
    this.pcmPlayer = new PCMPlayer({
      encoding: '16bitInt',
      channels: 1,
      sampleRate: 8000,
      flushingTime: 0
    });
    let gopFiles = this.files.slice();
    let flag = false;  // key flag container
    // star feed video data ...
    // if (gopFiles.length > 0) {
    //   this.filegop(gopFiles, flag, this.jmuxer, /* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[], this.pcmPlayer);
    // }
  }
  //
  setHeader(pcm_combine_arr) {
    var chunkId = [82, 73, 70, 70];    // 4 區塊編號     big     "RIFF"
    var chunkSize = this.intTobytes(pcm_combine_arr.length + 36, 4);      // 4 總區塊大小    little    N+36
    var format = [87, 65, 86, 69];    // 4 檔案格式     BIG     "WAVE"
    var subchunk1ID = [102, 109, 116, 32]; // 4 子區塊1標籤   BIG     "fmt"
    var subchunk1Size = [16, 0, 0, 0];     // 4 子區塊1大小   little    16
    var audioFormat = [1, 0];        // 2 音訊格式     little    1(PCM)
    var numChannels = [1, 0];        // 2 聲道數量     little    1聲道
    var sampleRate = [64, 31, 0, 0];    // 4 取樣頻率     little    =取樣點/秒(HZ)
    var byteRate = [128, 62, 0, 0];   // 4 位元組率     little    =取樣點*位元深度/8
    var blockAlign = [4, 0];        // 2 區塊對齊     little    4
    var bitsPerSample = [16, 0];       // 2 位元深度     little    取樣位元深度
    var subchunk2ID = [100, 97, 116, 97];  // 4 子區塊2標籤   BIG     "data"
    var subchunk2Size = this.intTobytes(pcm_combine_arr.length, 4);   // 4 子區塊2大小   little    N

    return [].concat(chunkId).concat(chunkSize).concat(format).concat(subchunk1ID).concat(subchunk1Size).concat(audioFormat).concat(numChannels).concat(sampleRate).concat(byteRate).concat(blockAlign).concat(bitsPerSample).concat(subchunk2ID).concat(subchunk2Size);
  }
  intTobytes(value, segments) {

    var a = [];
    for (var i = segments - 1; i >= 0; i--) {
      a[i] = (value >> (8 * i)) & 0xFF;
    }

    return a;
  }

  intTobytesArr(arr) {
    var returnArr = [];
    for (var i = arr.length - 1; i >= 0; i--) {
      returnArr = returnArr.concat(this.intTobytes(arr[i], 2));
    }
    return returnArr;
  }

  decode(samples) {
    /** @type {!Int16Array} */
    let pcmSamples = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      pcmSamples[i] = this.decodeSample(samples[i]);
    }
    return pcmSamples;
  }
  decodeSample(aLawSample) {
    /** @type {number} */
    let sign = 0;
    aLawSample ^= 0x55;
    if (aLawSample & 0x80) {
      aLawSample &= ~(1 << 7);
      sign = -1;
    }
    /** @type {number} */
    let position = ((aLawSample & 0xF0) >> 4) + 4;
    /** @type {number} */
    let decoded = 0;
    if (position != 4) {
      decoded = ((1 << position) |
        ((aLawSample & 0x0F) << (position - 4)) |
        (1 << (position - 5)));
    } else {
      decoded = (aLawSample << 1) | 1;
    }
    decoded = (sign === 0) ? (decoded) : (-decoded);
    return (decoded * 8) * -1;
  }
  //


  filegop(gopFiles, flag, jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, pcmPlayer) {
    let files = gopFiles;
    let minut_secode = files.shift();
    let filepath = './assets/gops/tsai/06/' + minut_secode; // 蔡依林
    this.http.get(filepath, { responseType: 'arraybuffer' })
      // .subscribe(data => console.log(data));
      .subscribe((data) => {
        var m = msgpack.decode(new Uint8Array(data));
        var pcm_combine_arr = [];
        var h264_combine_arr = [];
        // console.log(m.gop);
        for (var num in m.gop) {
          // 找出第一個為true的key
          if (m.gop[num].key == true) {
            flag = true;
          }
          if (flag) {
            // feed video data
            // h264_combine_arr = h264_combine_arr.concat(Array.from(m.gop[num].v));

            video_buffer[video_buffer.length] = Array.from(m.gop[num].v);
            if (m.gop[num].key) {
              key_buffer.push('I');
            }
            else {
              key_buffer.push('P');
            }
            // video_buffer.push(m.gop[num].key);

            // feed audio data
            if (m.gop[num].a) {
              var pcm_data = this.decode(m.gop[num].a);
              var pcm_data_arr = this.intTobytesArr(Array.from(pcm_data));
              // pcm_combine_arr = pcm_combine_arr.concat(pcm_data_arr);
              audio_buffer[audio_buffer.length] = pcm_data_arr;
              // pcmPlayer.feed(pcm_data);
            }
          }
        }
        // console.log(audio_buffer);
        var current_key;
        var temp_video_buffer = video_buffer.slice(0); // clone video_buffer
        var temp_audio_buffer = audio_buffer.slice(0); // clone audio_buffer
        var key_buffer_length = key_buffer.length;
        for (var i = 0; i < key_buffer_length; i++) {
          current_key = key_buffer[0];
          if (current_key == 'I')
            i_count++;
          if (i_count == 2)
            break;
          current_video = current_video.concat(temp_video_buffer[i]);
          if (temp_audio_buffer[i])
            current_audio = current_audio.concat(temp_audio_buffer[i]);
          key_buffer.shift();
          video_buffer.shift();
          if (temp_audio_buffer[i])
            audio_buffer.shift();
          // console.log('.....................................');
        }
        if (i_count == 2 || gopFiles.length == 0) {
          var pcm_header = this.setHeader(current_audio);
          pcm_header = pcm_header.concat(Array.from(current_audio));
          fdkAac(new Uint8Array(pcm_header), function (err, aac) {
            if (aac) {
              const file = ('File' in self)
                ? new File([aac.buffer], 'test.aac', { type: 'audio/aac' })
                // Safari does not have File in workers
                : new Blob([aac.buffer], { type: 'audio/aac' })
              const event = URL.createObjectURL(file);
              var node = document.createElement('audio');
              node.setAttribute("src", event);
              node.setAttribute("controls", "true");
              document.body.appendChild(node);

              jmuxer.feed({
                video: new Uint8Array(current_video),
                audio: aac,
                duration: 1000
              });
            }
          });
          current_video = [];
          current_audio = [];
          i_count = 0;
        }

        if (gopFiles.length > 0) {
          this.filegop(gopFiles, flag, jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, pcmPlayer);
        }
      });
  }
  // 發送圖片
  public Upload(file: HTMLInputElement) {
    if (file.value.length === 0) return;
    //讀所有的圖檔
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

      this._getData(count, maximgnum, Bufferary, false, this.jmuxer,/* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[], this.pcmPlayer, this.videodataarray);






      // //#endregion 使用遞回

      // //開始發射
      // let maximgnum = files.length;
      // let count = 0;
      // let video_buffer = [];
      // let audio_buffer = [];
      // let key_buffer = [];
      // let current_video = [];
      // let current_audio = [];
      // let i_count = 0;
      // // for (let count = 0; count < maximgnum; count++) {
      // //   this._sendData(count, maximgnum, Bufferary[count], false, this.jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, this.pcmPlayer);

      // // }
      // setInterval(() => {
      //   //this.filegop(gopFiles, flag, jmuxer, /* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[], pcmPlayer);
      //   this._sendData(count, maximgnum, Bufferary[count], false, this.jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, this.pcmPlayer);
      //   count = (count + 1) % maximgnum;
      // }, 66);



    });
  }
  _getData(count: number, maximgnum: number, Bufferary, flag, jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, pcmPlayer, store_video_buffer) {
    if ((count + 1) > maximgnum) return;
    var m = msgpack.decode(new Uint8Array(Bufferary[count]));
    var pcm_combine_arr = [];
    var h264_combine_arr = [];
    // console.log(m.gop);
    for (var num in m.gop) {
      // 找出第一個為true的key
      if (m.gop[num].key == true) {
        flag = true;
      }
      if (flag) {
        // feed video data
        // h264_combine_arr = h264_combine_arr.concat(Array.from(m.gop[num].v));

        video_buffer[video_buffer.length] = Array.from(m.gop[num].v);
        if (m.gop[num].key) {
          key_buffer.push('I');
        }
        else {
          key_buffer.push('P');
        }
        // video_buffer.push(m.gop[num].key);

        // feed audio data
        if (m.gop[num].a) {
          var pcm_data = this.decode(m.gop[num].a);
          var pcm_data_arr = this.intTobytesArr(Array.from(pcm_data));
          // pcm_combine_arr = pcm_combine_arr.concat(pcm_data_arr);
          audio_buffer[audio_buffer.length] = pcm_data_arr;
          // pcmPlayer.feed(pcm_data);
        }
      }
    }
    // console.log(audio_buffer);
    var current_key;
    var temp_video_buffer = video_buffer.slice(0); // clone video_buffer
    var temp_audio_buffer = audio_buffer.slice(0); // clone audio_buffer
    var key_buffer_length = key_buffer.length;
    for (var i = 0; i < key_buffer_length; i++) {
      current_key = key_buffer[0];
      if (current_key == 'I')
        i_count++;
      if (i_count == 2)
        break;
      current_video = current_video.concat(temp_video_buffer[i]);
      if (temp_audio_buffer[i])
        current_audio = current_audio.concat(temp_audio_buffer[i]);
      key_buffer.shift();
      video_buffer.shift();
      if (temp_audio_buffer[i])
        audio_buffer.shift();
      // console.log('.....................................');
    }
    //console.log("count=" + count + " maximgnum=" + maximgnum);
    if (i_count == 2 || (count + 1) === maximgnum) {
      var pcm_header = this.setHeader(current_audio);
      pcm_header = pcm_header.concat(Array.from(current_audio));
      fdkAac(new Uint8Array(pcm_header), function (err, aac) {
        if (aac) {
          const file = ('File' in self)
            ? new File([aac.buffer], 'test.aac', { type: 'audio/aac' })
            // Safari does not have File in workers
            : new Blob([aac.buffer], { type: 'audio/aac' })
          const event = URL.createObjectURL(file);

          var node = document.createElement('audio');
          node.setAttribute("src", event);
          node.setAttribute("controls", "true");
          //node.setAttribute("style", "background-color:red; font-size:2em;");
          //先將聲音元件hide
          node.setAttribute("style", "display:none;");
          document.body.appendChild(node);

          //先存下來，之後傳送後在播
          store_video_buffer.push(current_video);

          // jmuxer.feed({
          //   video: new Uint8Array(current_video),
          //   audio: aac,
          //   duration: 1000
          // });
        }
      });
      current_video = [];
      current_audio = [];
      i_count = 0;
    }
    count++;
    if (count < maximgnum - 1) {
      this._getData(count, maximgnum, Bufferary, flag, jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, pcmPlayer, store_video_buffer);
    } else {
      console.log("data send end " + this.videodataarray.length);
      let index = 0;
      setInterval(() => {

        this.jmuxer.feed({
          video: new Uint8Array(this.videodataarray[index])
        });
        index = (index + 1) % this.videodataarray.length;
      }, 800);
    }

  }
  _sendData(count: number, maximgnum: number, Bufferary: ArrayBuffer, flag, jmuxer, video_buffer, audio_buffer, key_buffer, i_count, current_video, current_audio, pcmPlayer) {
    var m = msgpack.decode(new Uint8Array(Bufferary));
    var pcm_combine_arr = [];
    var h264_combine_arr = [];
    // console.log(m.gop);
    for (var num in m.gop) {
      // 找出第一個為true的key
      if (m.gop[num].key == true) {
        flag = true;
      }
      if (flag) {
        // feed video data
        // h264_combine_arr = h264_combine_arr.concat(Array.from(m.gop[num].v));

        video_buffer[video_buffer.length] = Array.from(m.gop[num].v);
        if (m.gop[num].key) {
          key_buffer.push('I');
        }
        else {
          key_buffer.push('P');
        }
        // video_buffer.push(m.gop[num].key);

        // feed audio data
        if (m.gop[num].a) {
          var pcm_data = this.decode(m.gop[num].a);
          var pcm_data_arr = this.intTobytesArr(Array.from(pcm_data));
          // pcm_combine_arr = pcm_combine_arr.concat(pcm_data_arr);
          audio_buffer[audio_buffer.length] = pcm_data_arr;
          // pcmPlayer.feed(pcm_data);
        }
      }
    }
    // console.log(audio_buffer);
    var current_key;
    var temp_video_buffer = video_buffer.slice(0); // clone video_buffer
    var temp_audio_buffer = audio_buffer.slice(0); // clone audio_buffer
    var key_buffer_length = key_buffer.length;
    for (var i = 0; i < key_buffer_length; i++) {
      current_key = key_buffer[0];
      if (current_key == 'I')
        i_count++;
      if (i_count == 2)
        break;
      current_video = current_video.concat(temp_video_buffer[i]);
      if (temp_audio_buffer[i])
        current_audio = current_audio.concat(temp_audio_buffer[i]);
      key_buffer.shift();
      video_buffer.shift();
      if (temp_audio_buffer[i])
        audio_buffer.shift();
      // console.log('.....................................');
    }
    //console.log("count=" + count + " maximgnum=" + maximgnum);
    if (i_count == 2 || (count + 1) === maximgnum) {
      var pcm_header = this.setHeader(current_audio);
      pcm_header = pcm_header.concat(Array.from(current_audio));
      fdkAac(new Uint8Array(pcm_header), function (err, aac) {
        if (aac) {
          const file = ('File' in self)
            ? new File([aac.buffer], 'test.aac', { type: 'audio/aac' })
            // Safari does not have File in workers
            : new Blob([aac.buffer], { type: 'audio/aac' })
          const event = URL.createObjectURL(file);
          if (this.audionode == null) {
            // var node = document.createElement('audio');
            this.audionode = document.createElement('audio');
            let node = this.audionode;
            node.setAttribute("id", "myaudio");
            node.setAttribute("src", event);
            node.setAttribute("controls", "true");
            document.body.appendChild(node);
          } else {
            this.audionode.setAttribute("src", event);

          }



          jmuxer.feed({
            video: new Uint8Array(current_video),
            audio: aac,
            duration: 1000
          });
        }
      });
      current_video = [];
      current_audio = [];
      i_count = 0;
    }

  }

}

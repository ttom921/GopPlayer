import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageFileService {

  constructor() { }
  public GetBufferFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        let buf = reader.result;
        resolve(buf);
      };
      reader.onerror = () => {
        reject("讀取檔案失敗");
      }
    });
  }
}

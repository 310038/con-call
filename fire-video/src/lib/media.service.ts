import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class MediaService {
  /** 獲取 user 的鏡頭跟麥克風裝置
   * @returns {Promise<MediaStream>}
   */
  async getUserMedia(): Promise<MediaStream> {

    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  }
  disableVideo(stream: MediaStream): void {
    stream.getVideoTracks()[0].enabled = false;
  }
  enableVideo(stream: MediaStream): void {
    stream.getVideoTracks()[0].enabled = true;
  }

  enableMic(stream: MediaStream): void {
    stream.getAudioTracks()[0].enabled = true;
  }
  disableMic(stream:MediaStream):void{
    stream.getAudioTracks()[0].enabled = false;
  }

}

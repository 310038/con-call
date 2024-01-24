/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ScreenshotService {
  constructor(private http: HttpClient) { }

  // 截圖上傳到 CDN 的圖檔URL陣列
  imageUrlSubject = new BehaviorSubject<string[]>(['', '', '']);

  // 計算有幾張截圖已產生，以利截圖檔案的命名
  fileCounter = 1;

  /** 截圖並上傳 CDN
   * @param folderName 指定要上傳到 CDN 的哪一個檔案夾
   * @param video 指定對哪一個 HTMLVideoElement 截圖
   */
  async screenshot(folderName: string, video: ElementRef<HTMLVideoElement>) {

    const width = video.nativeElement.videoWidth;
    const height = video.nativeElement.videoHeight;

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    context?.drawImage(video.nativeElement, 0, 0, width, height);

    canvas.toBlob(async (blob) => {

      const fileName = `image${this.fileCounter++}.jpeg`;

      await this.uploadToCDN(folderName, blob, fileName);
    }, 'image/jpeg');

  }

  /** 取得 imageUrlSubject。
   * @returns Promise<Observable<string[]>>
   */
  async getScreenshotUrl(): Promise<Observable<string[]>> {
    return this.imageUrlSubject.asObservable();
  }

  /** 將新的截圖檔案的 url 更新到 imageUrlSubject 中，並使用rxjs 的 next() 告知所有有訂閱 imageUrlSubject 的人
   * @param newImageUrl
   */
  async updateImageURIs(newImageUrl: string) {
    const currentSubject = this.imageUrlSubject.value;

    const updatedURIs = [newImageUrl, ...currentSubject,];
    this.imageUrlSubject.next(updatedURIs);
  }

  /** 將檔案上傳到 CDN
   */
  async uploadToCDN(folderName: string, file: any, fileName: string) {

    const formData = new FormData();
    formData.append(`${folderName}/${fileName}`, file);

    return new Promise((resolve, reject) => {
      this.http.post('https://his.hepiuscare.com.tw/resources/hpc/upload', formData).subscribe(
          (response) => {
            this.updateImageURIs(response.toString());
            resolve(response);
          },
          (error) => {
            reject(error);
          }
      );
    });
  }
}

import { ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class ScreenshotService {
    private http;
    constructor(http: HttpClient);
    imageUrlSubject: BehaviorSubject<string[]>;
    fileCounter: number;
    /** 截圖並上傳 CDN
     * @param folderName 指定要上傳到 CDN 的哪一個檔案夾
     * @param video 指定對哪一個 HTMLVideoElement 截圖
     */
    screenshot(folderName: string, video: ElementRef<HTMLVideoElement>): Promise<void>;
    /** 取得 imageUrlSubject。
     * @returns Promise<Observable<string[]>>
     */
    getScreenshotUrl(): Promise<Observable<string[]>>;
    /** 將新的截圖檔案的 url 更新到 imageUrlSubject 中，並使用rxjs 的 next() 告知所有有訂閱 imageUrlSubject 的人
     * @param newImageUrl
     */
    updateImageURIs(newImageUrl: string): Promise<void>;
    /** 將檔案上傳到 CDN
     */
    uploadToCDN(folderName: string, file: any, fileName: string): Promise<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScreenshotService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScreenshotService>;
}

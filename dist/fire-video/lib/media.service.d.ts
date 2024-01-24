import * as i0 from "@angular/core";
export declare class MediaService {
    /** 獲取 user 的鏡頭跟麥克風裝置
     * @returns {Promise<MediaStream>}
     */
    getUserMedia(): Promise<MediaStream>;
    disableVideo(stream: MediaStream): void;
    enableVideo(stream: MediaStream): void;
    enableMic(stream: MediaStream): void;
    disableMic(stream: MediaStream): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MediaService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MediaService>;
}

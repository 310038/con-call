import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class MediaService {
    /** 獲取 user 的鏡頭跟麥克風裝置
     * @returns {Promise<MediaStream>}
     */
    async getUserMedia() {
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
    }
    disableVideo(stream) {
        stream.getVideoTracks()[0].enabled = false;
    }
    enableVideo(stream) {
        stream.getVideoTracks()[0].enabled = true;
    }
    enableMic(stream) {
        stream.getAudioTracks()[0].enabled = true;
    }
    disableMic(stream) {
        stream.getAudioTracks()[0].enabled = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: MediaService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: MediaService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: MediaService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2ZpcmUtdmlkZW8vc3JjL2xpYi9tZWRpYS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTTNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFlBQVk7UUFFaEIsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztZQUN6QyxLQUFLLEVBQUUsSUFBSTtZQUNYLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELFlBQVksQ0FBQyxNQUFtQjtRQUM5QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM3QyxDQUFDO0lBQ0QsV0FBVyxDQUFDLE1BQW1CO1FBQzdCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBbUI7UUFDM0IsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDNUMsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFrQjtRQUMzQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM3QyxDQUFDOzhHQXZCVSxZQUFZO2tIQUFaLFlBQVksY0FIWCxNQUFNOzsyRkFHUCxZQUFZO2tCQUp4QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuXG5leHBvcnQgY2xhc3MgTWVkaWFTZXJ2aWNlIHtcbiAgLyoqIOeNsuWPliB1c2VyIOeahOmPoemgrei3n+m6peWFi+miqOijnee9rlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZWRpYVN0cmVhbT59XG4gICAqL1xuICBhc3luYyBnZXRVc2VyTWVkaWEoKTogUHJvbWlzZTxNZWRpYVN0cmVhbT4ge1xuXG4gICAgcmV0dXJuIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcbiAgICAgIHZpZGVvOiB0cnVlLFxuICAgICAgYXVkaW86IHRydWUsXG4gICAgfSk7XG4gIH1cbiAgZGlzYWJsZVZpZGVvKHN0cmVhbTogTWVkaWFTdHJlYW0pOiB2b2lkIHtcbiAgICBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXS5lbmFibGVkID0gZmFsc2U7XG4gIH1cbiAgZW5hYmxlVmlkZW8oc3RyZWFtOiBNZWRpYVN0cmVhbSk6IHZvaWQge1xuICAgIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZW5hYmxlTWljKHN0cmVhbTogTWVkaWFTdHJlYW0pOiB2b2lkIHtcbiAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5lbmFibGVkID0gdHJ1ZTtcbiAgfVxuICBkaXNhYmxlTWljKHN0cmVhbTpNZWRpYVN0cmVhbSk6dm9pZHtcbiAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxufVxuIl19
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ScreenshotService {
    constructor(http) {
        this.http = http;
        // 截圖上傳到 CDN 的圖檔URL陣列
        this.imageUrlSubject = new BehaviorSubject(['', '', '']);
        // 計算有幾張截圖已產生，以利截圖檔案的命名
        this.fileCounter = 1;
    }
    /** 截圖並上傳 CDN
     * @param folderName 指定要上傳到 CDN 的哪一個檔案夾
     * @param video 指定對哪一個 HTMLVideoElement 截圖
     */
    async screenshot(folderName, video) {
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
    async getScreenshotUrl() {
        return this.imageUrlSubject.asObservable();
    }
    /** 將新的截圖檔案的 url 更新到 imageUrlSubject 中，並使用rxjs 的 next() 告知所有有訂閱 imageUrlSubject 的人
     * @param newImageUrl
     */
    async updateImageURIs(newImageUrl) {
        const currentSubject = this.imageUrlSubject.value;
        const updatedURIs = [newImageUrl, ...currentSubject,];
        this.imageUrlSubject.next(updatedURIs);
    }
    /** 將檔案上傳到 CDN
     */
    async uploadToCDN(folderName, file, fileName) {
        const formData = new FormData();
        formData.append(`${folderName}/${fileName}`, file);
        return new Promise((resolve, reject) => {
            this.http.post('https://his.hepiuscare.com.tw/resources/hpc/upload', formData).subscribe((response) => {
                this.updateImageURIs(response.toString());
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ScreenshotService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ScreenshotService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ScreenshotService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZmlyZS12aWRlby9zcmMvbGliL3NjcmVlbnNob3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1REFBdUQ7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBYyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDOzs7QUFLbkQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBRXBDLHFCQUFxQjtRQUNyQixvQkFBZSxHQUFHLElBQUksZUFBZSxDQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlELHVCQUF1QjtRQUN2QixnQkFBVyxHQUFHLENBQUMsQ0FBQztJQU53QixDQUFDO0lBUXpDOzs7T0FHRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBa0IsRUFBRSxLQUFtQztRQUV0RSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUUvQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhELE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXZCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBRTNCLE1BQU0sUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7WUFFbkQsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRW5CLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsV0FBbUI7UUFDdkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFFbEQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxjQUFjLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7T0FDRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBa0IsRUFBRSxJQUFTLEVBQUUsUUFBZ0I7UUFFL0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNoQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBVSxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5ELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUNwRixDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNYLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQixDQUFDLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDUixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsQ0FBQyxDQUNKLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OEdBdkVVLGlCQUFpQjtrSEFBakIsaUJBQWlCLGNBRmhCLE1BQU07OzJGQUVQLGlCQUFpQjtrQkFIN0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgU2NyZWVuc2hvdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIC8vIOaIquWcluS4iuWCs+WIsCBDRE4g55qE5ZyW5qqUVVJM6Zmj5YiXXG4gIGltYWdlVXJsU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nW10+KFsnJywgJycsICcnXSk7XG5cbiAgLy8g6KiI566X5pyJ5bm+5by15oiq5ZyW5bey55Si55Sf77yM5Lul5Yip5oiq5ZyW5qqU5qGI55qE5ZG95ZCNXG4gIGZpbGVDb3VudGVyID0gMTtcblxuICAvKiog5oiq5ZyW5Lim5LiK5YKzIENETlxuICAgKiBAcGFyYW0gZm9sZGVyTmFtZSDmjIflrpropoHkuIrlgrPliLAgQ0ROIOeahOWTquS4gOWAi+aqlOahiOWkvlxuICAgKiBAcGFyYW0gdmlkZW8g5oyH5a6a5bCN5ZOq5LiA5YCLIEhUTUxWaWRlb0VsZW1lbnQg5oiq5ZyWXG4gICAqL1xuICBhc3luYyBzY3JlZW5zaG90KGZvbGRlck5hbWU6IHN0cmluZywgdmlkZW86IEVsZW1lbnRSZWY8SFRNTFZpZGVvRWxlbWVudD4pIHtcblxuICAgIGNvbnN0IHdpZHRoID0gdmlkZW8ubmF0aXZlRWxlbWVudC52aWRlb1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHZpZGVvLm5hdGl2ZUVsZW1lbnQudmlkZW9IZWlnaHQ7XG5cbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBjb250ZXh0Py5kcmF3SW1hZ2UodmlkZW8ubmF0aXZlRWxlbWVudCwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjYW52YXMudG9CbG9iKGFzeW5jIChibG9iKSA9PiB7XG5cbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gYGltYWdlJHt0aGlzLmZpbGVDb3VudGVyKyt9LmpwZWdgO1xuXG4gICAgICBhd2FpdCB0aGlzLnVwbG9hZFRvQ0ROKGZvbGRlck5hbWUsIGJsb2IsIGZpbGVOYW1lKTtcbiAgICB9LCAnaW1hZ2UvanBlZycpO1xuXG4gIH1cblxuICAvKiog5Y+W5b6XIGltYWdlVXJsU3ViamVjdOOAglxuICAgKiBAcmV0dXJucyBQcm9taXNlPE9ic2VydmFibGU8c3RyaW5nW10+PlxuICAgKi9cbiAgYXN5bmMgZ2V0U2NyZWVuc2hvdFVybCgpOiBQcm9taXNlPE9ic2VydmFibGU8c3RyaW5nW10+PiB7XG4gICAgcmV0dXJuIHRoaXMuaW1hZ2VVcmxTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIOWwh+aWsOeahOaIquWcluaqlOahiOeahCB1cmwg5pu05paw5YiwIGltYWdlVXJsU3ViamVjdCDkuK3vvIzkuKbkvb/nlKhyeGpzIOeahCBuZXh0KCkg5ZGK55+l5omA5pyJ5pyJ6KiC6ZaxIGltYWdlVXJsU3ViamVjdCDnmoTkurpcbiAgICogQHBhcmFtIG5ld0ltYWdlVXJsXG4gICAqL1xuICBhc3luYyB1cGRhdGVJbWFnZVVSSXMobmV3SW1hZ2VVcmw6IHN0cmluZykge1xuICAgIGNvbnN0IGN1cnJlbnRTdWJqZWN0ID0gdGhpcy5pbWFnZVVybFN1YmplY3QudmFsdWU7XG5cbiAgICBjb25zdCB1cGRhdGVkVVJJcyA9IFtuZXdJbWFnZVVybCwgLi4uY3VycmVudFN1YmplY3QsXTtcbiAgICB0aGlzLmltYWdlVXJsU3ViamVjdC5uZXh0KHVwZGF0ZWRVUklzKTtcbiAgfVxuXG4gIC8qKiDlsIfmqpTmoYjkuIrlgrPliLAgQ0ROXG4gICAqL1xuICBhc3luYyB1cGxvYWRUb0NETihmb2xkZXJOYW1lOiBzdHJpbmcsIGZpbGU6IGFueSwgZmlsZU5hbWU6IHN0cmluZykge1xuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoYCR7Zm9sZGVyTmFtZX0vJHtmaWxlTmFtZX1gLCBmaWxlKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmh0dHAucG9zdCgnaHR0cHM6Ly9oaXMuaGVwaXVzY2FyZS5jb20udHcvcmVzb3VyY2VzL2hwYy91cGxvYWQnLCBmb3JtRGF0YSkuc3Vic2NyaWJlKFxuICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbWFnZVVSSXMocmVzcG9uc2UudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
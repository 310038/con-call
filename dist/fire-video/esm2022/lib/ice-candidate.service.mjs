import { FirebaseService } from './firebase.service';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class IceCandidateService {
    constructor() {
        this.fireBaseService = inject(FirebaseService);
    }
    /** 收集local，並監聽remote 的 ice candidates ， 且將收集到的 ice candidates 寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
     * 由於要建立點對點連接前，需要先收集 ICE 找到最適合的連線方式再交換 SPD 資訊，因此這個function用來收集 ICE Candidates。
     * 透過 addSubCollection() 創建 caller/callee 各自的subCollection，並將 ice candidates 寫入各自的 subCollection 中，
     * 同時，監聽另一方的 subCollection ，當收到對方的 ice candidates 時，將其轉換為 RTCIceCandidate 對象，然後添加到 此端的 RTCPeerConnection 中
     * @param roomId
     * @param peerConnection
     * @param localSubCollectionName
     * @param remoteSubCollectionName
     */
    async collectIceCandidates(roomId, peerConnection, localSubCollectionName, remoteSubCollectionName) {
        const roomDocRef = this.fireBaseService.getDocRef('rooms', roomId);
        try {
            // 當local端收集到一個 ICE Candidates時，將觸發這個事件
            peerConnection.onicecandidate = async (event) => {
                // 如果事件中存在 ICE Candidates，則將其轉換為 JSON Object 並添加到 localSubCollectionName 這個 SubCollection 中
                if (event.candidate) {
                    // 存儲 local 的 ICE 候選者
                    this.fireBaseService.addSubCollection(roomDocRef, localSubCollectionName, event.candidate.toJSON());
                }
            };
            // 收集到一個 ICE Candidates時錯誤則觸發
            peerConnection.onicecandidateerror = (error) => {
                console.error(error);
            };
            // 利用 onSnapshot() 監聽 remote端(remoteSubCollectionName的collection) ， 當有 docChange 時，獲取的 ICE candidates 數據轉換為 RTCIceCandidate 對象，然後添加此端的到 RTCPeerConnection 中
            const remoteCandidatesCollection = roomDocRef.collection(remoteSubCollectionName);
            remoteCandidatesCollection.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === 'added') {
                        // 將每個新增的remote ICE Candidates 轉換為 RTCIceCandidate，並添加到 此RTCPeerConnection 中
                        const data = change.doc.data();
                        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: IceCandidateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: IceCandidateService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: IceCandidateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNlLWNhbmRpZGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZmlyZS12aWRlby9zcmMvbGliL2ljZS1jYW5kaWRhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBS25ELE1BQU0sT0FBTyxtQkFBbUI7SUFIaEM7UUFJRSxvQkFBZSxHQUFvQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7S0FrRDVEO0lBaERDOzs7Ozs7OztPQVFHO0lBQ0gsS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQWMsRUFBRSxjQUFpQyxFQUFFLHNCQUE4QixFQUFFLHVCQUErQjtRQUMzSSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDO1lBQ0gsdUNBQXVDO1lBQ3ZDLGNBQWMsQ0FBQyxjQUFjLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM5QywyRkFBMkY7Z0JBQzNGLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNwQixxQkFBcUI7b0JBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQ2pDLFVBQVUsRUFDVixzQkFBc0IsRUFDdEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FDM0IsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRUYsNkJBQTZCO1lBQzdCLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUM3QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQztZQUVGLDJKQUEySjtZQUMzSixNQUFNLDBCQUEwQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQ3BELHVCQUF1QixDQUMxQixDQUFDO1lBQ0YsMEJBQTBCLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2pELFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUM3QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7d0JBQzVCLDRFQUE0RTt3QkFDNUUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDL0IsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQzs4R0FsRFUsbUJBQW1CO2tIQUFuQixtQkFBbUIsY0FGbEIsTUFBTTs7MkZBRVAsbUJBQW1CO2tCQUgvQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpcmViYXNlU2VydmljZSB9IGZyb20gJy4vZmlyZWJhc2Uuc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEljZUNhbmRpZGF0ZVNlcnZpY2Uge1xuICBmaXJlQmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZSA9IGluamVjdChGaXJlYmFzZVNlcnZpY2UpO1xuXG4gIC8qKiDmlLbpm4Zsb2NhbO+8jOS4puebo+iBvXJlbW90ZSDnmoQgaWNlIGNhbmRpZGF0ZXMg77yMIOS4lOWwh+aUtumbhuWIsOeahCBpY2UgY2FuZGlkYXRlcyDlr6vlhaVmaXJlc3RvcmXkuK3mjIflrprnmoRzdWJDb2xsZWN0aW9uKGNhbGxlcuaIlmNhbGxlZSnkuK3ku6XliKnpgLLooYzkuqTmj5vjgIJcbiAgICog55Sx5pa86KaB5bu656uL6bue5bCN6bue6YCj5o6l5YmN77yM6ZyA6KaB5YWI5pS26ZuGIElDRSDmib7liLDmnIDpganlkIjnmoTpgKPnt5rmlrnlvI/lho3kuqTmj5sgU1BEIOizh+ioiu+8jOWboOatpOmAmeWAi2Z1bmN0aW9u55So5L6G5pS26ZuGIElDRSBDYW5kaWRhdGVz44CCXG4gICAqIOmAj+mBjiBhZGRTdWJDb2xsZWN0aW9uKCkg5Ym15bu6IGNhbGxlci9jYWxsZWUg5ZCE6Ieq55qEc3ViQ29sbGVjdGlvbu+8jOS4puWwhyBpY2UgY2FuZGlkYXRlcyDlr6vlhaXlkIToh6rnmoQgc3ViQ29sbGVjdGlvbiDkuK3vvIxcbiAgICog5ZCM5pmC77yM55uj6IG95Y+m5LiA5pa555qEIHN1YkNvbGxlY3Rpb24g77yM55W25pS25Yiw5bCN5pa555qEIGljZSBjYW5kaWRhdGVzIOaZgu+8jOWwh+WFtui9ieaPm+eCuiBSVENJY2VDYW5kaWRhdGUg5bCN6LGh77yM54S25b6M5re75Yqg5YiwIOatpOerr+eahCBSVENQZWVyQ29ubmVjdGlvbiDkuK1cbiAgICogQHBhcmFtIHJvb21JZFxuICAgKiBAcGFyYW0gcGVlckNvbm5lY3Rpb25cbiAgICogQHBhcmFtIGxvY2FsU3ViQ29sbGVjdGlvbk5hbWVcbiAgICogQHBhcmFtIHJlbW90ZVN1YkNvbGxlY3Rpb25OYW1lXG4gICAqL1xuICBhc3luYyBjb2xsZWN0SWNlQ2FuZGlkYXRlcyhyb29tSWQ6IHN0cmluZywgcGVlckNvbm5lY3Rpb246IFJUQ1BlZXJDb25uZWN0aW9uLCBsb2NhbFN1YkNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIHJlbW90ZVN1YkNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByb29tRG9jUmVmID0gdGhpcy5maXJlQmFzZVNlcnZpY2UuZ2V0RG9jUmVmKCdyb29tcycsIHJvb21JZCk7XG5cbiAgICB0cnkge1xuICAgICAgLy8g55W2bG9jYWznq6/mlLbpm4bliLDkuIDlgIsgSUNFIENhbmRpZGF0ZXPmmYLvvIzlsIfop7jnmbzpgJnlgIvkuovku7ZcbiAgICAgIHBlZXJDb25uZWN0aW9uLm9uaWNlY2FuZGlkYXRlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIOWmguaenOS6i+S7tuS4reWtmOWcqCBJQ0UgQ2FuZGlkYXRlc++8jOWJh+Wwh+WFtui9ieaPm+eCuiBKU09OIE9iamVjdCDkuKbmt7vliqDliLAgbG9jYWxTdWJDb2xsZWN0aW9uTmFtZSDpgJnlgIsgU3ViQ29sbGVjdGlvbiDkuK1cbiAgICAgICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgICAgIC8vIOWtmOWEsiBsb2NhbCDnmoQgSUNFIOWAmemBuOiAhVxuICAgICAgICAgIHRoaXMuZmlyZUJhc2VTZXJ2aWNlLmFkZFN1YkNvbGxlY3Rpb24oXG4gICAgICAgICAgICAgIHJvb21Eb2NSZWYsXG4gICAgICAgICAgICAgIGxvY2FsU3ViQ29sbGVjdGlvbk5hbWUsXG4gICAgICAgICAgICAgIGV2ZW50LmNhbmRpZGF0ZS50b0pTT04oKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIOaUtumbhuWIsOS4gOWAiyBJQ0UgQ2FuZGlkYXRlc+aZgumMr+iqpOWJh+inuOeZvFxuICAgICAgcGVlckNvbm5lY3Rpb24ub25pY2VjYW5kaWRhdGVlcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIOWIqeeUqCBvblNuYXBzaG90KCkg55uj6IG9IHJlbW90ZeerryhyZW1vdGVTdWJDb2xsZWN0aW9uTmFtZeeahGNvbGxlY3Rpb24pIO+8jCDnlbbmnIkgZG9jQ2hhbmdlIOaZgu+8jOeNsuWPlueahCBJQ0UgY2FuZGlkYXRlcyDmlbjmk5rovYnmj5vngrogUlRDSWNlQ2FuZGlkYXRlIOWwjeixoe+8jOeEtuW+jOa3u+WKoOatpOerr+eahOWIsCBSVENQZWVyQ29ubmVjdGlvbiDkuK1cbiAgICAgIGNvbnN0IHJlbW90ZUNhbmRpZGF0ZXNDb2xsZWN0aW9uID0gcm9vbURvY1JlZi5jb2xsZWN0aW9uKFxuICAgICAgICAgIHJlbW90ZVN1YkNvbGxlY3Rpb25OYW1lXG4gICAgICApO1xuICAgICAgcmVtb3RlQ2FuZGlkYXRlc0NvbGxlY3Rpb24ub25TbmFwc2hvdCgoc25hcHNob3QpID0+IHtcbiAgICAgICAgc25hcHNob3QuZG9jQ2hhbmdlcygpLmZvckVhY2goYXN5bmMgKGNoYW5nZSkgPT4ge1xuICAgICAgICAgIGlmIChjaGFuZ2UudHlwZSA9PT0gJ2FkZGVkJykge1xuICAgICAgICAgICAgLy8g5bCH5q+P5YCL5paw5aKe55qEcmVtb3RlIElDRSBDYW5kaWRhdGVzIOi9ieaPm+eCuiBSVENJY2VDYW5kaWRhdGXvvIzkuKbmt7vliqDliLAg5q2kUlRDUGVlckNvbm5lY3Rpb24g5LitXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gY2hhbmdlLmRvYy5kYXRhKCk7XG4gICAgICAgICAgICBhd2FpdCBwZWVyQ29ubmVjdGlvbi5hZGRJY2VDYW5kaWRhdGUobmV3IFJUQ0ljZUNhbmRpZGF0ZShkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { iceSeverConfig } from './ice-server';
import * as i0 from "@angular/core";
export class ConnectionService {
    constructor() {
        this.fireBaseService = inject(FirebaseService);
    }
    /** 創建並獲取RTCPeerConnection物件
     * RTCPeerConnection是負責建立瀏覽器(peer)與瀏覽器(peer)連接之間的工具。
     * 每一端(peer)都要創建自己的RTCPeerConnection物件，並且透過這個物件來建立連接。
     * 這種對等連接是點對點(peer-2-peer)的，不需要通過中間伺服器，但他在剛開始連接時需要一個 Signaing Server 作為資料交換的據點而在交換並連線後即不需要再透過 Server 交換資料
     * peer-2-peer 的連接該如何交換資訊之到彼此的 IP 位置、媒體內容就需要使用 SDP 協定傳輸相關的資訊
     * SDP 協定發送多媒體參數包含地址、多媒體類型、傳輸協議，也就是後面會實作的createOffer()、createAnswer()
     */
    genConnection() {
        return new RTCPeerConnection(iceSeverConfig);
    }
    /** 將MediaStreamTrack(多媒體資訊，例如影像、語音）加入該 peer 的 RTCPeerConnection
     * @param track
     * @param stream
     */
    addTrack(peerConnection, track, stream) {
        peerConnection.addTrack(track, stream);
    }
    /** 設置Caller端的SDP，Caller端建立offer，並監聽answer。
     * 設置Caller端的description(用以交換多媒體相關的資訊，例如解析度與 codec，以及連線資訊等)並放在 firestore 中交換
     * 透過RTCPeerConnection 的 createOffer() ，創建 Caller端 的 session description，
     * 建立成功後，透過setLocalDescription() 將 offer 設置為 local description，並透過 Signaling channel(fireStore) 傳遞給 callee端。
     * 同時，監聽 firestore 中的此房間文件(roomDocRef)是否有收到callee端傳來的answer，當收到answer時，透過setRemoteDescription()將 answer 設置為 remote description。
     * @param peerConnection
     * @param roomId
     */
    async setLocalPeer(peerConnection, roomId, remoteStream) {
        // 1. 建立 offer ， 並把此offer設置在Local description。
        const offer = await peerConnection.createOffer();
        // 將offer中的type與sdp擷取出來，以利寫到firestore中
        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        // 2. offer 設定 setLocalDescription，並把roomWithOffer寫進 firestore 中以利交換
        await peerConnection.setLocalDescription(offer);
        this.fireBaseService.addDataToDoc('rooms', roomId, roomWithOffer);
        // 7. 利用 onSnapshot() 監聽 answer
        const roomDocRef = this.fireBaseService.getDocRef('rooms', roomId);
        roomDocRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            // 8. 如果有監聽到 answer ，就把 answer 設定給 RemoteDescription
            if (!peerConnection.currentRemoteDescription && data && data.answer) {
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await peerConnection.setRemoteDescription(rtcSessionDescription);
            }
        });
        /* 當 WebRTC 的連接通道（Peer Connection）接收到新的媒體流時，會觸發 RTCPeerConnection.ontrack 事件
          event.streams[0] 是事件中的一個屬性，它表示收到的媒體流中的第一個流（通常是視訊或音訊流）
          使用 remoteStream.addTrack(track) 將這個軌道添加到 remoteStream 中。
          這意味著將接收到的媒體軌道添加到一個媒體流中
         */
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };
    }
    /** 設置Callee端的SDP，Callee端拿取Caller端的offer，並建立answer放到firestore中，以利Caller端取得。
     * 設置Callee的description(用以交換多媒體相關的資訊，例如解析度與 codec，以及連線資訊等)並放在 firestore 中交換
     * 先去fireStore中尋找 Caller端創建 的 offer，並透過setRemoteDescription() 將 此offer 設置為 remote description，
     * 同時，建立 answer，並透過setLocalDescription() 將 answer 設置為 local description，
     * 並將此 answer 放到 Signaling channel(fireStore) ，以利Caller端監聽並收到此 answer 。
     * @param peerConnection
     * @param roomId
     */
    async setRemotePeer(peerConnection, roomId, remoteStream) {
        /* 當 WebRTC 的連接通道（Peer Connection）接收到新的媒體流時，會觸發 RTCPeerConnection.ontrack 事件
          event.streams[0] 是事件中的一個屬性，它表示收到的媒體流中的第一個流（通常是視訊或音訊流）
          使用 remoteStream.addTrack(track) 將這個軌道添加到 remoteStream 中。
          這意味著將接收到的媒體軌道添加到一個媒體流中
         */
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };
        const roomDocRef = this.fireBaseService.getDocRef('rooms', `${roomId}`);
        const roomSnapshot = await roomDocRef.get();
        // 3. 尋找 db 中的 offer
        const offer = roomSnapshot.data()?.offer;
        // 4. offer 設定 RemoteDescription
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        // 5. 建立 Answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };
        // 6. Answer 設定 LocalDescription，放在 指定的roomDoc 中以利 Caller 端取得
        this.fireBaseService.updateDataToDoc('rooms', roomId, roomWithAnswer);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZmlyZS12aWRlby9zcmMvbGliL2Nvbm5lY3Rpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1REFBdUQ7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUM7O0FBSzlDLE1BQU0sT0FBTyxpQkFBaUI7SUFIOUI7UUFJRSxvQkFBZSxHQUFvQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7S0FrSDVEO0lBaEhDOzs7Ozs7T0FNRztJQUNILGFBQWE7UUFDWCxPQUFPLElBQUksaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVEsQ0FBQyxjQUFpQyxFQUFFLEtBQXVCLEVBQUUsTUFBbUI7UUFDdEYsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWlDLEVBQUUsTUFBYyxFQUFFLFlBQXlCO1FBQzdGLDhDQUE4QztRQUM5QyxNQUFNLEtBQUssR0FBRyxNQUFNLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVqRCxzQ0FBc0M7UUFDdEMsTUFBTSxhQUFhLEdBQVc7WUFDNUIsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO2FBQ2Y7U0FDRixDQUFDO1FBRUYsb0VBQW9FO1FBQ3BFLE1BQU0sY0FBYyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFbEUsK0JBQStCO1FBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFTLENBQUM7WUFFcEMsb0RBQW9EO1lBQ3BELElBQUksQ0FBQyxjQUFjLENBQUMsd0JBQXdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEUsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckUsTUFBTSxjQUFjLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNuRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSDs7OztXQUlHO1FBQ0gsY0FBYyxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2pDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQzdDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBaUMsRUFBRSxNQUFjLEVBQUUsWUFBeUI7UUFDOUY7Ozs7V0FJRztRQUNILGNBQWMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUM3QyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsTUFBTSxVQUFVLEdBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUV2RCxNQUFNLFlBQVksR0FBUSxNQUFNLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVqRCxvQkFBb0I7UUFDcEIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQztRQUV6QyxnQ0FBZ0M7UUFDaEMsTUFBTSxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRTVFLGVBQWU7UUFDZixNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRCxNQUFNLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRCxNQUFNLGNBQWMsR0FBVztZQUM3QixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7YUFDaEI7U0FDRixDQUFDO1FBRUYsNkRBQTZEO1FBQzdELElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs4R0FsSFUsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FGaEIsTUFBTTs7MkZBRVAsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmlyZWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi9maXJlYmFzZS5zZXJ2aWNlJztcbmltcG9ydCB7IERvY3VtZW50UmVmZXJlbmNlIH0gZnJvbSAnQGFuZ3VsYXIvZmlyZS9jb21wYXQvZmlyZXN0b3JlJztcbmltcG9ydCB7IGljZVNldmVyQ29uZmlnIH0gZnJvbSAnLi9pY2Utc2VydmVyJztcbmltcG9ydCB7IFNkcCB9IGZyb20gJy4vc2RwLmludGVyZmFjZSc7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2Uge1xuICBmaXJlQmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZSA9IGluamVjdChGaXJlYmFzZVNlcnZpY2UpO1xuXG4gIC8qKiDlibXlu7rkuKbnjbLlj5ZSVENQZWVyQ29ubmVjdGlvbueJqeS7tlxuICAgKiBSVENQZWVyQ29ubmVjdGlvbuaYr+iyoOiyrOW7uueri+eAj+imveWZqChwZWVyKeiIh+eAj+imveWZqChwZWVyKemAo+aOpeS5i+mWk+eahOW3peWFt+OAglxuICAgKiDmr4/kuIDnq68ocGVlcinpg73opoHlibXlu7roh6rlt7HnmoRSVENQZWVyQ29ubmVjdGlvbueJqeS7tu+8jOS4puS4lOmAj+mBjumAmeWAi+eJqeS7tuS+huW7uueri+mAo+aOpeOAglxuICAgKiDpgJnnqK7lsI3nrYnpgKPmjqXmmK/pu57lsI3pu54ocGVlci0yLXBlZXIp55qE77yM5LiN6ZyA6KaB6YCa6YGO5Lit6ZaT5Ly65pyN5Zmo77yM5L2G5LuW5Zyo5Ymb6ZaL5aeL6YCj5o6l5pmC6ZyA6KaB5LiA5YCLIFNpZ25haW5nIFNlcnZlciDkvZzngrros4fmlpnkuqTmj5vnmoTmk5rpu57ogIzlnKjkuqTmj5vkuKbpgKPnt5rlvozljbPkuI3pnIDopoHlho3pgI/pgY4gU2VydmVyIOS6pOaPm+izh+aWmVxuICAgKiBwZWVyLTItcGVlciDnmoTpgKPmjqXoqbLlpoLkvZXkuqTmj5vos4foqIrkuYvliLDlvbzmraTnmoQgSVAg5L2N572u44CB5aqS6auU5YWn5a655bCx6ZyA6KaB5L2/55SoIFNEUCDljZTlrprlgrPovLjnm7jpl5znmoTos4foqIpcbiAgICogU0RQIOWNlOWumueZvOmAgeWkmuWqkumrlOWPg+aVuOWMheWQq+WcsOWdgOOAgeWkmuWqkumrlOmhnuWei+OAgeWCs+i8uOWNlOitsO+8jOS5n+WwseaYr+W+jOmdouacg+WvpuS9nOeahGNyZWF0ZU9mZmVyKCnjgIFjcmVhdGVBbnN3ZXIoKVxuICAgKi9cbiAgZ2VuQ29ubmVjdGlvbigpOiBSVENQZWVyQ29ubmVjdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBSVENQZWVyQ29ubmVjdGlvbihpY2VTZXZlckNvbmZpZyk7XG4gIH1cblxuICAvKiog5bCHTWVkaWFTdHJlYW1UcmFjayjlpJrlqpLpq5Tos4foqIrvvIzkvovlpoLlvbHlg4/jgIHoqp7pn7PvvInliqDlhaXoqbIgcGVlciDnmoQgUlRDUGVlckNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHRyYWNrXG4gICAqIEBwYXJhbSBzdHJlYW1cbiAgICovXG4gIGFkZFRyYWNrKHBlZXJDb25uZWN0aW9uOiBSVENQZWVyQ29ubmVjdGlvbiwgdHJhY2s6IE1lZGlhU3RyZWFtVHJhY2ssIHN0cmVhbTogTWVkaWFTdHJlYW0pOiB2b2lkIHtcbiAgICBwZWVyQ29ubmVjdGlvbi5hZGRUcmFjayh0cmFjaywgc3RyZWFtKTtcbiAgfVxuXG4gIC8qKiDoqK3nva5DYWxsZXLnq6/nmoRTRFDvvIxDYWxsZXLnq6/lu7rnq4tvZmZlcu+8jOS4puebo+iBvWFuc3dlcuOAglxuICAgKiDoqK3nva5DYWxsZXLnq6/nmoRkZXNjcmlwdGlvbijnlKjku6XkuqTmj5vlpJrlqpLpq5Tnm7jpl5znmoTos4foqIrvvIzkvovlpoLop6PmnpDluqboiIcgY29kZWPvvIzku6Xlj4rpgKPnt5ros4foqIrnrYkp5Lim5pS+5ZyoIGZpcmVzdG9yZSDkuK3kuqTmj5tcbiAgICog6YCP6YGOUlRDUGVlckNvbm5lY3Rpb24g55qEIGNyZWF0ZU9mZmVyKCkg77yM5Ym15bu6IENhbGxlcuerryDnmoQgc2Vzc2lvbiBkZXNjcmlwdGlvbu+8jFxuICAgKiDlu7rnq4vmiJDlip/lvozvvIzpgI/pgY5zZXRMb2NhbERlc2NyaXB0aW9uKCkg5bCHIG9mZmVyIOioree9rueCuiBsb2NhbCBkZXNjcmlwdGlvbu+8jOS4pumAj+mBjiBTaWduYWxpbmcgY2hhbm5lbChmaXJlU3RvcmUpIOWCs+mBnue1piBjYWxsZWXnq6/jgIJcbiAgICog5ZCM5pmC77yM55uj6IG9IGZpcmVzdG9yZSDkuK3nmoTmraTmiL/plpPmlofku7Yocm9vbURvY1JlZinmmK/lkKbmnInmlLbliLBjYWxsZWXnq6/lgrPkvobnmoRhbnN3ZXLvvIznlbbmlLbliLBhbnN3ZXLmmYLvvIzpgI/pgY5zZXRSZW1vdGVEZXNjcmlwdGlvbigp5bCHIGFuc3dlciDoqK3nva7ngrogcmVtb3RlIGRlc2NyaXB0aW9u44CCXG4gICAqIEBwYXJhbSBwZWVyQ29ubmVjdGlvblxuICAgKiBAcGFyYW0gcm9vbUlkXG4gICAqL1xuICBhc3luYyBzZXRMb2NhbFBlZXIocGVlckNvbm5lY3Rpb246IFJUQ1BlZXJDb25uZWN0aW9uLCByb29tSWQ6IHN0cmluZywgcmVtb3RlU3RyZWFtOiBNZWRpYVN0cmVhbSkge1xuICAgIC8vIDEuIOW7uueriyBvZmZlciDvvIwg5Lim5oqK5q2kb2ZmZXLoqK3nva7lnKhMb2NhbCBkZXNjcmlwdGlvbuOAglxuICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgcGVlckNvbm5lY3Rpb24uY3JlYXRlT2ZmZXIoKTtcblxuICAgIC8vIOWwh29mZmVy5Lit55qEdHlwZeiIh3NkcOaTt+WPluWHuuS+hu+8jOS7peWIqeWvq+WIsGZpcmVzdG9yZeS4rVxuICAgIGNvbnN0IHJvb21XaXRoT2ZmZXI6IG9iamVjdCA9IHtcbiAgICAgIG9mZmVyOiB7XG4gICAgICAgIHR5cGU6IG9mZmVyLnR5cGUsXG4gICAgICAgIHNkcDogb2ZmZXIuc2RwLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gMi4gb2ZmZXIg6Kit5a6aIHNldExvY2FsRGVzY3JpcHRpb27vvIzkuKbmiopyb29tV2l0aE9mZmVy5a+r6YCyIGZpcmVzdG9yZSDkuK3ku6XliKnkuqTmj5tcbiAgICBhd2FpdCBwZWVyQ29ubmVjdGlvbi5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKTtcbiAgICB0aGlzLmZpcmVCYXNlU2VydmljZS5hZGREYXRhVG9Eb2MoJ3Jvb21zJywgcm9vbUlkLCByb29tV2l0aE9mZmVyKTtcblxuICAgIC8vIDcuIOWIqeeUqCBvblNuYXBzaG90KCkg55uj6IG9IGFuc3dlclxuICAgIGNvbnN0IHJvb21Eb2NSZWYgPSB0aGlzLmZpcmVCYXNlU2VydmljZS5nZXREb2NSZWYoJ3Jvb21zJywgcm9vbUlkKTtcbiAgICByb29tRG9jUmVmLm9uU25hcHNob3QoYXN5bmMgKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gc25hcHNob3QuZGF0YSgpIGFzIFNkcDtcblxuICAgICAgLy8gOC4g5aaC5p6c5pyJ55uj6IG95YiwIGFuc3dlciDvvIzlsLHmioogYW5zd2VyIOioreWumue1piBSZW1vdGVEZXNjcmlwdGlvblxuICAgICAgaWYgKCFwZWVyQ29ubmVjdGlvbi5jdXJyZW50UmVtb3RlRGVzY3JpcHRpb24gJiYgZGF0YSAmJiBkYXRhLmFuc3dlcikge1xuICAgICAgICBjb25zdCBydGNTZXNzaW9uRGVzY3JpcHRpb24gPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgYXdhaXQgcGVlckNvbm5lY3Rpb24uc2V0UmVtb3RlRGVzY3JpcHRpb24ocnRjU2Vzc2lvbkRlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qIOeVtiBXZWJSVEMg55qE6YCj5o6l6YCa6YGT77yIUGVlciBDb25uZWN0aW9u77yJ5o6l5pS25Yiw5paw55qE5aqS6auU5rWB5pmC77yM5pyD6Ke455m8IFJUQ1BlZXJDb25uZWN0aW9uLm9udHJhY2sg5LqL5Lu2XG4gICAgICBldmVudC5zdHJlYW1zWzBdIOaYr+S6i+S7tuS4reeahOS4gOWAi+WxrOaAp++8jOWug+ihqOekuuaUtuWIsOeahOWqkumrlOa1geS4reeahOesrOS4gOWAi+a1ge+8iOmAmuW4uOaYr+imluioiuaIlumfs+ioiua1ge+8iVxuICAgICAg5L2/55SoIHJlbW90ZVN0cmVhbS5hZGRUcmFjayh0cmFjaykg5bCH6YCZ5YCL6LuM6YGT5re75Yqg5YiwIHJlbW90ZVN0cmVhbSDkuK3jgIJcbiAgICAgIOmAmeaEj+WRs+iRl+Wwh+aOpeaUtuWIsOeahOWqkumrlOi7jOmBk+a3u+WKoOWIsOS4gOWAi+WqkumrlOa1geS4rVxuICAgICAqL1xuICAgIHBlZXJDb25uZWN0aW9uLm9udHJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0cmVhbXNbMF0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgcmVtb3RlU3RyZWFtLmFkZFRyYWNrKHRyYWNrKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICAvKiog6Kit572uQ2FsbGVl56uv55qEU0RQ77yMQ2FsbGVl56uv5ou/5Y+WQ2FsbGVy56uv55qEb2ZmZXLvvIzkuKblu7rnq4thbnN3ZXLmlL7liLBmaXJlc3RvcmXkuK3vvIzku6XliKlDYWxsZXLnq6/lj5blvpfjgIJcbiAgICog6Kit572uQ2FsbGVl55qEZGVzY3JpcHRpb24o55So5Lul5Lqk5o+b5aSa5aqS6auU55u46Zec55qE6LOH6KiK77yM5L6L5aaC6Kej5p6Q5bqm6IiHIGNvZGVj77yM5Lul5Y+K6YCj57ea6LOH6KiK562JKeS4puaUvuWcqCBmaXJlc3RvcmUg5Lit5Lqk5o+bXG4gICAqIOWFiOWOu2ZpcmVTdG9yZeS4reWwi+aJviBDYWxsZXLnq6/libXlu7og55qEIG9mZmVy77yM5Lim6YCP6YGOc2V0UmVtb3RlRGVzY3JpcHRpb24oKSDlsIcg5q2kb2ZmZXIg6Kit572u54K6IHJlbW90ZSBkZXNjcmlwdGlvbu+8jFxuICAgKiDlkIzmmYLvvIzlu7rnq4sgYW5zd2Vy77yM5Lim6YCP6YGOc2V0TG9jYWxEZXNjcmlwdGlvbigpIOWwhyBhbnN3ZXIg6Kit572u54K6IGxvY2FsIGRlc2NyaXB0aW9u77yMXG4gICAqIOS4puWwh+atpCBhbnN3ZXIg5pS+5YiwIFNpZ25hbGluZyBjaGFubmVsKGZpcmVTdG9yZSkg77yM5Lul5YipQ2FsbGVy56uv55uj6IG95Lim5pS25Yiw5q2kIGFuc3dlciDjgIJcbiAgICogQHBhcmFtIHBlZXJDb25uZWN0aW9uXG4gICAqIEBwYXJhbSByb29tSWRcbiAgICovXG4gIGFzeW5jIHNldFJlbW90ZVBlZXIocGVlckNvbm5lY3Rpb246IFJUQ1BlZXJDb25uZWN0aW9uLCByb29tSWQ6IHN0cmluZywgcmVtb3RlU3RyZWFtOiBNZWRpYVN0cmVhbSkge1xuICAgIC8qIOeVtiBXZWJSVEMg55qE6YCj5o6l6YCa6YGT77yIUGVlciBDb25uZWN0aW9u77yJ5o6l5pS25Yiw5paw55qE5aqS6auU5rWB5pmC77yM5pyD6Ke455m8IFJUQ1BlZXJDb25uZWN0aW9uLm9udHJhY2sg5LqL5Lu2XG4gICAgICBldmVudC5zdHJlYW1zWzBdIOaYr+S6i+S7tuS4reeahOS4gOWAi+WxrOaAp++8jOWug+ihqOekuuaUtuWIsOeahOWqkumrlOa1geS4reeahOesrOS4gOWAi+a1ge+8iOmAmuW4uOaYr+imluioiuaIlumfs+ioiua1ge+8iVxuICAgICAg5L2/55SoIHJlbW90ZVN0cmVhbS5hZGRUcmFjayh0cmFjaykg5bCH6YCZ5YCL6LuM6YGT5re75Yqg5YiwIHJlbW90ZVN0cmVhbSDkuK3jgIJcbiAgICAgIOmAmeaEj+WRs+iRl+Wwh+aOpeaUtuWIsOeahOWqkumrlOi7jOmBk+a3u+WKoOWIsOS4gOWAi+WqkumrlOa1geS4rVxuICAgICAqL1xuICAgIHBlZXJDb25uZWN0aW9uLm9udHJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0cmVhbXNbMF0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgcmVtb3RlU3RyZWFtLmFkZFRyYWNrKHRyYWNrKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCByb29tRG9jUmVmOiBEb2N1bWVudFJlZmVyZW5jZTx1bmtub3duPiA9XG4gICAgICB0aGlzLmZpcmVCYXNlU2VydmljZS5nZXREb2NSZWYoJ3Jvb21zJywgYCR7cm9vbUlkfWApO1xuXG4gICAgY29uc3Qgcm9vbVNuYXBzaG90OiBhbnkgPSBhd2FpdCByb29tRG9jUmVmLmdldCgpO1xuXG4gICAgLy8gMy4g5bCL5om+IGRiIOS4reeahCBvZmZlclxuICAgIGNvbnN0IG9mZmVyID0gcm9vbVNuYXBzaG90LmRhdGEoKT8ub2ZmZXI7XG5cbiAgICAvLyA0LiBvZmZlciDoqK3lrpogUmVtb3RlRGVzY3JpcHRpb25cbiAgICBhd2FpdCBwZWVyQ29ubmVjdGlvbi5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKG9mZmVyKSk7XG5cbiAgICAvLyA1LiDlu7rnq4sgQW5zd2VyXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcGVlckNvbm5lY3Rpb24uY3JlYXRlQW5zd2VyKCk7XG4gICAgYXdhaXQgcGVlckNvbm5lY3Rpb24uc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpO1xuXG4gICAgY29uc3Qgcm9vbVdpdGhBbnN3ZXI6IG9iamVjdCA9IHtcbiAgICAgIGFuc3dlcjoge1xuICAgICAgICB0eXBlOiBhbnN3ZXIudHlwZSxcbiAgICAgICAgc2RwOiBhbnN3ZXIuc2RwLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gNi4gQW5zd2VyIOioreWumiBMb2NhbERlc2NyaXB0aW9u77yM5pS+5ZyoIOaMh+WumueahHJvb21Eb2Mg5Lit5Lul5YipIENhbGxlciDnq6/lj5blvpdcbiAgICB0aGlzLmZpcmVCYXNlU2VydmljZS51cGRhdGVEYXRhVG9Eb2MoJ3Jvb21zJywgcm9vbUlkLCByb29tV2l0aEFuc3dlcik7XG4gIH1cbn1cbiJdfQ==
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { iceSeverConfig } from './ice-server';
import { Sdp } from './sdp.interface';
@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  fireBaseService: FirebaseService = inject(FirebaseService);

  /** 創建並獲取RTCPeerConnection物件
   * RTCPeerConnection是負責建立瀏覽器(peer)與瀏覽器(peer)連接之間的工具。
   * 每一端(peer)都要創建自己的RTCPeerConnection物件，並且透過這個物件來建立連接。
   * 這種對等連接是點對點(peer-2-peer)的，不需要通過中間伺服器，但他在剛開始連接時需要一個 Signaing Server 作為資料交換的據點而在交換並連線後即不需要再透過 Server 交換資料
   * peer-2-peer 的連接該如何交換資訊之到彼此的 IP 位置、媒體內容就需要使用 SDP 協定傳輸相關的資訊
   * SDP 協定發送多媒體參數包含地址、多媒體類型、傳輸協議，也就是後面會實作的createOffer()、createAnswer()
   */
  genConnection(): RTCPeerConnection {
    return new RTCPeerConnection(iceSeverConfig);
  }

  /** 將MediaStreamTrack(多媒體資訊，例如影像、語音）加入該 peer 的 RTCPeerConnection
   * @param track
   * @param stream
   */
  addTrack(peerConnection: RTCPeerConnection, track: MediaStreamTrack, stream: MediaStream): void {
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
  async setLocalPeer(peerConnection: RTCPeerConnection, roomId: string, remoteStream: MediaStream) {
    // 1. 建立 offer ， 並把此offer設置在Local description。
    const offer = await peerConnection.createOffer();

    // 將offer中的type與sdp擷取出來，以利寫到firestore中
    const roomWithOffer: object = {
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
      const data = snapshot.data() as Sdp;

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
  async setRemotePeer(peerConnection: RTCPeerConnection, roomId: string, remoteStream: MediaStream) {
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

    const roomDocRef: DocumentReference<unknown> =
      this.fireBaseService.getDocRef('rooms', `${roomId}`);

    const roomSnapshot: any = await roomDocRef.get();

    // 3. 尋找 db 中的 offer
    const offer = roomSnapshot.data()?.offer;

    // 4. offer 設定 RemoteDescription
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // 5. 建立 Answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer: object = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };

    // 6. Answer 設定 LocalDescription，放在 指定的roomDoc 中以利 Caller 端取得
    this.fireBaseService.updateDataToDoc('rooms', roomId, roomWithAnswer);
  }
}

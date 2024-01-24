import { FirebaseService } from './firebase.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IceCandidateService {
  fireBaseService: FirebaseService = inject(FirebaseService);

  /** 收集local，並監聽remote 的 ice candidates ， 且將收集到的 ice candidates 寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
   * 由於要建立點對點連接前，需要先收集 ICE 找到最適合的連線方式再交換 SPD 資訊，因此這個function用來收集 ICE Candidates。
   * 透過 addSubCollection() 創建 caller/callee 各自的subCollection，並將 ice candidates 寫入各自的 subCollection 中，
   * 同時，監聽另一方的 subCollection ，當收到對方的 ice candidates 時，將其轉換為 RTCIceCandidate 對象，然後添加到 此端的 RTCPeerConnection 中
   * @param roomId
   * @param peerConnection
   * @param localSubCollectionName
   * @param remoteSubCollectionName
   */
  async collectIceCandidates(roomId: string, peerConnection: RTCPeerConnection, localSubCollectionName: string, remoteSubCollectionName: string) {
    const roomDocRef = this.fireBaseService.getDocRef('rooms', roomId);

    try {
      // 當local端收集到一個 ICE Candidates時，將觸發這個事件
      peerConnection.onicecandidate = async (event) => {
        // 如果事件中存在 ICE Candidates，則將其轉換為 JSON Object 並添加到 localSubCollectionName 這個 SubCollection 中
        if (event.candidate) {
          // 存儲 local 的 ICE 候選者
          this.fireBaseService.addSubCollection(
              roomDocRef,
              localSubCollectionName,
              event.candidate.toJSON()
          );
        }
      };

      // 收集到一個 ICE Candidates時錯誤則觸發
      peerConnection.onicecandidateerror = (error) => {
        console.error(error);
      };

      // 利用 onSnapshot() 監聽 remote端(remoteSubCollectionName的collection) ， 當有 docChange 時，獲取的 ICE candidates 數據轉換為 RTCIceCandidate 對象，然後添加此端的到 RTCPeerConnection 中
      const remoteCandidatesCollection = roomDocRef.collection(
          remoteSubCollectionName
      );
      remoteCandidatesCollection.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            // 將每個新增的remote ICE Candidates 轉換為 RTCIceCandidate，並添加到 此RTCPeerConnection 中
            const data = change.doc.data();
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}

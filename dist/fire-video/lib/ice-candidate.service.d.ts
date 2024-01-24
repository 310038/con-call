import { FirebaseService } from './firebase.service';
import * as i0 from "@angular/core";
export declare class IceCandidateService {
    fireBaseService: FirebaseService;
    /** 收集local，並監聽remote 的 ice candidates ， 且將收集到的 ice candidates 寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
     * 由於要建立點對點連接前，需要先收集 ICE 找到最適合的連線方式再交換 SPD 資訊，因此這個function用來收集 ICE Candidates。
     * 透過 addSubCollection() 創建 caller/callee 各自的subCollection，並將 ice candidates 寫入各自的 subCollection 中，
     * 同時，監聽另一方的 subCollection ，當收到對方的 ice candidates 時，將其轉換為 RTCIceCandidate 對象，然後添加到 此端的 RTCPeerConnection 中
     * @param roomId
     * @param peerConnection
     * @param localSubCollectionName
     * @param remoteSubCollectionName
     */
    collectIceCandidates(roomId: string, peerConnection: RTCPeerConnection, localSubCollectionName: string, remoteSubCollectionName: string): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IceCandidateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IceCandidateService>;
}

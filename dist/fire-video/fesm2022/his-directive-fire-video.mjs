import { MessagesModule } from 'primeng/messages';
import * as i0 from '@angular/core';
import { Injectable, inject, Component, Input, ViewChild } from '@angular/core';
import * as i1$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject } from 'rxjs';
import * as i1 from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as i2 from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import * as i4 from 'primeng/galleria';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

class Show {
    constructor() {
        this.isDialog = false;
        this.isCreateDisabled = false;
        this.isMicDisabled = true;
        this.isJoinDisabled = false;
        this.isHangupDisabled = false;
        this.isCameraDisabled = false;
        this.isCaller = false;
        this.isCallee = false;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class ScreenshotService {
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

class FirebaseService {
    constructor() {
        this.fireStore = inject(AngularFirestore);
    }
    /** 在fireStore中創建一個集合(collection)，此集合名稱為由參數collectionName決定(預設為rooms)
     * 這個collection裡會有很多documents
     * 預設為:創建一個名為'rooms'的collection，這個collection裡會有很多房間，不同房間以不同房間號碼(roomId)區分
     * @param collectionName collection名稱，預設collectionName 叫做 rooms
     */
    addCollection(collectionName) {
        this.fireStore.collection(collectionName);
    }
    /** 獲取特定 collectionName 的 CollectionReference
     * @param collectionName collection名稱，預設collectionName 叫做 rooms
     */
    getCollectionRef(collectionName) {
        const collectionRef = this.fireStore.collection(collectionName);
        return collectionRef;
    }
    /** 在fireStore中的'rooms'(collection)中創建一個以參數'roomId'為名稱的文件(doc)，並把data寫進去這個文件(doc)中
     * 取得指定房間的document(roomDoc) ，並使用 firestore(原生）的 set() 方法，將data寫進這個文件(doc)中
     * @param collectionName collection名稱，預設collectionName 叫做 rooms
     * @param roomId 要創建的文件(doc)的名稱，預設為病人身份證字號
     * @param data 要寫進這個文件(doc)中的資料
     */
    addDataToDoc(collectionName, roomId, data) {
        // 取得指定房間的document(roomDoc)
        const roomCollection = this.getCollectionRef(collectionName);
        const roomDoc = roomCollection.doc(roomId);
        roomDoc.set(data);
    }
    /** 更新指定房間的 document 資料
     * 取得指定房間的document(roomDoc) ，並使用 firestore(原生）的 update() 方法，將 data 更新到這個文件(doc)中
     * @param collectionName collection名稱，預設collectionName 叫做 rooms
     * @param roomId 文件(doc)的名稱，預設為病人身份證字號
     * @param data 要更新到這個文件(doc)中的資料
     */
    updateDataToDoc(collectionName, roomId, data) {
        // 取得指定房間的document(roomDoc)
        const roomCollection = this.getCollectionRef(collectionName);
        const roomDoc = roomCollection.doc(roomId);
        roomDoc.update(data);
    }
    /** 獲取指定 collectionName 中的指定的文件(Document)的Reference
     * @param collectionName collection名稱，預設collectionName 叫做 rooms
     * @param roomId 文件(doc)的名稱，預設為病人身份證字號
     */
    getDocRef(collectionName, roomId) {
        // 取得指定房間的文件參考 DocumentReference(docRef)
        const roomCollection = this.getCollectionRef(collectionName);
        const docRef = roomCollection.doc(roomId).ref;
        return docRef;
    }
    /** 在指定的文件(document)中創建一個名為 'subCollectionName' 的子集合(subCollection)，並把data寫進去這個子集合(subCollection)中
     * 例如：在'rooms'(collection)中某一個roomId的文件(doc)中創建一個名為callerCandidates的子集合(subCollection)
     * 創建subCollection後，利用subCollectionRef 並搭配 firestore(原生）的 add() 方法，將data寫進這個文件(doc)中
     * @param docRef 欲創建 subCollection 的文件(document)的Reference
     * @param subCollectionName 欲創建的子集合(subCollection)的名稱
     * @param data 要寫進這個子集合(subCollection)中的資料
     */
    addSubCollection(docRef, subCollectionName, data) {
        const subCollectionRef = docRef.collection(subCollectionName);
        subCollectionRef.add({ ...data });
    }
    /** 獲取指定文件參考(docRef)中的特定子集合(subCollection)的 Reference，也就是獲取子集合(subCollection) 的 CollectionReference）
     * 例如:獲取名為 callerCandidates 這個子集合(subCollection) 的 Reference
     * @param docRef 該 subCollection 所在的文件(document) 的 Reference
     * @param subCollectionName 欲獲取的子集合(subCollection)的名稱
     */
    getSubCollectionRef(docRef, subCollectionName) {
        return docRef.collection(subCollectionName);
    }
    /** 獲取特定文件參考(docRef)的 snapshot
     * snapshot 是firestore提供的 api，透過snapshot可以'即時'獲取到該文件的資料變化，例如新增、修改、刪除等。
     * @param DocRef 欲操作的文件(document) 的 Reference
     */
    getSnapshot(DocRef) {
        return DocRef.get();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: FirebaseService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: FirebaseService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: FirebaseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class IceCandidateService {
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

/** iceServers的配置
   * 是一個用於設定 WebRTC ICE server 的陣列。這個陣列包括 STUN 和 TURN 伺服器的資訊，這邊只使用 google 提供免費的 STUN server 。
   *
   * WebRTC 使用 STUN 和 TURN 協議來克服 NAT 和防火牆的障礙，確保兩個瀏覽器之間的實時通信順利進行。
   * STUN（Session Traversal Utilities for NAT）用於獲取公共IP地址和端口。
   * STUN伺服器的工作是從訊息中找出這個裝置的外部位置，然後把這個資訊送回給該裝置，告訴裝置如何穿越 NAT以確定裝置的可用 IP 地址
   * TURN（Traversal Using Relays around NAT）提供中繼服務，允許通信，即使在複雜的NAT環境中也能運作。
   * WebRTC使用STUN和TURN協議來確保實時通信的成功。
   * 當瀏覽器無法直接建立對等連接時，它們將使用 STUN 來獲取公共 IP 地址，並嘗試直接通信。
   * 如果 STUN 無法成功且有設定 TURN server的情況下，則會使用 TURN 服務器作為中繼，將數據傳遞給對方。
   */
const iceSeverConfig = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        },
    ],
    // ICE 協商過程中生成的 ICE 候選人的數量。根據應用程序的需求和性能考慮來配置。較大可能會增加成功建立連接的機會，但也會增加網絡流量和運算成本。
    iceCandidatePoolSize: 10,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
class ConnectionService {
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

class MediaService {
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

/* eslint-disable @typescript-eslint/no-explicit-any */
const primeModule = [DividerModule, ButtonModule, DialogModule, ToastModule, MessagesModule, GalleriaModule, ProgressSpinnerModule];
class FireVideoComponent {
    constructor() {
        this.videoIcon = 'videoCam';
        this.micIcon = "Mic";
        this.contactsIcon = "Contacts";
        // 定義在不同螢幕大小或設備上顯示圖片輪播時的配置選項
        this.galleriaResponsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5
            },
            {
                breakpoint: '960px',
                numVisible: 4
            },
            {
                breakpoint: '768px',
                numVisible: 3
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ];
        this.show = new Show();
        this.fireBaseService = inject(FirebaseService);
        this.iceCandidateService = inject(IceCandidateService);
        this.screenshotService = inject(ScreenshotService);
        this.peerConnectionService = inject(ConnectionService);
        this.mediaService = inject(MediaService);
    }
    ngOnInit() {
        this.openUserMedia();
    }
    /** 監聽截圖按鈕，當此按鈕被點擊時，呼叫 screenshot()，將對方視訊畫面截圖，並上傳至 CDN
     */
    onShootClick() {
        this.screenshotService.screenshot(this.roomId, this.remoteVideo);
    }
    /** 切換「鏡頭」開關
     */
    disableCamera() {
        // 依照isCameraDisabled 的 true/false ， 來切換icon 的 on/off 狀態
        this.show.isCameraDisabled = !this.show.isCameraDisabled;
        this.videoIcon = this.show.isCameraDisabled ? 'videocam_off' : 'videocam';
        this.show.isCameraDisabled ? this.mediaService.disableVideo(this.localStream) : this.mediaService.enableVideo(this.localStream);
    }
    /** 切換「麥克風」開關
     */
    disableMic() {
        // 依照isMicDisabled 的 true/false ， 來切換icon 的 on/off 狀態
        this.show.isMicDisabled = !this.show.isMicDisabled;
        this.micIcon = this.show.isMicDisabled ? 'mic_off' : 'Mic';
        this.show.isMicDisabled ? this.mediaService.disableMic(this.localStream) : this.mediaService.enableMic(this.localStream);
    }
    /** 創建房間
     * 在firebase中創建一個房間，此房間以房間號碼作識別，房間號碼(roomId)預其為病人身分證字號
     * 0.檢查使用者是否已經開啟視訊及麥克風，若否，則跳出警告視窗
     * 當此按鈕被按下後，會執行以下動作：
     * 1.創建一個名為rooms的collection，這個collection裡會有很多房間，不同房間以不同房間號碼(roomId)區分
     * 2.創建一個CallerPeerConnection
     * 3.收集local(caller)的 ice candidates，同時監聽remote(callee) 的 ice candidates ， 並寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
     * 4.將localStream加入CallerPeerConnection，以利後續傳送給callee，callee接收到後就可以顯示在remoteVideo上(display the local media data.)
     * 5.設置Caller端的SDP，Caller端建立offer，並監聽answer。
     */
    async createRoom() {
        // 0.檢查使用者是否已經開啟視訊及麥克風，若否，則跳出警告視窗
        if (!this.localStream) {
            // this.toastMessageService.warning('請先開啟視訊及麥克風');
            return;
        }
        // 1.創建一個名為rooms的collection，這個collection裡會有很多房間，不同房間以不同房間號碼(roomId)區分
        this.fireBaseService.addCollection('rooms');
        // 2.創建一個CallerPeerConnection
        this.CallerPeerConnection = this.peerConnectionService.genConnection();
        // 3.收集local(caller)，並監聽remote(callee) 的 ice candidates ， 並寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
        this.iceCandidateService.collectIceCandidates(this.roomId, this.CallerPeerConnection, 'callerCandidates', 'calleeCandidates');
        console.log(this.roomId);
        // 4.在建立RTCPeerConnection物件後，將localStream加入CallerPeerConnection，以利後續傳送給callee，callee接收到後就可以顯示在remoteVideo上(display the local media data.)
        this.addLocalMediaTracks(this.CallerPeerConnection);
        // 5.設置Caller端的SDP，Caller端建立offer，並監聽answer。
        this.peerConnectionService.setLocalPeer(this.CallerPeerConnection, this.roomId, this.remoteStream);
    }
    /** 按下「加入視訊」按鈕後，會執行以下動作：
     * 0.檢查使用者是否已經開啟視訊及麥克風，若否，則跳出警告視窗
     * 當此按鈕被按下後，會執行以下動作：
     * 1.彈出「加入視訊」對話框(讓user可以輸入指定的房間號碼，按下「確認」按鈕，就可以加入指定的房間。)
     * @todo showDialog() 顯示「加入視訊」對話框，讓user可以輸入指定的房間號碼，按下「確認」按鈕，就可以加入指定的房間。
     */
    joinRoom() {
        // 0.檢查使用者是否已經開啟視訊及麥克風，若否，則跳出警告視窗
        if (!this.localStream) {
            // this.toastMessageService.warning('請先開啟視訊及麥克風');
            return;
        }
        // 1. 彈出「加入視訊」對話框(讓user可以輸入指定的房間號碼，按下「確認」按鈕，就可以加入指定的房間。)
        this.showDialog();
    }
    /** 彈出「加入視訊」對話框後，user可以輸入房間號碼(病人身分證字號)，按下「確認」按鈕，就可以加入指定的房間。
     * 透過房間號碼(病人身分證字號)加入房間
     * 使用者可以透過輸入指定的房間號碼(病人身分證字號)來加入房間
     * @param roomId 房間號碼(病人身分證字號)
     * @todo joinRoomById()透過房間號碼(病人身分證字號)加入房間
     */
    async confirmJoinRoom() {
        this.inputRoomId = this.roomId; //記得刪掉
        this.joinRoomById(this.inputRoomId);
        this.hideDialog();
    }
    /** 根據user所輸入的roomId來加入指定視訊房間
     * 1. 取得user輸入的房間號碼(roomId)的房間的DocumentReference
     * 2. 獲取 roomDocRef 的 snapshot，並判斷使用者所輸入的房間(號碼)是否存在，如果不存在，則跳出警告視窗
     * 如果存在，則執行以下動作：
     * 1. 創建一個CalleePeerConnection
     * 2. 收集local(callee)，並監聽remote(caller) 的 ice candidates ， 並寫入firestore中指定的 subCollection(caller或callee)中以利進行交換。
     * 3. 將localStream加入CalleePeerConnection，以利後續傳送給caller，caller接收到後就可以顯示在remoteVideo上(display the local media data.)
     * 4. 設置Callee端的SDP，Callee端 取得offer並設置RemoteDescription ，然後建立answer， 將answer設置成LocalDescription，並將此 answer 寫到指定的roomDoc以利 Caller 端取得
     * @param inputRoomId 房間號碼(病人身分證字號)
     */
    async joinRoomById(inputRoomId) {
        // 1.取得user輸入的房間號碼(roomId)的房間的DocumentReference
        const roomDocRef = this.fireBaseService.getDocRef('rooms', `${inputRoomId}`);
        // 2. 獲取 roomDocRef 的 snapshot，並判斷使用者所輸入的房間(號碼)是否存在，如果不存在，則跳出警告視窗
        const roomSnapshot = await this.fireBaseService.getSnapshot(roomDocRef);
        if (!roomSnapshot.exists) {
            // this.toastMessageService.error('房間不存在');
            return;
        }
        // 如果存在，則執行以下動作：
        else {
            // 1. 創建一個CalleePeerConnection
            this.CalleePeerConnection = this.peerConnectionService.genConnection();
            // 2. 收集local(callee)，並監聽remote(caller) 的 ice candidates ， 並寫入firestore中指定的subCollection(caller或callee)中以利進行交換。
            this.iceCandidateService.collectIceCandidates(inputRoomId, this.CalleePeerConnection, 'calleeCandidates', 'callerCandidates');
            // 3.在建立RTCPeerConnection物件後並將localStream加入CalleePeerConnection，以利後續傳送給caller，caller接收到後就可以顯示在remoteVideo上(display the local media data.)
            this.addLocalMediaTracks(this.CalleePeerConnection);
            // 4. 設置Callee端的SDP，Callee端 到fireStore中拿取 offer(由caller所建立的)後，建立answer，並將此 answer 寫到指定的roomDoc以利 Caller 端取得
            this.peerConnectionService.setRemotePeer(this.CalleePeerConnection, inputRoomId, this.remoteStream);
        }
    }
    /** 開啟視訊
     */
    async openUserMedia() {
        const stream = await this.mediaService.getUserMedia();
        this.localStream = stream;
        this.remoteStream = new MediaStream();
        this.createRoom();
    }
    /** 掛斷視訊通話
     * 關閉視訊和音訊，並關閉連線雙方的peerConnection。
     * 關閉視訊通話後，將會刪除fireStore中的房間文件
     */
    async hangUp() {
        // 停止本地流和遠端流中的所有媒體軌道
        await this.stopMediaTracks();
        // 關閉 RTCPeerConnection
        this.removePeerConnections();
        // this.toastMessageService.info('通話已結束');
        // 刪除 calleeCandidates 集合中的文件
        await this.executeFirebaseCleanup();
        // 重置畫面元件
        this.initElements();
        // 刷新頁面
        this.reloadPage();
    }
    /** 顯示「加入視訊」對話框
     */
    showDialog() {
        this.show.isDialog = true;
    }
    /** 關閉「加入視訊」對話框
     */
    hideDialog() {
        this.show.isDialog = false;
    }
    /** 停止 localStream 和 remoteStream 中的所有媒體軌道
     */
    async stopMediaTracks() {
        this.localStream.getTracks().forEach((track) => {
            track.stop();
        });
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach((track) => track.stop());
        }
    }
    /** 關閉連線雙方(caller 跟 callee)的peerConnection
     */
    removePeerConnections() {
        if (this.CallerPeerConnection) {
            this.CallerPeerConnection.close();
        }
        if (this.CalleePeerConnection) {
            this.CalleePeerConnection.close();
        }
    }
    /** 清除firestore中的房間文件
     */
    async executeFirebaseCleanup() {
        if (this.roomId) {
            const roomDocRef = this.fireBaseService.getDocRef('rooms', this.roomId);
            const calleeCandidatesRef = this.fireBaseService.getSubCollectionRef(roomDocRef, 'calleeCandidates');
            calleeCandidatesRef.onSnapshot((snapshot) => {
                console.log(snapshot);
                snapshot.ref.delete();
            });
            const callerCandidatesRef = this.fireBaseService.getSubCollectionRef(roomDocRef, 'callerCandidates');
            callerCandidatesRef.onSnapshot((snapshot) => {
                snapshot.ref.delete();
            });
            await roomDocRef.delete();
        }
    }
    /** 重新載入頁面
     */
    reloadPage() {
        document.location.reload();
    }
    /** 初始化頁面元件，包含localStream、remoteStream、roomName
     * 將頁面初始化，包含localStream、remoteStream、roomName
     */
    initElements() {
        this.localStream = new MediaStream();
        this.remoteStream = new MediaStream();
    }
    /** 在建立RTCPeerConnection物件後，將localStream加入PeerConnection，以利後續傳送給另一端，另一端接收到後就可以顯示在remoteVideo上(display the local media data.)
     * 在localStream建立完後(也就是openUserMedia()執行完後)，才能執行下面這行。使用 getTracks() 方法獲取所有mediaTrack軌道，並將這些mediaTrack軌道添加到 RTCPeerConnection 中。
     * getTracks 獲取媒體流所有軌道並返回 array
     * addTracks 將新的音訊或視訊軌道添加到現有的媒體流中
     * @param PeerConnection：RTCPeerConnection
     */
    addLocalMediaTracks(PeerConnection) {
        this.localStream.getTracks().forEach((track) => {
            PeerConnection.addTrack(track, this.localStream);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: FireVideoComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.0", type: FireVideoComponent, isStandalone: true, selector: "his-fire-video", inputs: { roomId: "roomId" }, providers: [MessageService], viewQueries: [{ propertyName: "remoteVideo", first: true, predicate: ["remoteVideo"], descendants: true }], ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/alt-text -->\n<div class=\"container\">\n  <div class=\"top\">\n    <div class=\"leftSide\">\n      <div *ngIf=\"!remoteStream\" class=\"material-symbols-outlined contactsIcon\">\n        {{contactsIcon}}\n      </div>\n      <div *ngIf=\"!remoteStream\" class=\"loading\">\n        <span>\u9023\u7DDA\u4E2D</span>\n        <span class=\"dot-1\">.</span>\n        <span class=\"dot-2\">.</span>\n        <span class=\"dot-3\">.</span>\n      </div>\n      <video *ngIf=\"remoteStream\" class=\"remoteVideo\" #remoteVideo id=\"remoteVideo\" [srcObject]=\"remoteStream\" autoplay\n        playsinline></video>\n    </div>\n\n    <div class=\"rightSide\">\n\n      <div class=\"localVideo\">\n        <video #localVideo id=\"localVideo\" [srcObject]=\"localStream\" muted autoplay playsinline></video>\n      </div>\n\n      <div class=\"galleria\">\n        <p-galleria [value]=\"this.screenshotService.imageUrlSubject.value\"\n          [responsiveOptions]=\"galleriaResponsiveOptions\" [containerStyle]=\"{ 'margin':'auto'}\" [numVisible]=\"3\"\n          [circular]=\"true\">\n\n          <ng-template pTemplate=\"item\" let-imagePath>\n            <ng-container *ngIf=\"imagePath !== ''; else emptyItem\">\n              <img class=\"item\" *ngIf=\"imagePath !== ''\" [src]=\"imagePath\" style=\"display: block;\" />\n            </ng-container>\n\n            <ng-template #emptyItem>\n              <div class=\"empty-galleria-item\">\n                <i class=\"pi pi-image\"></i>\n              </div>\n            </ng-template>\n          </ng-template>\n\n          <ng-template pTemplate=\"thumbnail\" let-imagePath>\n            <div class=\"grid justify-center\">\n              <ng-container *ngIf=\"imagePath !== ''; else emptyThumbnail\">\n                <img class=\"thumbnail\" *ngIf=\"imagePath !== ''\" [src]=\"imagePath\" style=\"display: block;\" />\n              </ng-container>\n              <ng-template #emptyThumbnail>\n                <div class=\"empty-galleria-thumbnail\">\n                  <i class=\"pi pi-image\"></i>\n                </div>\n              </ng-template>\n            </div>\n          </ng-template>\n\n        </p-galleria>\n\n      </div>\n    </div>\n\n  </div>\n  <div class=\"buttons\">\n    <button pButton pRipple class=\"cameraBtn\" id=\"cameraBtn\" (click)=\" disableCamera()\">\n      <span class=\"material-symbols-outlined\">\n        {{videoIcon}}\n      </span>\n    </button>\n\n    <button pButton pRipple class=\"micBtn\" id=\"micBtn\" (click)=\" disableMic()\">\n      <span class=\"material-symbols-outlined\">\n        {{micIcon}}\n      </span>\n    </button>\n\n    <button pButton pRipple class=\"joinBtn\" id=\"joinBtn\" (click)=\"onShootClick()\">\n      <span class=\"material-symbols-outlined\">\n        photo_camera\n      </span>\n    </button>\n\n  </div>\n\n  <div class=\"bottom\">\n    <div class=\"hangupBtn\">\n\n      <!-- \u63A5\u6536\u7AEF\u7528 -->\n      <!-- <button class=\"joinBtn\" id=\"joinBtn\" [disabled]=\"show.isJoinDisabled\" (click)=\"joinRoom()\">\n        <i class=\"pi pi-user-plus\" aria-hidden=\"true\"></i>\n      </button> -->\n\n\n      <button pButton pRipple id=\"hangupBtn\" class=\"p-button-raised p-button-warning\" label=\"\u7D50\u675F\u901A\u8A71\"\n        [disabled]=\"show.isHangupDisabled\" (click)=\"hangUp()\">\n      </button>\n\n    </div>\n\n    <!-- \u63A5\u6536\u7AEF\u7528 -->\n    <!-- <p-dialog header=\"Join room\" [(visible)]=\"show.isDialog\" [modal]=\"true\" [responsive]=\"true\">\n      <div class=\"p-fluid\">\n        <div class=\"p-field\">\n          <label for=\"room-id\">Room ID</label>\n          <input id=\"room-id\" type=\"text\" pInputText [(ngModel)]=\"inputRoomId\">\n        </div>\n      </div>\n      <div class=\"p-dialog-footer\">\n        <pbutton type=\"button\" pButton [label]=\"'\u53D6\u6D88' | translate\" (click)=\"hideDialog()\"></pbutton>\n        <pbutton type=\"button\" pButton [label]=\"'\u52A0\u5165' | translate\" (click)=\"confirmJoinRoom()\" class=\"p-button-primary\">\n        </pbutton>\n      </div>\n    </p-dialog> -->\n\n  </div>\n</div>\n", styles: [":host{width:100%;height:100%;display:block}.container{width:100%;max-width:100vw;padding:.1875rem;height:auto;display:flex;flex-direction:column}.container .top{display:flex;width:100%;height:100%;max-height:700px;justify-content:center}.container .top .leftSide{width:70%;margin:.1rem .5rem;border:3px solid var(--outline-variant, #B5BFBB);display:flex;flex-direction:column;justify-content:center;align-items:center}.container .top .leftSide .loading{display:flex;align-items:center;color:var(--surface-on-surface, #1C1D1C);font-family:Noto Sans TC;font-size:28px;font-style:normal;font-weight:700;line-height:40px;letter-spacing:1.12px}.container .top .leftSide .loading span{animation:loadingDots 1s infinite;opacity:0;animation-delay:0s,.25s,.5s}.container .top .leftSide .loading .dot-1{animation-delay:0s}.container .top .leftSide .loading .dot-2{animation-delay:.25s}.container .top .leftSide .loading .dot-3{animation-delay:.5s}@keyframes loadingDots{0%{opacity:0}20%{opacity:1}to{opacity:0}}.container .top .leftSide .contactsIcon{color:var(--primary-main, #006D50);font-size:3rem}.container .top .leftSide video{width:100%;height:100%;max-height:648.75px;object-fit:cover}.container .top .rightSide{width:30%;height:100%;display:flex;flex-direction:column}.container .top .rightSide video{width:100%;border-radius:var(--border-radius-none, 0px);border:3px solid var(--outline-variant, #B5BFBB);object-fit:cover}.container .top .rightSide .localVideo{width:100%;height:50%}.container .buttons{display:flex;padding:var(--spacing-xs, 0px);justify-content:center;align-items:flex-start;gap:var(--spacing-xxl, 2rem);border-radius:var(--border-radius-none, 0px);align-self:stretch}.container .buttons ::ng-deep .p-divider.p-divider-vertical{width:1px;border-radius:var(--border-radius-none, 0px);background:var(--outline-variant, #B5BFBB)}.container .buttons ::ng-deep .p-button:enabled:hover{color:var(--primary-container);border-color:transparent}.container .buttons ::ng-deep .p-button{color:var(--surface-on-surface, #1C1D1C);background:var(--primary-main);border:0 none;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px;min-width:unset;padding:unset}.container .buttons button{width:3rem;height:3rem;padding:var(--spacing-xs, 4px);background:none;border-style:none}.bottom{display:flex;justify-content:flex-end;height:30%;padding:var(--spacing-xs, 4px) var(--spacing-md, 12px);border-radius:var(--border-radius-none, 0px) var(--border-radius-none, 0px) var(--border-radius-button, 6px) var(--border-radius-button, 6px);border-top:1px solid var(--outline-variant, #B5BFBB)}::ng-deep .grid{display:flex;flex-wrap:wrap;margin-right:unset;margin-left:unset;margin-top:unset}::ng-deep .galleria{width:100%;height:50%;display:flex;flex-direction:column}::ng-deep .galleria .p-galleria-item-wrapper{position:relative;border-radius:var(--border-radius-none, 0px);background:var(--surface-ground, #F6F6F6);height:50%}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item{height:100%;width:100%;border-radius:var(--border-radius-none, 0px);background:var(--surface-ground, #F6F6F6);display:flex;padding:var(--spacing-none, 0px);flex-direction:column;justify-content:center;align-items:center;gap:10px;align-self:stretch;aspect-ratio:456/266}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item .pi{font-size:2rem}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item .item{width:100%;max-width:456px;max-height:266px;height:auto;margin-left:auto;margin-right:auto;aspect-ratio:456/266}::ng-deep .galleria .p-galleria-thumbnail-wrapper{height:50%;border-radius:var(--border-radius-none, 0px);background:var(--surface-section, #ECEDED)}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container{border-radius:var(--border-radius-none, 0px);background:var(--surface-section, #ECEDED);display:flex;padding:var(--spacing-none, 0px);justify-content:space-between;align-items:center;align-content:center;row-gap:.25rem;align-self:stretch;aspect-ratio:456/80}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .p-galleria-thumbnail-prev,::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .p-galleria-thumbnail-next{margin:0 .5rem;background-color:transparent;color:#ffffffde;width:2rem;height:2rem;transition:background-color .2s,color .2s,box-shadow .2s;border-radius:50%}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .thumbnail{width:100%;max-width:80px;height:auto;margin-left:auto;margin-right:auto;aspect-ratio:1/1}::ng-deep .galleria .p-icon-wrapper{color:var(--surface-on-surface)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: DialogModule }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: DividerModule }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: ToastModule }, { kind: "ngmodule", type: MessagesModule }, { kind: "ngmodule", type: GalleriaModule }, { kind: "component", type: i4.Galleria, selector: "p-galleria", inputs: ["activeIndex", "fullScreen", "id", "value", "numVisible", "responsiveOptions", "showItemNavigators", "showThumbnailNavigators", "showItemNavigatorsOnHover", "changeItemOnIndicatorHover", "circular", "autoPlay", "shouldStopAutoplayByClick", "transitionInterval", "showThumbnails", "thumbnailsPosition", "verticalThumbnailViewPortHeight", "showIndicators", "showIndicatorsOnItem", "indicatorsPosition", "baseZIndex", "maskClass", "containerClass", "containerStyle", "showTransitionOptions", "hideTransitionOptions", "visible"], outputs: ["activeIndexChange", "visibleChange"] }, { kind: "ngmodule", type: ProgressSpinnerModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: FireVideoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-fire-video', standalone: true, imports: [CommonModule, DialogModule, FormsModule, TranslateModule, primeModule], providers: [MessageService], template: "<!-- eslint-disable @angular-eslint/template/alt-text -->\n<div class=\"container\">\n  <div class=\"top\">\n    <div class=\"leftSide\">\n      <div *ngIf=\"!remoteStream\" class=\"material-symbols-outlined contactsIcon\">\n        {{contactsIcon}}\n      </div>\n      <div *ngIf=\"!remoteStream\" class=\"loading\">\n        <span>\u9023\u7DDA\u4E2D</span>\n        <span class=\"dot-1\">.</span>\n        <span class=\"dot-2\">.</span>\n        <span class=\"dot-3\">.</span>\n      </div>\n      <video *ngIf=\"remoteStream\" class=\"remoteVideo\" #remoteVideo id=\"remoteVideo\" [srcObject]=\"remoteStream\" autoplay\n        playsinline></video>\n    </div>\n\n    <div class=\"rightSide\">\n\n      <div class=\"localVideo\">\n        <video #localVideo id=\"localVideo\" [srcObject]=\"localStream\" muted autoplay playsinline></video>\n      </div>\n\n      <div class=\"galleria\">\n        <p-galleria [value]=\"this.screenshotService.imageUrlSubject.value\"\n          [responsiveOptions]=\"galleriaResponsiveOptions\" [containerStyle]=\"{ 'margin':'auto'}\" [numVisible]=\"3\"\n          [circular]=\"true\">\n\n          <ng-template pTemplate=\"item\" let-imagePath>\n            <ng-container *ngIf=\"imagePath !== ''; else emptyItem\">\n              <img class=\"item\" *ngIf=\"imagePath !== ''\" [src]=\"imagePath\" style=\"display: block;\" />\n            </ng-container>\n\n            <ng-template #emptyItem>\n              <div class=\"empty-galleria-item\">\n                <i class=\"pi pi-image\"></i>\n              </div>\n            </ng-template>\n          </ng-template>\n\n          <ng-template pTemplate=\"thumbnail\" let-imagePath>\n            <div class=\"grid justify-center\">\n              <ng-container *ngIf=\"imagePath !== ''; else emptyThumbnail\">\n                <img class=\"thumbnail\" *ngIf=\"imagePath !== ''\" [src]=\"imagePath\" style=\"display: block;\" />\n              </ng-container>\n              <ng-template #emptyThumbnail>\n                <div class=\"empty-galleria-thumbnail\">\n                  <i class=\"pi pi-image\"></i>\n                </div>\n              </ng-template>\n            </div>\n          </ng-template>\n\n        </p-galleria>\n\n      </div>\n    </div>\n\n  </div>\n  <div class=\"buttons\">\n    <button pButton pRipple class=\"cameraBtn\" id=\"cameraBtn\" (click)=\" disableCamera()\">\n      <span class=\"material-symbols-outlined\">\n        {{videoIcon}}\n      </span>\n    </button>\n\n    <button pButton pRipple class=\"micBtn\" id=\"micBtn\" (click)=\" disableMic()\">\n      <span class=\"material-symbols-outlined\">\n        {{micIcon}}\n      </span>\n    </button>\n\n    <button pButton pRipple class=\"joinBtn\" id=\"joinBtn\" (click)=\"onShootClick()\">\n      <span class=\"material-symbols-outlined\">\n        photo_camera\n      </span>\n    </button>\n\n  </div>\n\n  <div class=\"bottom\">\n    <div class=\"hangupBtn\">\n\n      <!-- \u63A5\u6536\u7AEF\u7528 -->\n      <!-- <button class=\"joinBtn\" id=\"joinBtn\" [disabled]=\"show.isJoinDisabled\" (click)=\"joinRoom()\">\n        <i class=\"pi pi-user-plus\" aria-hidden=\"true\"></i>\n      </button> -->\n\n\n      <button pButton pRipple id=\"hangupBtn\" class=\"p-button-raised p-button-warning\" label=\"\u7D50\u675F\u901A\u8A71\"\n        [disabled]=\"show.isHangupDisabled\" (click)=\"hangUp()\">\n      </button>\n\n    </div>\n\n    <!-- \u63A5\u6536\u7AEF\u7528 -->\n    <!-- <p-dialog header=\"Join room\" [(visible)]=\"show.isDialog\" [modal]=\"true\" [responsive]=\"true\">\n      <div class=\"p-fluid\">\n        <div class=\"p-field\">\n          <label for=\"room-id\">Room ID</label>\n          <input id=\"room-id\" type=\"text\" pInputText [(ngModel)]=\"inputRoomId\">\n        </div>\n      </div>\n      <div class=\"p-dialog-footer\">\n        <pbutton type=\"button\" pButton [label]=\"'\u53D6\u6D88' | translate\" (click)=\"hideDialog()\"></pbutton>\n        <pbutton type=\"button\" pButton [label]=\"'\u52A0\u5165' | translate\" (click)=\"confirmJoinRoom()\" class=\"p-button-primary\">\n        </pbutton>\n      </div>\n    </p-dialog> -->\n\n  </div>\n</div>\n", styles: [":host{width:100%;height:100%;display:block}.container{width:100%;max-width:100vw;padding:.1875rem;height:auto;display:flex;flex-direction:column}.container .top{display:flex;width:100%;height:100%;max-height:700px;justify-content:center}.container .top .leftSide{width:70%;margin:.1rem .5rem;border:3px solid var(--outline-variant, #B5BFBB);display:flex;flex-direction:column;justify-content:center;align-items:center}.container .top .leftSide .loading{display:flex;align-items:center;color:var(--surface-on-surface, #1C1D1C);font-family:Noto Sans TC;font-size:28px;font-style:normal;font-weight:700;line-height:40px;letter-spacing:1.12px}.container .top .leftSide .loading span{animation:loadingDots 1s infinite;opacity:0;animation-delay:0s,.25s,.5s}.container .top .leftSide .loading .dot-1{animation-delay:0s}.container .top .leftSide .loading .dot-2{animation-delay:.25s}.container .top .leftSide .loading .dot-3{animation-delay:.5s}@keyframes loadingDots{0%{opacity:0}20%{opacity:1}to{opacity:0}}.container .top .leftSide .contactsIcon{color:var(--primary-main, #006D50);font-size:3rem}.container .top .leftSide video{width:100%;height:100%;max-height:648.75px;object-fit:cover}.container .top .rightSide{width:30%;height:100%;display:flex;flex-direction:column}.container .top .rightSide video{width:100%;border-radius:var(--border-radius-none, 0px);border:3px solid var(--outline-variant, #B5BFBB);object-fit:cover}.container .top .rightSide .localVideo{width:100%;height:50%}.container .buttons{display:flex;padding:var(--spacing-xs, 0px);justify-content:center;align-items:flex-start;gap:var(--spacing-xxl, 2rem);border-radius:var(--border-radius-none, 0px);align-self:stretch}.container .buttons ::ng-deep .p-divider.p-divider-vertical{width:1px;border-radius:var(--border-radius-none, 0px);background:var(--outline-variant, #B5BFBB)}.container .buttons ::ng-deep .p-button:enabled:hover{color:var(--primary-container);border-color:transparent}.container .buttons ::ng-deep .p-button{color:var(--surface-on-surface, #1C1D1C);background:var(--primary-main);border:0 none;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px;min-width:unset;padding:unset}.container .buttons button{width:3rem;height:3rem;padding:var(--spacing-xs, 4px);background:none;border-style:none}.bottom{display:flex;justify-content:flex-end;height:30%;padding:var(--spacing-xs, 4px) var(--spacing-md, 12px);border-radius:var(--border-radius-none, 0px) var(--border-radius-none, 0px) var(--border-radius-button, 6px) var(--border-radius-button, 6px);border-top:1px solid var(--outline-variant, #B5BFBB)}::ng-deep .grid{display:flex;flex-wrap:wrap;margin-right:unset;margin-left:unset;margin-top:unset}::ng-deep .galleria{width:100%;height:50%;display:flex;flex-direction:column}::ng-deep .galleria .p-galleria-item-wrapper{position:relative;border-radius:var(--border-radius-none, 0px);background:var(--surface-ground, #F6F6F6);height:50%}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item{height:100%;width:100%;border-radius:var(--border-radius-none, 0px);background:var(--surface-ground, #F6F6F6);display:flex;padding:var(--spacing-none, 0px);flex-direction:column;justify-content:center;align-items:center;gap:10px;align-self:stretch;aspect-ratio:456/266}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item .pi{font-size:2rem}::ng-deep .galleria .p-galleria-item-wrapper .p-galleria-item .item{width:100%;max-width:456px;max-height:266px;height:auto;margin-left:auto;margin-right:auto;aspect-ratio:456/266}::ng-deep .galleria .p-galleria-thumbnail-wrapper{height:50%;border-radius:var(--border-radius-none, 0px);background:var(--surface-section, #ECEDED)}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container{border-radius:var(--border-radius-none, 0px);background:var(--surface-section, #ECEDED);display:flex;padding:var(--spacing-none, 0px);justify-content:space-between;align-items:center;align-content:center;row-gap:.25rem;align-self:stretch;aspect-ratio:456/80}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .p-galleria-thumbnail-prev,::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .p-galleria-thumbnail-next{margin:0 .5rem;background-color:transparent;color:#ffffffde;width:2rem;height:2rem;transition:background-color .2s,color .2s,box-shadow .2s;border-radius:50%}::ng-deep .galleria .p-galleria-thumbnail-wrapper .p-galleria-thumbnail-container .thumbnail{width:100%;max-width:80px;height:auto;margin-left:auto;margin-right:auto;aspect-ratio:1/1}::ng-deep .galleria .p-icon-wrapper{color:var(--surface-on-surface)}\n"] }]
        }], propDecorators: { roomId: [{
                type: Input
            }], remoteVideo: [{
                type: ViewChild,
                args: ['remoteVideo']
            }] } });

/*
 * Public API Surface of fire-video
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ConnectionService, FireVideoComponent, FirebaseService, IceCandidateService, MediaService, ScreenshotService, Show, iceSeverConfig };
//# sourceMappingURL=his-directive-fire-video.mjs.map

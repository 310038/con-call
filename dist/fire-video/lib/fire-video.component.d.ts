import { Show } from './show';
import { ElementRef, OnInit } from '@angular/core';
import { ScreenshotService } from './screenshot.service';
import { IceCandidateService } from './ice-candidate.service';
import { ConnectionService } from './connection.service';
import { FirebaseService } from './firebase.service';
import { MediaService } from './media.service';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class FireVideoComponent implements OnInit {
    /** 取得欲創建房間的號碼（預設應該要是病人身分證字號）
     * 使用此專案的程式需傳送欲創建房間的號碼至此，以便使用該號碼建立房間
     */
    roomId: string;
    remoteVideo: ElementRef<HTMLVideoElement>;
    localStream: MediaStream;
    remoteStream: MediaStream;
    CallerPeerConnection: RTCPeerConnection;
    CalleePeerConnection: RTCPeerConnection;
    inputRoomId: string;
    videoIcon: string;
    micIcon: string;
    contactsIcon: string;
    imageURIs: Observable<string[] | any>;
    ngOnInit(): void;
    galleriaResponsiveOptions: any[];
    show: Show;
    fireBaseService: FirebaseService;
    iceCandidateService: IceCandidateService;
    screenshotService: ScreenshotService;
    peerConnectionService: ConnectionService;
    mediaService: MediaService;
    /** 監聽截圖按鈕，當此按鈕被點擊時，呼叫 screenshot()，將對方視訊畫面截圖，並上傳至 CDN
     */
    onShootClick(): void;
    /** 切換「鏡頭」開關
     */
    disableCamera(): void;
    /** 切換「麥克風」開關
     */
    disableMic(): void;
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
    createRoom(): Promise<void>;
    /** 按下「加入視訊」按鈕後，會執行以下動作：
     * 0.檢查使用者是否已經開啟視訊及麥克風，若否，則跳出警告視窗
     * 當此按鈕被按下後，會執行以下動作：
     * 1.彈出「加入視訊」對話框(讓user可以輸入指定的房間號碼，按下「確認」按鈕，就可以加入指定的房間。)
     * @todo showDialog() 顯示「加入視訊」對話框，讓user可以輸入指定的房間號碼，按下「確認」按鈕，就可以加入指定的房間。
     */
    joinRoom(): void;
    /** 彈出「加入視訊」對話框後，user可以輸入房間號碼(病人身分證字號)，按下「確認」按鈕，就可以加入指定的房間。
     * 透過房間號碼(病人身分證字號)加入房間
     * 使用者可以透過輸入指定的房間號碼(病人身分證字號)來加入房間
     * @param roomId 房間號碼(病人身分證字號)
     * @todo joinRoomById()透過房間號碼(病人身分證字號)加入房間
     */
    confirmJoinRoom(): Promise<void>;
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
    joinRoomById(inputRoomId: string): Promise<void>;
    /** 開啟視訊
     */
    openUserMedia(): Promise<void>;
    /** 掛斷視訊通話
     * 關閉視訊和音訊，並關閉連線雙方的peerConnection。
     * 關閉視訊通話後，將會刪除fireStore中的房間文件
     */
    hangUp(): Promise<void>;
    /** 顯示「加入視訊」對話框
     */
    showDialog(): void;
    /** 關閉「加入視訊」對話框
     */
    hideDialog(): void;
    /** 停止 localStream 和 remoteStream 中的所有媒體軌道
     */
    stopMediaTracks(): Promise<void>;
    /** 關閉連線雙方(caller 跟 callee)的peerConnection
     */
    removePeerConnections(): void;
    /** 清除firestore中的房間文件
     */
    executeFirebaseCleanup(): Promise<void>;
    /** 重新載入頁面
     */
    reloadPage(): void;
    /** 初始化頁面元件，包含localStream、remoteStream、roomName
     * 將頁面初始化，包含localStream、remoteStream、roomName
     */
    initElements(): void;
    /** 在建立RTCPeerConnection物件後，將localStream加入PeerConnection，以利後續傳送給另一端，另一端接收到後就可以顯示在remoteVideo上(display the local media data.)
     * 在localStream建立完後(也就是openUserMedia()執行完後)，才能執行下面這行。使用 getTracks() 方法獲取所有mediaTrack軌道，並將這些mediaTrack軌道添加到 RTCPeerConnection 中。
     * getTracks 獲取媒體流所有軌道並返回 array
     * addTracks 將新的音訊或視訊軌道添加到現有的媒體流中
     * @param PeerConnection：RTCPeerConnection
     */
    addLocalMediaTracks(PeerConnection: RTCPeerConnection): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FireVideoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FireVideoComponent, "his-fire-video", never, { "roomId": { "alias": "roomId"; "required": false; }; }, {}, never, never, true, never>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessagesModule } from 'primeng/messages';
import { Show } from './show';
import { Component, ViewChild, inject, ElementRef, Input, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ScreenshotService } from './screenshot.service';
import { IceCandidateService } from './ice-candidate.service';
import { ConnectionService } from './connection.service';
import { FirebaseService } from './firebase.service';
import { MediaService } from './media.service';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { GalleriaModule } from 'primeng/galleria';
import { Observable } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
const primeModule = [DividerModule, ButtonModule, DialogModule, ToastModule, MessagesModule, GalleriaModule, ProgressSpinnerModule];
@Component({
  selector: 'his-fire-video',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, TranslateModule, primeModule],
  templateUrl: './fire-video.component.html',
  styleUrls: ['./fire-video.component.scss'],
  providers: [MessageService]
})
export class FireVideoComponent implements OnInit {

  /** 取得欲創建房間的號碼（預設應該要是病人身分證字號）
   * 使用此專案的程式需傳送欲創建房間的號碼至此，以便使用該號碼建立房間
   */
  @Input() roomId!: string;

  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  localStream!: MediaStream;
  remoteStream!: MediaStream;
  CallerPeerConnection!: RTCPeerConnection;
  CalleePeerConnection!: RTCPeerConnection;
  inputRoomId!: string;
  videoIcon = 'videoCam';
  micIcon = "Mic";
  contactsIcon = "Contacts"
  imageURIs!: Observable<string[] | any>;

  ngOnInit() {
    this.openUserMedia();
  }

  // 定義在不同螢幕大小或設備上顯示圖片輪播時的配置選項
  galleriaResponsiveOptions: any[] = [
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

  show = new Show();

  fireBaseService: FirebaseService = inject(FirebaseService);
  iceCandidateService: IceCandidateService = inject(IceCandidateService);
  screenshotService: ScreenshotService = inject(ScreenshotService);
  peerConnectionService: ConnectionService = inject(ConnectionService);
  mediaService: MediaService = inject(MediaService);

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
  async joinRoomById(inputRoomId: string) {
    // 1.取得user輸入的房間號碼(roomId)的房間的DocumentReference
    const roomDocRef: DocumentReference<unknown> =
      this.fireBaseService.getDocRef('rooms', `${inputRoomId}`);

    // 2. 獲取 roomDocRef 的 snapshot，並判斷使用者所輸入的房間(號碼)是否存在，如果不存在，則跳出警告視窗
    const roomSnapshot: any = await this.fireBaseService.getSnapshot(roomDocRef);

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
  showDialog(): void {
    this.show.isDialog = true;
  }

  /** 關閉「加入視訊」對話框
   */
  hideDialog(): void {
    this.show.isDialog = false;
  }

  /** 停止 localStream 和 remoteStream 中的所有媒體軌道
   */
  async stopMediaTracks(): Promise<void> {
    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
    }
  }

  /** 關閉連線雙方(caller 跟 callee)的peerConnection
   */
  removePeerConnections(): void {
    if (this.CallerPeerConnection) {
      this.CallerPeerConnection.close();
    }

    if (this.CalleePeerConnection) {
      this.CalleePeerConnection.close();
    }
  }

  /** 清除firestore中的房間文件
   */
  async executeFirebaseCleanup(): Promise<void> {
    if (this.roomId) {
      const roomDocRef = this.fireBaseService.getDocRef('rooms', this.roomId);

      const calleeCandidatesRef = this.fireBaseService.getSubCollectionRef(roomDocRef, 'calleeCandidates');
      calleeCandidatesRef.onSnapshot((snapshot: any) => {
        console.log(snapshot);

        snapshot.ref.delete();
      });

      const callerCandidatesRef = this.fireBaseService.getSubCollectionRef(roomDocRef, 'callerCandidates');
      callerCandidatesRef.onSnapshot((snapshot: any) => {
        snapshot.ref.delete();
      });

      await roomDocRef.delete();
    }
  }
  /** 重新載入頁面
   */
  reloadPage(): void {
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
  addLocalMediaTracks(PeerConnection: RTCPeerConnection): void {
    this.localStream.getTracks().forEach((track) => {

      PeerConnection.addTrack(track, this.localStream);

    });
  }

}

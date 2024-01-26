# FireVideo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.3.

## RTCPeerConnection
RTCPeerConnection -> SDP -> Offer/Answer
WebRTC 核心功能之一是 RTCPeerConnection，其中相關的 SDP（Session Description Protocol）協定的 Offer/Answer 機制。

SDP（Session Description Protocol）是一種描述媒體會話的協定，用於描述音訊和視訊的屬性，如編解碼器、媒體類型、媒體流的 IP 地址和端口等信息。在 WebRTC 中，被用於協商兩個對等端之間的媒體會話參數。
SDP 中的 iceCandidate：RTCIceCandidate 通常嵌入在 Session Description Protocol（SDP）中，以便在 WebRTC 會話中進行交換。


Offer/Answer
WebRTC 中用於建立對等連接的協商過程。

在這個過程中，一方（通常是發起通話的一方）將一個 SDP Offer 發送給對方，對方收到 Offer 後，回復一個 SDP Answer。這兩者包含了各自的媒體參數描述，以及關於媒體連接方式的信息。

確保了通話雙方的媒體設置是相容的，並且交換彼此的資訊也接收彼此的資訊以達到連線。

雖然通常是但由加入者發起通話也是可行的，只要兩者皆發送 SDP 給對方完成交換訊息的協商過程就可以達到連線。

如何建立連線
Host 開啟媒體建立 offer
Host 將 offer 設定為 localDescription
Guset 收到 offer
Guset 將 offer 設定為 remoteDescription
Guset 建立 Answer
Host 將 Answer 設定為 localDescription
Host 收到 Answer
Host 將 Answer 設定為 remoteDescription

重點整理：
RTCPeerConnection 在剛開始交換資訊時需要 Signaing Server 讓使用者交換第一次的資料
WebRTC 使用 SDP 來協定來交換通信的參數
Offer/Answer 包含了各自的媒體參數描述，用於交換資訊時雙方溝通的媒介

## ICE 協議 - Interactive Connectivity Establishment
ICE 用於處理 NAT 穿越和防火牆問題同時使用 STUN 和 TURN 來獲取 IP 地址和 port （稱為候選者），這些候選者(RTCIceCandidate )可以有多個，連線時發起者與加入者都會創建多個候選者進行連接檢查並配對。

以下是 ICE 的工作步驟：

1. 搜集候選者：
A和B分別向 STUN 發送請求，STUN 會回復他們的公共 IP位置及 port ，這些是候選者。

2. 交換候選者：
A 將自己的候選者列表發送給B，而B將自己的候選者列表發送給A。這些列表包含了它們可用的連接方式，就像兩人互相告訴對方自己的聯絡方式。

3. 檢查連接：
A 和 B 在列表中依照協議類型、地址類型、連接性類型等方式進行挑選，嘗試進行連接、發送測試消息，就像打電話並確保對方可以聽到。

4. 完成連接：
當 A 和 B 完成連線~


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

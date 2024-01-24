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
export declare const iceSeverConfig: {
    iceServers: {
        urls: string[];
    }[];
    iceCandidatePoolSize: number;
};

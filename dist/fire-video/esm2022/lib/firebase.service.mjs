import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as i0 from "@angular/core";
export class FirebaseService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2ZpcmUtdmlkZW8vc3JjL2xpYi9maXJlYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBNEQsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFLNUgsTUFBTSxPQUFPLGVBQWU7SUFINUI7UUFJRSxjQUFTLEdBQXFCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBNkZ4RDtJQTFGQzs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLGNBQXNCO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7T0FFRztJQUNILGdCQUFnQixDQUFDLGNBQXNCO1FBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFlBQVksQ0FBQyxjQUFzQixFQUFFLE1BQWMsRUFBRSxJQUFZO1FBRS9ELDJCQUEyQjtRQUMzQixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBQyxjQUFzQixFQUFFLE1BQWMsRUFBRSxJQUFZO1FBRWxFLDJCQUEyQjtRQUMzQixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsY0FBc0IsRUFBRSxNQUFjO1FBRTlDLHdDQUF3QztRQUN4QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFOUMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGdCQUFnQixDQUFDLE1BQWtDLEVBQUUsaUJBQXlCLEVBQUUsSUFBWTtRQUUxRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUU5RCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxtQkFBbUIsQ0FBQyxNQUFrQyxFQUFFLGlCQUF5QjtRQUMvRSxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLE1BQWtDO1FBQzVDLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBd0MsQ0FBQztJQUM1RCxDQUFDOzhHQTdGVSxlQUFlO2tIQUFmLGVBQWUsY0FGZCxNQUFNOzsyRkFFUCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVzdG9yZSwgQ29sbGVjdGlvblJlZmVyZW5jZSwgRG9jdW1lbnRSZWZlcmVuY2UsIERvY3VtZW50U25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9maXJlL2NvbXBhdC9maXJlc3RvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VTZXJ2aWNlIHtcbiAgZmlyZVN0b3JlOiBBbmd1bGFyRmlyZXN0b3JlID0gaW5qZWN0KEFuZ3VsYXJGaXJlc3RvcmUpO1xuXG5cbiAgLyoqIOWcqGZpcmVTdG9yZeS4reWJteW7uuS4gOWAi+mbhuWQiChjb2xsZWN0aW9uKe+8jOatpOmbhuWQiOWQjeeoseeCuueUseWPg+aVuGNvbGxlY3Rpb25OYW1l5rG65a6aKOmgkOioreeCunJvb21zKVxuICAgKiDpgJnlgItjb2xsZWN0aW9u6KOh5pyD5pyJ5b6I5aSaZG9jdW1lbnRzXG4gICAqIOmgkOioreeCujrlibXlu7rkuIDlgIvlkI3ngroncm9vbXMn55qEY29sbGVjdGlvbu+8jOmAmeWAi2NvbGxlY3Rpb27oo6HmnIPmnInlvojlpJrmiL/plpPvvIzkuI3lkIzmiL/plpPku6XkuI3lkIzmiL/plpPomZ/norwocm9vbUlkKeWNgOWIhlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbk5hbWUgY29sbGVjdGlvbuWQjeeose+8jOmgkOiorWNvbGxlY3Rpb25OYW1lIOWPq+WBmiByb29tc1xuICAgKi9cbiAgYWRkQ29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5maXJlU3RvcmUuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gIH1cblxuICAvKiog542y5Y+W54m55a6aIGNvbGxlY3Rpb25OYW1lIOeahCBDb2xsZWN0aW9uUmVmZXJlbmNlXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uTmFtZSBjb2xsZWN0aW9u5ZCN56ix77yM6aCQ6KitY29sbGVjdGlvbk5hbWUg5Y+r5YGaIHJvb21zXG4gICAqL1xuICBnZXRDb2xsZWN0aW9uUmVmKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uUmVmID0gdGhpcy5maXJlU3RvcmUuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb25SZWY7XG4gIH1cblxuICAvKiog5ZyoZmlyZVN0b3Jl5Lit55qEJ3Jvb21zJyhjb2xsZWN0aW9uKeS4reWJteW7uuS4gOWAi+S7peWPg+aVuCdyb29tSWQn54K65ZCN56ix55qE5paH5Lu2KGRvYynvvIzkuKbmiopkYXRh5a+r6YCy5Y676YCZ5YCL5paH5Lu2KGRvYynkuK1cbiAgICog5Y+W5b6X5oyH5a6a5oi/6ZaT55qEZG9jdW1lbnQocm9vbURvYykg77yM5Lim5L2/55SoIGZpcmVzdG9yZSjljp/nlJ/vvInnmoQgc2V0KCkg5pa55rOV77yM5bCHZGF0YeWvq+mAsumAmeWAi+aWh+S7tihkb2Mp5LitXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uTmFtZSBjb2xsZWN0aW9u5ZCN56ix77yM6aCQ6KitY29sbGVjdGlvbk5hbWUg5Y+r5YGaIHJvb21zXG4gICAqIEBwYXJhbSByb29tSWQg6KaB5Ym15bu655qE5paH5Lu2KGRvYynnmoTlkI3nqLHvvIzpoJDoqK3ngrrnl4Xkurrouqvku73orYnlrZfomZ9cbiAgICogQHBhcmFtIGRhdGEg6KaB5a+r6YCy6YCZ5YCL5paH5Lu2KGRvYynkuK3nmoTos4fmlplcbiAgICovXG4gIGFkZERhdGFUb0RvYyhjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCByb29tSWQ6IHN0cmluZywgZGF0YTogb2JqZWN0KTogdm9pZCB7XG5cbiAgICAvLyDlj5blvpfmjIflrprmiL/plpPnmoRkb2N1bWVudChyb29tRG9jKVxuICAgIGNvbnN0IHJvb21Db2xsZWN0aW9uID0gdGhpcy5nZXRDb2xsZWN0aW9uUmVmKGNvbGxlY3Rpb25OYW1lKTtcbiAgICBjb25zdCByb29tRG9jID0gcm9vbUNvbGxlY3Rpb24uZG9jKHJvb21JZCk7XG5cbiAgICByb29tRG9jLnNldChkYXRhKTtcbiAgfVxuXG4gIC8qKiDmm7TmlrDmjIflrprmiL/plpPnmoQgZG9jdW1lbnQg6LOH5paZXG4gICAqIOWPluW+l+aMh+WumuaIv+mWk+eahGRvY3VtZW50KHJvb21Eb2MpIO+8jOS4puS9v+eUqCBmaXJlc3RvcmUo5Y6f55Sf77yJ55qEIHVwZGF0ZSgpIOaWueazle+8jOWwhyBkYXRhIOabtOaWsOWIsOmAmeWAi+aWh+S7tihkb2Mp5LitXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uTmFtZSBjb2xsZWN0aW9u5ZCN56ix77yM6aCQ6KitY29sbGVjdGlvbk5hbWUg5Y+r5YGaIHJvb21zXG4gICAqIEBwYXJhbSByb29tSWQg5paH5Lu2KGRvYynnmoTlkI3nqLHvvIzpoJDoqK3ngrrnl4Xkurrouqvku73orYnlrZfomZ9cbiAgICogQHBhcmFtIGRhdGEg6KaB5pu05paw5Yiw6YCZ5YCL5paH5Lu2KGRvYynkuK3nmoTos4fmlplcbiAgICovXG4gIHVwZGF0ZURhdGFUb0RvYyhjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCByb29tSWQ6IHN0cmluZywgZGF0YTogb2JqZWN0KSB7XG5cbiAgICAvLyDlj5blvpfmjIflrprmiL/plpPnmoRkb2N1bWVudChyb29tRG9jKVxuICAgIGNvbnN0IHJvb21Db2xsZWN0aW9uID0gdGhpcy5nZXRDb2xsZWN0aW9uUmVmKGNvbGxlY3Rpb25OYW1lKTtcbiAgICBjb25zdCByb29tRG9jID0gcm9vbUNvbGxlY3Rpb24uZG9jKHJvb21JZCk7XG5cbiAgICByb29tRG9jLnVwZGF0ZShkYXRhKTtcbiAgfVxuXG4gIC8qKiDnjbLlj5bmjIflrpogY29sbGVjdGlvbk5hbWUg5Lit55qE5oyH5a6a55qE5paH5Lu2KERvY3VtZW50KeeahFJlZmVyZW5jZVxuICAgKiBAcGFyYW0gY29sbGVjdGlvbk5hbWUgY29sbGVjdGlvbuWQjeeose+8jOmgkOiorWNvbGxlY3Rpb25OYW1lIOWPq+WBmiByb29tc1xuICAgKiBAcGFyYW0gcm9vbUlkIOaWh+S7tihkb2Mp55qE5ZCN56ix77yM6aCQ6Kit54K655eF5Lq66Lqr5Lu96K2J5a2X6JmfXG4gICAqL1xuICBnZXREb2NSZWYoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgcm9vbUlkOiBzdHJpbmcpOiBEb2N1bWVudFJlZmVyZW5jZTx1bmtub3duPiB7XG5cbiAgICAvLyDlj5blvpfmjIflrprmiL/plpPnmoTmlofku7blj4PogIMgRG9jdW1lbnRSZWZlcmVuY2UoZG9jUmVmKVxuICAgIGNvbnN0IHJvb21Db2xsZWN0aW9uID0gdGhpcy5nZXRDb2xsZWN0aW9uUmVmKGNvbGxlY3Rpb25OYW1lKTtcbiAgICBjb25zdCBkb2NSZWYgPSByb29tQ29sbGVjdGlvbi5kb2Mocm9vbUlkKS5yZWY7XG5cbiAgICByZXR1cm4gZG9jUmVmO1xuICB9XG5cbiAgLyoqIOWcqOaMh+WumueahOaWh+S7tihkb2N1bWVudCnkuK3libXlu7rkuIDlgIvlkI3ngrogJ3N1YkNvbGxlY3Rpb25OYW1lJyDnmoTlrZDpm4blkIgoc3ViQ29sbGVjdGlvbinvvIzkuKbmiopkYXRh5a+r6YCy5Y676YCZ5YCL5a2Q6ZuG5ZCIKHN1YkNvbGxlY3Rpb24p5LitXG4gICAqIOS+i+Wmgu+8muWcqCdyb29tcycoY29sbGVjdGlvbinkuK3mn5DkuIDlgItyb29tSWTnmoTmlofku7YoZG9jKeS4reWJteW7uuS4gOWAi+WQjeeCumNhbGxlckNhbmRpZGF0ZXPnmoTlrZDpm4blkIgoc3ViQ29sbGVjdGlvbilcbiAgICog5Ym15bu6c3ViQ29sbGVjdGlvbuW+jO+8jOWIqeeUqHN1YkNvbGxlY3Rpb25SZWYg5Lim5pCt6YWNIGZpcmVzdG9yZSjljp/nlJ/vvInnmoQgYWRkKCkg5pa55rOV77yM5bCHZGF0YeWvq+mAsumAmeWAi+aWh+S7tihkb2Mp5LitXG4gICAqIEBwYXJhbSBkb2NSZWYg5qyy5Ym15bu6IHN1YkNvbGxlY3Rpb24g55qE5paH5Lu2KGRvY3VtZW50KeeahFJlZmVyZW5jZVxuICAgKiBAcGFyYW0gc3ViQ29sbGVjdGlvbk5hbWUg5qyy5Ym15bu655qE5a2Q6ZuG5ZCIKHN1YkNvbGxlY3Rpb24p55qE5ZCN56ixXG4gICAqIEBwYXJhbSBkYXRhIOimgeWvq+mAsumAmeWAi+WtkOmbhuWQiChzdWJDb2xsZWN0aW9uKeS4reeahOizh+aWmVxuICAgKi9cbiAgYWRkU3ViQ29sbGVjdGlvbihkb2NSZWY6IERvY3VtZW50UmVmZXJlbmNlPHVua25vd24+LCBzdWJDb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBvYmplY3QpOiB2b2lkIHtcblxuICAgIGNvbnN0IHN1YkNvbGxlY3Rpb25SZWYgPSBkb2NSZWYuY29sbGVjdGlvbihzdWJDb2xsZWN0aW9uTmFtZSk7XG5cbiAgICBzdWJDb2xsZWN0aW9uUmVmLmFkZCh7IC4uLmRhdGEgfSk7XG4gIH1cblxuICAvKiog542y5Y+W5oyH5a6a5paH5Lu25Y+D6ICDKGRvY1JlZinkuK3nmoTnibnlrprlrZDpm4blkIgoc3ViQ29sbGVjdGlvbinnmoQgUmVmZXJlbmNl77yM5Lmf5bCx5piv542y5Y+W5a2Q6ZuG5ZCIKHN1YkNvbGxlY3Rpb24pIOeahCBDb2xsZWN0aW9uUmVmZXJlbmNl77yJXG4gICAqIOS+i+WmgjrnjbLlj5blkI3ngrogY2FsbGVyQ2FuZGlkYXRlcyDpgJnlgIvlrZDpm4blkIgoc3ViQ29sbGVjdGlvbikg55qEIFJlZmVyZW5jZVxuICAgKiBAcGFyYW0gZG9jUmVmIOipsiBzdWJDb2xsZWN0aW9uIOaJgOWcqOeahOaWh+S7tihkb2N1bWVudCkg55qEIFJlZmVyZW5jZVxuICAgKiBAcGFyYW0gc3ViQ29sbGVjdGlvbk5hbWUg5qyy542y5Y+W55qE5a2Q6ZuG5ZCIKHN1YkNvbGxlY3Rpb24p55qE5ZCN56ixXG4gICAqL1xuICBnZXRTdWJDb2xsZWN0aW9uUmVmKGRvY1JlZjogRG9jdW1lbnRSZWZlcmVuY2U8dW5rbm93bj4sIHN1YkNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBDb2xsZWN0aW9uUmVmZXJlbmNlPHVua25vd24+IHtcbiAgICByZXR1cm4gZG9jUmVmLmNvbGxlY3Rpb24oc3ViQ29sbGVjdGlvbk5hbWUpO1xuICB9XG5cbiAgLyoqIOeNsuWPlueJueWumuaWh+S7tuWPg+iAgyhkb2NSZWYp55qEIHNuYXBzaG90XG4gICAqIHNuYXBzaG90IOaYr2ZpcmVzdG9yZeaPkOS+m+eahCBhcGnvvIzpgI/pgY5zbmFwc2hvdOWPr+S7pSfljbPmmYIn542y5Y+W5Yiw6Kmy5paH5Lu255qE6LOH5paZ6K6K5YyW77yM5L6L5aaC5paw5aKe44CB5L+u5pS544CB5Yiq6Zmk562J44CCXG4gICAqIEBwYXJhbSBEb2NSZWYg5qyy5pON5L2c55qE5paH5Lu2KGRvY3VtZW50KSDnmoQgUmVmZXJlbmNlXG4gICAqL1xuICBnZXRTbmFwc2hvdChEb2NSZWY6IERvY3VtZW50UmVmZXJlbmNlPHVua25vd24+KTogUHJvbWlzZTxEb2N1bWVudFNuYXBzaG90PHVua25vd24+PiB7XG4gICAgcmV0dXJuIERvY1JlZi5nZXQoKSBhcyBQcm9taXNlPERvY3VtZW50U25hcHNob3Q8dW5rbm93bj4+O1xuICB9XG59XG4iXX0=
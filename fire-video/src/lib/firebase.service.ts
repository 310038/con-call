import { Injectable, inject } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference, DocumentSnapshot } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  fireStore: AngularFirestore = inject(AngularFirestore);


  /** 在fireStore中創建一個集合(collection)，此集合名稱為由參數collectionName決定(預設為rooms)
   * 這個collection裡會有很多documents
   * 預設為:創建一個名為'rooms'的collection，這個collection裡會有很多房間，不同房間以不同房間號碼(roomId)區分
   * @param collectionName collection名稱，預設collectionName 叫做 rooms
   */
  addCollection(collectionName: string) {
    this.fireStore.collection(collectionName);
  }

  /** 獲取特定 collectionName 的 CollectionReference
   * @param collectionName collection名稱，預設collectionName 叫做 rooms
   */
  getCollectionRef(collectionName: string) {
    const collectionRef = this.fireStore.collection(collectionName);
    return collectionRef;
  }

  /** 在fireStore中的'rooms'(collection)中創建一個以參數'roomId'為名稱的文件(doc)，並把data寫進去這個文件(doc)中
   * 取得指定房間的document(roomDoc) ，並使用 firestore(原生）的 set() 方法，將data寫進這個文件(doc)中
   * @param collectionName collection名稱，預設collectionName 叫做 rooms
   * @param roomId 要創建的文件(doc)的名稱，預設為病人身份證字號
   * @param data 要寫進這個文件(doc)中的資料
   */
  addDataToDoc(collectionName: string, roomId: string, data: object): void {

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
  updateDataToDoc(collectionName: string, roomId: string, data: object) {

    // 取得指定房間的document(roomDoc)
    const roomCollection = this.getCollectionRef(collectionName);
    const roomDoc = roomCollection.doc(roomId);

    roomDoc.update(data);
  }

  /** 獲取指定 collectionName 中的指定的文件(Document)的Reference
   * @param collectionName collection名稱，預設collectionName 叫做 rooms
   * @param roomId 文件(doc)的名稱，預設為病人身份證字號
   */
  getDocRef(collectionName: string, roomId: string): DocumentReference<unknown> {

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
  addSubCollection(docRef: DocumentReference<unknown>, subCollectionName: string, data: object): void {

    const subCollectionRef = docRef.collection(subCollectionName);

    subCollectionRef.add({ ...data });
  }

  /** 獲取指定文件參考(docRef)中的特定子集合(subCollection)的 Reference，也就是獲取子集合(subCollection) 的 CollectionReference）
   * 例如:獲取名為 callerCandidates 這個子集合(subCollection) 的 Reference
   * @param docRef 該 subCollection 所在的文件(document) 的 Reference
   * @param subCollectionName 欲獲取的子集合(subCollection)的名稱
   */
  getSubCollectionRef(docRef: DocumentReference<unknown>, subCollectionName: string): CollectionReference<unknown> {
    return docRef.collection(subCollectionName);
  }

  /** 獲取特定文件參考(docRef)的 snapshot
   * snapshot 是firestore提供的 api，透過snapshot可以'即時'獲取到該文件的資料變化，例如新增、修改、刪除等。
   * @param DocRef 欲操作的文件(document) 的 Reference
   */
  getSnapshot(DocRef: DocumentReference<unknown>): Promise<DocumentSnapshot<unknown>> {
    return DocRef.get() as Promise<DocumentSnapshot<unknown>>;
  }
}

import { Coding, IndexObject, Attachment } from '@his-base/datatypes';
/** 文件名稱：MedRecord (Medical Record)
 ** 文件說明：就醫紀錄檔
 ** 編訂人員：吳祥銘
 ** 校閱人員：孫培然
 ** 設計日期：2023.12.29
 */
export class MedRecordwithAttachment extends IndexObject {
  /** 就醫編號
   * @default new IdGenerator().randomUUID()
   */
  _id!: string;
  /** 分院
   * @default new Coding()
   */
  branch!: Coding;
  /** 病歷號碼
   * @default ''
   */
  chartNo!: string;
  /** 身分證號
   * @default ''
   */
  idNo!: string;
  /** 病人姓名
   * @default ''
   */
  name!: string;
  /** 病人性別
   * @default new Coding();
   */
  gender!: Coding;
  /** 出生日期
   * @default new Date('2999-12-31')
   */
  birthDate!: Date;
  /** 健保身份
   * @default new Coding()
   */
  nhiType!: Coding;
  /** 一般身份
   * @default new Coding()
   */
  genType!: Coding;
  /** 就醫日期
   * @default new Date()
   */
  visitDate!: Date;
  /** 看診時段
   * @default new Coding()
   * - 0: 全天 (代表住院)
   * - 1: 上午
   * - 2: 下午
   * - 3: 晚上
   */
  timeSlot!: Coding;
  /** 就醫序號
   * @default ''
   */
  visitSeqNo!: string;
  /** 就醫來源
   * @default new Coding()
   * - 01 : 門診
   * - 02 : 急診
   * - 05 : 轉診
   * - 06 : 轉檢
   * - 07 : 新生兒
   * - 09 : 119
   * - 11 : 櫃檯預約
   * - 12 : 櫃檯掛號
   * - 13 : 診間預約
   * - 14 : 診間掛號
   * - 21 : 語音預約
   * - 22 : 電話預約
   * - 26 : 網路掛號
   * - 27 : APP掛號
   * - 99 : 強制掛號
   */
  visitSource!: Coding;
  /** 是否初診
   * @default new false
   */
  isFirstVisit!: boolean;
  /** 就醫來源
   * - O: 門診
   * - E: 急診
   * - A: 住院
   */
  visitType!: Coding;
  /** 檢傷分類
   * @default undefined
   * - 1 : 復甦急救(可能等候時間 立即處理)
   * - 2 : 危急(可能等候時間 10分鐘)
   * - 3 : 緊急(可能等候時間 30分鐘)
   * - 4 : 次緊急(可能等候時間 60分鐘)
   * - 5 : 非緊急(可能等候時間 120分鐘)
   */
  triage?: Coding;
  /** 醫師
   * @default new Coding()
   */
  doctor!: Coding;
  /** 科別
   * @default new Coding()
   */
  division!: Coding;
  /** 診間/病房號
   * @default ''
   */
  room!: string;
  /** 看診號碼/病床號
   * @default ''
   */
  seqNo!: string;
  /** 是否視訊看診
   * @default false;
   */
  isOnline!: boolean;

  /** 圖檔附件(視訊截圖)
   * @default new Attachment()
   */
  attachment!: Attachment[];
  /** 診間報到時間/到護理站時間/檢傷分類時間
 * @default new Date('2999-12-31 23:59');
 */
  checkInTime!: Date;
  /** 離開診間時間/離開護理站時間/離開急診時間
   * @default new Date('2999-12-31 23:59');
   */
  checkOutTime!: Date;
  /** 案件分類
   * @default new Coding()
   * - {@link https://nhird.nhri.edu.tw/UNACD/images/si_en_describe_10009.pdf link：國家衛生研究院}
   */
  caseType!: Coding;
  /** 給付類別
   * @default new Coding()
   * - {@link https://nhird.nhri.edu.tw/UNACD/images/si_en_describe_10009.pdf link：國家衛生研究院}
   */
  payType!: Coding;
  /** 部分負擔代碼
   * @default new Coding()
   * - {@link https://nhird.nhri.edu.tw/UNACD/images/si_en_describe_10009.pdf link：國家衛生研究院}
   */
  partType!: Coding;
  /** 應收掛號費
   * @default 0
   */
  payableAmount!: number;
  /** 實收掛號費
   * @default 0
   */
  paidAmount!: number;
  /** 是否敏感性病歷
   * @default false
   */
  isSensitive!: boolean;
  /** 就診適用的重大傷病
   * @default new Coding()
   * - {@link https://twcore.mohw.gov.tw/ts/codesystemRead.jsp?id=icd-10-cm-2021-tw&status=active&version=2022-07-29&metaId=1&codeStatus=use&show=Y link：全國專門術語服務平臺}
   */
  severity!: Coding;
  /** 重大傷病
   * @default []
   * - {@link https://twcore.mohw.gov.tw/ts/codesystemRead.jsp?id=icd-10-cm-2021-tw&status=active&version=2022-07-29&metaId=1&codeStatus=use&show=Y link：全國專門術語服務平臺}
   */
  severityHistory!: Coding[];
  /** 目前就醫狀態
   * @default new Coding()
   * ----------------------------------------
   * 在院狀態
   * ----------------------------------------
   * - 00 : 取消看診
   * - 10 : 未看診
   * - 11 : 已報到
   * - 20 : 看診中
   * - 23 : 留觀中
   * - 25 : 住院中
   * - 30 : 治療中
   * - 33 : 檢查中
   * - 35 : 手術中
   * ----------------------------------------
   * 出院狀態
   * ----------------------------------------
   * - 51 : 一般出院
   * - 52 : 繼續住院
   * - 53 : 改門診治療
   * - 54 : 死亡
   * - 55 : 自動出院
   * - 56 : 轉院
   * - 57 : 身份變更
   * - 58 : 潛逃
   * - 59 : 自殺
   * - 60 : 病危出院
   * - 99 : 其他
   */
  visitStatus!: Coding;
  /** 出院時間
   * @default new Date('2999-12-31');
   */
  dischargeDate!: Date;
  /** 收費狀態
   * @default new Coding()
   * - 00 : 預設
   * - 10 : 關帳
   * - 20 : 重開帳
   * - 70 : 已結帳
   */
  chargeStatus!: Coding;
  /** 收費狀態
   * @default ''
   * - 空白: 未收費
   * - 有值: 已收費
   */
  medCharge_id!: string;
  /** 發藥號 (領藥號)
   * @default undefined
   */
  dispenseNo?: string;
  /** 備註
   * @default ''
   */
  remark!: string;
  /** 異動人員
   * @default new Coding()
   */
  updatedBy!: Coding;
  /** 異動時間
   * @default new Date()
   */
  updatedAt!: Date;
  /** 建構式
   ** @param that MedRecord
   */
  // constructor(that?: Partial<MedRecordwithAttachment>);
}



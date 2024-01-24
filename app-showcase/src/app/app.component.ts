/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ScreenshotService, FireVideoComponent } from '../../../fire-video/src/public-api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { JetStreamWsService } from '@his-base/jetstream-ws';
import { HttpClient } from '@angular/common/http';
import { MedRecordwithAttachment } from './MedRecordwithAttachment';
import { Observable } from 'rxjs';
import { Attachment } from '@his-base/datatypes/dist/';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, FireVideoComponent, TranslateModule],
})
export class AppComponent implements OnInit {
  title = 'app-showcase';
  #jetStreamWsService = inject(JetStreamWsService);
  // 連線網址
  #url = 'ws://10.0.1.191:443';
  #user = 'hpcjs';
  #password = 'rzfo-JA5';

  // ramdom 產生一個房間號碼(測試用)
  idNo = Math.random().toString(36).substring(7);

  // idNo = 'm123035253'
  #translate: TranslateService = inject(TranslateService);
  constructor(private http: HttpClient) {
    // this.#translate.setDefaultLang('zh-Hant');
    // this.#translate.setDefaultLang('zh-Hans');
    this.#translate.setDefaultLang('en-Us');
  }

  screenshotService = inject(ScreenshotService);

  screenshotUrl!: Observable<string[] | any>;
  async ngOnInit() {
    await this.#jetStreamWsService.connect(this.#url, this.#user, this.#password);
    // 醫囑系統抓取 patientInfo 並將 Attachment(一種viewModel) 附到 MedRecord(一種viewModel)中
    await this.addAttachmentToPatientInfo();


    // 在任何操作前，
    // 訂閱 fire-video 中的 screenshotService 的 imageURIsSubject (是一個BehaviorSubject，這個subject存放著截圖上傳到 CDN 的url),
    (await this.screenshotService.getScreenshotUrl()).subscribe({
      next: async (imageURIs: string[]) => {

        // 取得最新截圖檔案的url
        const latestImageURL = imageURIs[imageURIs.length - 1];

        // 將此 latestImageURL 更新到 目前病人的 MedRecord
        await this.updateMedRecord(latestImageURL);
        console.log('最新的 image URI:', latestImageURL);
      },

      error: (error) => {
        console.error('發生錯誤:', error);
      },

      complete: () => {
        console.log('訂閱完成！！！');
      }
    });


  }

  medRecordwithAttachment = new MedRecordwithAttachment();

  /** 抓取 指定的MedRecord 並將 Attachment(一種viewModel)欄位 附到此MedRecord中。
   * 透過 Object.assign() 將 Attachment(一種viewModel) 附到 MedRecord(一種viewModel) ，
   * 產生一個有 Attachment欄位 的 MedRecord  名叫MedRecordwithAttachment(一種viewModel）。
   */
  async addAttachmentToPatientInfo(): Promise<any> {
    // 需帶入指定的主題跟要傳遞的資料
    const result = await this.#jetStreamWsService.request('patientInfo.visit.findOne', { chartNo: '0000071' }) as MedRecordwithAttachment;
    this.medRecordwithAttachment = Object.assign(result, this.medRecordwithAttachment);
  }


  // 發布訊息，需自行定義payload類型
  // payload為要傳到nats上的資料
  async pubScreenshotURL(medRecordwithAttachment: MedRecordwithAttachment) {
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish('patientInfo.register.modify', medRecordwithAttachment);
  }


  /** 將最新的截圖圖檔網址寫入 Attachment 中，並將此新的 Attachment push到此 medRecordwithAttachment 的 attachment(是一個陣列)欄位中
   * 最後，透過 pub 到 'patientInfo.register.modify' 這個 nats 的 subject 中，以利將此 medRecordwithAttachment 更新到資料庫
   * @param imgURL
   */
  async updateMedRecord(imgURL: string) {
    const newAttachment = new Attachment({ url: imgURL });

    this.medRecordwithAttachment.attachment.push(newAttachment);

    await this.pubScreenshotURL(this.medRecordwithAttachment);
  }
}

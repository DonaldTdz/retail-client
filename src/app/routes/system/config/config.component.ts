import { Component, OnInit, Injector } from '@angular/core';
import { SystemInitService } from 'app/services/system';
import { AppComponentBase } from '@shared/component-base';
import { PullService } from 'app/services/syn';

@Component({
  selector: 'system-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less'],
  providers: [ PullService, SystemInitService]
})
export class SystemConfigComponent extends AppComponentBase implements OnInit {

  initText = '开始系统初始化';
  loading = false;
  percent = 0;
  status = 'active';
  constructor(injector: Injector,
    private systemInitService: SystemInitService
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  systyemInit() {
    this.initText = '请勿关闭系统，数据初始化中...';
    this.loading = true;
    this.percent = 10;
    this.systemInitService.initDatabase().finally(() => {
      this.initText = '开始系统初始化';
      this.loading = false;
    }).then((res) => {
      if (res.code == 0) {
        this.percent = 100;
        this.status = 'success';
        this.message.success('系统初始化成功');
      } else {
        this.status = 'exception';
        this.message.error('系统初始化失败');
      }
    }).catch(() => {
      this.status = 'exception';
      this.message.error('系统初始化失败');
    });
  }

  ShopInit() {
    this.systemInitService.initShop('112233').then((res) => {
      console.log(res);
    }).catch((res) => {
      console.log(res);
    });
  }

}

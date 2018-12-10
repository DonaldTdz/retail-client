import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RetailNoticeItem, RetailNoticeIconSelect } from './notice-icon.types';

@Component({
  selector: 'retail-notice-icon-tab',
  template: `
  <div *ngIf="data.list?.length === 0; else listTpl" class="notice-icon__notfound">
    <img class="notice-icon__notfound-img" *ngIf="data.emptyImage" src="{{data.emptyImage}}" alt="not found" />
    <p>{{data.emptyText || locale.emptyText}}</p>
  </div>
  <ng-template #listTpl>
    <nz-list [nzDataSource]="data.list" [nzRenderItem]="item">
      <ng-template #item let-item>
        <nz-list-item (click)="onClick(item)" [ngClass]="{'notice-icon__item-read': item.read}">
          <nz-list-item-meta
            [nzTitle]="nzTitle"
            [nzDescription]="nzDescription"
            [nzAvatar]="item.avatar">
            <ng-template #nzTitle>
              {{item.title}}
              <div class="notice-icon__item-extra" *ngIf="item.extra"><nz-tag [nzColor]="item.color">{{item.extra}}</nz-tag></div>
            </ng-template>
            <ng-template #nzDescription>
              <div *ngIf="item.description" class="notice-icon__item-desc">{{item.description}}</div>
              <div *ngIf="item.datetime" class="notice-icon__item-time">{{item.datetime}}</div>
            </ng-template>
          </nz-list-item-meta>
        </nz-list-item>
      </ng-template>
    </nz-list>
    <div class="notice-icon__clear" (click)="onClear()">{{ data.clearText || locale.clearText }}</div>
  </ng-template>
  `,
  preserveWhitespaces: false,
})
export class RetailNoticeIconTabComponent {
  @Input()
  locale: any = {};
  @Input()
  data: RetailNoticeItem;
  @Output()
  readonly select = new EventEmitter<RetailNoticeIconSelect>();
  @Output()
  readonly clear = new EventEmitter<string>();

  onClick(item: RetailNoticeItem) {
    this.select.emit(<RetailNoticeIconSelect>{
      title: this.data.title,
      item,
    });
  }

  onClear() {
    this.clear.emit(this.data.title);
  }
}

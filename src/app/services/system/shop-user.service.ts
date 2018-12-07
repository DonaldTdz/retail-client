import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";

@Injectable()
export class ShopUserService {

    //private _nodeComService: NodeCommonService;
    //private _sqlite3Service: Sqlite3Service;
    tableName = 'shopUsers';

    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) {
        //this._nodeComService = nodeComService;
        //this._sqlite3Service = sqlite3Service;
    }

    createTable() {
        this.sqlite3Service.connectDataBase().then((res) => {
            if (res.code == 0) {
                this.sqlite3Service.createShopUserTable().then((res) => {
                    if (res.code == 0) {
                        console.log('表创建成功');
                    } else {
                        console.log('表创建失败：' + res.data);
                    }
                    //this.sqlite3Service.close();
                });
            } else {
                console.log('连接失败：' + res.data);
            }
        });
    }

    save(user: ShopUser): Promise<ResultDto> {
        if (user.id) {//更新
            user.lastModificationTime = new Date();
            return this.sqlite3Service.execSql(`update ${this.tableName} set account=?, password=?, name=?, role=?, isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`,
                [user.account, user.password, user.name, user.role, user.isEnable, user.lastModificationTime, user.lastModifierUserId, user.id], 'run');
        } else {//新增
            user.creationTime = new Date();
            user.id = this.nodeComService.guidV1();
            return this.sqlite3Service.execSql(`insert into ${this.tableName} (id, account, password, name, role, isEnable, creationTime, creatorUserId) values(?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.account, user.password, user.name, user.role, user.isEnable, user.creationTime, user.creatorUserId], 'run');
        }
    }

    getAll(keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<ShopUser>> {
        let _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<PagedResultDto<ShopUser>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                //console.log(dres);
                if (dres.code == 0) {
                    _self.sqlite3Service.sql(`select count(*) cnum from ${this.tableName} where account like ? or name like ?`, [keyWord, keyWord], 'get').then((cres) => {
                        //console.log(cres);
                        let result = new PagedResultDto<ShopUser>();
                        if (cres.code == 0) {
                            //alert(JSON.stringify(cres.data))
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select * from ${this.tableName} where account like ? or name like ? limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord], 'all').then((res) => {
                                //console.log(res);
                                //_self.sqlite3Service.close();
                                if (res.code == 0) {
                                    if (res.data) {
                                        result.items = ShopUser.fromJSArray(res.data);
                                    } else {
                                        result.items = [];
                                        result.totalCount = 0;
                                    }
                                    resolve(result);
                                } else {
                                    console.log(res);
                                    reject(null);
                                }
                            });
                        } else {
                            //_self.sqlite3Service.close();
                            console.log(cres);
                            reject(null);
                        }
                    });
                } else {
                    reject(null);
                }
            });
        });
    }

}



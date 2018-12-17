import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto, ResultEntity } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class ShopUserService {

    //private _nodeComService: NodeCommonService;
    //private _sqlite3Service: Sqlite3Service;
    tableName = 'shopUsers';

    constructor(private nodeComService: NodeCommonService, 
        private sqlite3Service: Sqlite3Service, 
        private nodeHttpClient: NodeHttpClient, 
        private settingsService: SettingsService) {
        //this._nodeComService = nodeComService;
        //this._sqlite3Service = sqlite3Service;
    }

    save(user: ShopUser): Promise<ResultDto> {
        if (user.id) {//更新
            user.lastModificationTime = new Date();
            return this.sqlite3Service.execSql(`update ${this.tableName} set account=?, password=?, name=?, role=?, isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`,
                [user.account, user.password, user.name, user.role, user.isEnable, user.lastModificationTime, user.lastModifierUserId, user.id], 'run');
        } else {//新增
            user.creationTime = new Date();
            user.id = this.nodeComService.guidV1();
            user.password = this.nodeComService.md5(user.password);//加密
            return this.sqlite3Service.execSql(`insert into ${this.tableName} (id, account, password, name, role, isEnable, creationTime, creatorUserId) values(?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.account, user.password, user.name, user.role, user.isEnable, user.creationTime, user.creatorUserId], 'run');
        }
    }

    get(id: string): Promise<ShopUser> {
        return new Promise<ShopUser>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName} where id=?`, [id], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(ShopUser.fromJS(res.data));
                    } else {
                        reject(null);
                    };
                } else {
                    reject(null);
                }
            });
        });
    }

    getAll(keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<ShopUser>> {
        const _self = this;
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
                        const result = new PagedResultDto<ShopUser>();
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

    login(account: string, pwd: string): Promise<ResultEntity<ShopUser>> {
        const md5pwd = this.nodeComService.md5(pwd);
        return new Promise<ResultEntity<ShopUser>>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName} where account=? and password=? and isEnable=1`, [account, md5pwd], 'get').then((res) => {
                const result = new ResultEntity<ShopUser>();
                if (res.code == 0) {
                    if (res.data) {
                        result.code = 0;
                        result.msg = '登录成功';
                        result.data = ShopUser.fromJS(res.data);
                    } else {
                        result.code = 99;
                        result.msg = '登录名或密码错误';
                    }
                } else {
                    result.code = -1;
                    result.msg = '登录异常，请联系管理员';
                }
                resolve(result);
            });
        });
    }

    delete(id: string): Promise<ResultDto> {
        return this.sqlite3Service.execSql(`delete from ${this.tableName} where id=?`, [id], 'run');
    }

    updateStatus(id: string, isEnable: boolean, userId: string): Promise<ResultDto> {
        const lasttime = new Date();
        return this.sqlite3Service.execSql(`update ${this.tableName} set isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`, [isEnable, lasttime, userId, id], 'run');
    }

    updatePwd(id: string, newPwd: string): Promise<ResultDto> {
        newPwd = this.nodeComService.md5(newPwd);
        return this.sqlite3Service.execSql(`update ${this.tableName} set password =? where id=?`, [newPwd, id], 'run');
    }

    getAccessToken(): Promise<ResultDto> {
        return this.nodeHttpClient.authenticate();
    }
}


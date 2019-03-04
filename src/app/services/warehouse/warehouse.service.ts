import { Injectable } from '@angular/core';
import { PutForm, PagedResultDto, WarehouseWater, Order, OrderDetail } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class warehouseWaterService {
    tableName = 'warehouseWater';

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
    }

    getAll(keyWord: string, dataRange: any = { startTime: null, endTime: null }, skipCount: number, maxResultCount: number): Promise<PagedResultDto<WarehouseWater>> {
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        if (dataRange.startTime == 'NaN' || dataRange.endTime == 'NaN') {
            dataRange.startTime = null;
            dataRange.endTime = null;
        }
        if (dataRange.startTime != null && dataRange.endTime != null) {
            return new Promise<PagedResultDto<WarehouseWater>>((resolve, reject) => {
                _self.sqlite3Service.connectDataBase().then((dres) => {
                    if (dres.code == 0) {
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} w inner join retailProduct r on w.productId = r.id where (r.name like ? or r.barCode like ?) and ( w.creationTime >= ? and w.creationTime <= ?)`, [keyWord, keyWord, dataRange.startTime, dataRange.endTime], 'get').then((cres) => {
                            const result = new PagedResultDto<WarehouseWater>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select w.* , r.name productName from ${this.tableName} w inner join retailProduct r on w.productId = r.id  where (r.name like ? or r.barCode like ?) and ( w.creationTime >= ? and w.creationTime <= ?) order by w.creationTime desc,r.name limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord, dataRange.startTime, dataRange.endTime], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = WarehouseWater.fromJSArray(res.data);
                                        } else {
                                            result.items = [];
                                            result.totalCount = 0;
                                        }
                                        resolve(result);
                                    } else {
                                        console.error(res);
                                        reject(null);
                                    }
                                });
                            } else {
                                console.error(cres);
                                reject(null);
                            }
                        });
                    } else {
                        reject(null);
                    }
                });
            });
        } else {
            return new Promise<PagedResultDto<WarehouseWater>>((resolve, reject) => {
                _self.sqlite3Service.connectDataBase().then((dres) => {
                    if (dres.code == 0) {
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} w inner join retailProduct r on w.productId = r.id where r.name like ? or r.barCode like ?`, [keyWord, keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<WarehouseWater>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select w.* , r.name productName from ${this.tableName} w inner join retailProduct r on w.productId = r.id  where r.name like ? or r.barCode like ? order by w.creationTime desc,r.name limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = WarehouseWater.fromJSArray(res.data);
                                        } else {
                                            result.items = [];
                                            result.totalCount = 0;
                                        }
                                        resolve(result);
                                    } else {
                                        console.error(res);
                                        reject(null);
                                    }
                                });
                            } else {
                                console.error(cres);
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

    getSaleWater(keyWord: string, dataRange: any = { startTime: null, endTime: null }, skipCount: number, maxResultCount: number): Promise<PagedResultDto<Order>> {
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        if (dataRange.startTime == 'NaN' || dataRange.endTime == 'NaN') {
            dataRange.startTime = null;
            dataRange.endTime = null;
        }
        if (dataRange.startTime != null && dataRange.endTime != null) {
            return new Promise<PagedResultDto<Order>>((resolve, reject) => {
                _self.sqlite3Service.connectDataBase().then((dres) => {
                    if (dres.code == 0) {
                        _self.sqlite3Service.sql(`select count(1) cnum from orders where (number like ? ) and (creationTime >= ? and creationTime <= ?)`, [keyWord, dataRange.startTime, dataRange.endTime], 'get').then((cres) => {
                            const result = new PagedResultDto<Order>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select * from orders where (number like ? ) and (creationTime >= ? and creationTime <= ?) order by creationTime desc limit ${maxResultCount} offset ${skipCount}`, [keyWord, dataRange.startTime, dataRange.endTime], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = Order.fromJSArray(res.data);
                                        } else {
                                            result.items = [];
                                            result.totalCount = 0;
                                        }
                                        resolve(result);
                                    } else {
                                        console.error(res);
                                        reject(null);
                                    }
                                });
                            } else {
                                console.error(cres);
                                reject(null);
                            }
                        });
                    } else {
                        reject(null);
                    }
                });
            });
        } else {
            return new Promise<PagedResultDto<Order>>((resolve, reject) => {
                _self.sqlite3Service.connectDataBase().then((dres) => {
                    if (dres.code == 0) {
                        _self.sqlite3Service.sql(`select count(1) cnum from orders w where w.number like ?  `, [keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<Order>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select w.* from orders w where w.number like ? order by w.creationTime desc limit ${maxResultCount} offset ${skipCount}`, [keyWord], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = Order.fromJSArray(res.data);
                                        } else {
                                            result.items = [];
                                            result.totalCount = 0;
                                        }
                                        resolve(result);
                                    } else {
                                        console.error(res);
                                        reject(null);
                                    }
                                });
                            } else {
                                console.error(cres);
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

    getOrderInfo(id: string): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            this.sqlite3Service.execSql(`select o.*,u.name userName from orders o inner join shopUsers u on o.submitUserId = u.id where o.id=?`, [id], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(Order.fromJS(res.data));
                    } else {
                        reject(null);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    getOrderInfoByNo(number: string): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            this.sqlite3Service.execSql(`select o.* ,u.name userName from orders o inner join shopUsers u on o.submitUserId = u.id where o.number =?`, [number], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(Order.fromJS(res.data));
                    } else {
                        resolve(null);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    getSaleDetail(keyWord: string): Promise<PagedResultDto<OrderDetail>> {
        const _self = this;
        return new Promise<PagedResultDto<OrderDetail>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    _self.sqlite3Service.sql(`select count(1) cnum from orderDetail o inner join retailProduct p on o.productId = p.id where o.orderId = ?`, [keyWord], 'get').then((cres) => {
                        const result = new PagedResultDto<OrderDetail>();
                        if (cres.code == 0) {
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select o.*,p.name productName from orderDetail o inner join retailProduct p on o.productId = p.id where o.orderId = ? order by o.creationTime desc`, [keyWord], 'all').then((res) => {
                                if (res.code == 0) {
                                    if (res.data) {
                                        result.items = OrderDetail.fromJSArray(res.data);
                                    } else {
                                        result.items = [];
                                        result.totalCount = 0;
                                    }
                                    resolve(result);
                                } else {
                                    console.error(res);
                                    reject(null);
                                }
                            });
                        } else {
                            console.error(cres);
                            reject(null);
                        }
                    });
                } else {
                    reject(null);
                }
            });
        });
    }

    getSaleDetailByNo(keyWord: string): Promise<PagedResultDto<OrderDetail>> {
        const _self = this;
        return new Promise<PagedResultDto<OrderDetail>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    _self.sqlite3Service.sql(`select count(1) cnum from orderDetail o inner join retailProduct p on o.productId = p.id where o.orderId = ?`, [keyWord], 'get').then((cres) => {
                        const result = new PagedResultDto<OrderDetail>();
                        if (cres.code == 0) {
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select o.*,p.name productName from orderDetail o inner join retailProduct p on o.productId = p.id where o.orderId = ? order by o.creationTime desc`, [keyWord], 'all').then((res) => {
                                if (res.code == 0) {
                                    if (res.data) {
                                        result.items = OrderDetail.fromJSArray(res.data);
                                    } else {
                                        result.items = [];
                                        result.totalCount = 0;
                                    }
                                    resolve(result);
                                } else {
                                    console.error(res);
                                    reject(null);
                                }
                            });
                        } else {
                            console.error(cres);
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

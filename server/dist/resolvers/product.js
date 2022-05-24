"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var DBController_1 = require("../DBController");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../firebase");
var setJSON = function (data) { return (0, DBController_1.writeDB)(DBController_1.DBField.PRODUCTS, data); };
var PAGE_SIZE = 15;
var productResolver = {
    Query: {
        /**
         * 상품 리스트를 가져온다
         * @param cursor 마지막 상품의 ID
         * @param showDeleted 고객용인지 Admin용인지 구분하는 값
         * @returns
         */
        products: function (parent, _a) {
            var _b = _a.cursor, cursor = _b === void 0 ? '' : _b, _c = _a.showDeleted, showDeleted = _c === void 0 ? false : _c;
            return __awaiter(void 0, void 0, void 0, function () {
                var products, queryOptions, snapshot_1, snapshot, data;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            products = (0, firestore_1.collection)(firebase_1.db, 'products');
                            queryOptions = [(0, firestore_1.orderBy)('createdAt', 'desc')];
                            if (!cursor) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'products', cursor))];
                        case 1:
                            snapshot_1 = _d.sent();
                            queryOptions.push((0, firestore_1.startAfter)(snapshot_1));
                            _d.label = 2;
                        case 2:
                            //? createdAt이 있는 상품만 고객용 상품 목록에서 볼 수 있다.
                            if (!showDeleted)
                                queryOptions.unshift((0, firestore_1.where)('createdAt', '!=', null));
                            return [4 /*yield*/, (0, firestore_1.getDocs)(firestore_1.query.apply(void 0, __spreadArray(__spreadArray([products], queryOptions, false), [(0, firestore_1.limit)(PAGE_SIZE)], false)))];
                        case 3:
                            snapshot = _d.sent();
                            data = [];
                            snapshot.forEach(function (doc) {
                                return data.push(__assign({ id: doc.id }, doc.data()));
                            });
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        /**
         * 상품 정보를 가져온다.
         * @param id 상품 ID
         * @returns
         */
        product: function (parent, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var snapshot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'products', id))];
                        case 1:
                            snapshot = _b.sent();
                            return [2 /*return*/, __assign({ id: snapshot.id }, snapshot.data())];
                    }
                });
            });
        },
    },
    Mutation: {
        /**
         * 상품 추가
         * @param parent
         * @param param1
         * @returns
         */
        addProduct: function (parent, _a) {
            var imageUrl = _a.imageUrl, price = _a.price, title = _a.title, description = _a.description;
            return __awaiter(void 0, void 0, void 0, function () {
                var newProduct, result, snapshot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newProduct = {
                                imageUrl: imageUrl,
                                price: price,
                                title: title,
                                description: description,
                                createdAt: (0, firestore_1.serverTimestamp)(),
                            };
                            return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'products'), newProduct)];
                        case 1:
                            result = _b.sent();
                            return [4 /*yield*/, (0, firestore_1.getDoc)(result)];
                        case 2:
                            snapshot = _b.sent();
                            return [2 /*return*/, __assign({ id: snapshot.id }, snapshot.data())];
                    }
                });
            });
        },
        /**
         * 상품 업데이트
         * @param id 수정할 상품의 아이디
         * @param param1
         * @returns
         */
        updateProduct: function (parent, _a) { return __awaiter(void 0, void 0, void 0, function () {
            var productRef, snapshot;
            var id = _a.id, data = __rest(_a, ["id"]);
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        productRef = (0, firestore_1.doc)(firebase_1.db, 'products', id);
                        if (!productRef)
                            throw new Error('해당 상품이 존재하지 않습니다.');
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(productRef, __assign(__assign({}, data), { createdAt: (0, firestore_1.serverTimestamp)() }))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, firestore_1.getDoc)(productRef)];
                    case 2:
                        snapshot = _b.sent();
                        return [2 /*return*/, __assign({ id: snapshot.id }, snapshot.data())];
                }
            });
        }); },
        /**
         * 상품 삭제
         * ? 물리적 삭제가 아닌 논리적 삭제로 구현
         * ? createdAt을 삭제하면 판매하지 않는 상품임.
         * @param id 삭제할 상품의 id
         * @returns
         */
        deleteProduct: function (parent, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var productRef;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            productRef = (0, firestore_1.doc)(firebase_1.db, 'products', id);
                            if (!productRef)
                                throw new Error('해당 상품이 존재하지 않습니다.');
                            return [4 /*yield*/, (0, firestore_1.updateDoc)(productRef, {
                                    createdAt: null,
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, id];
                    }
                });
            });
        },
    },
};
exports.default = productResolver;

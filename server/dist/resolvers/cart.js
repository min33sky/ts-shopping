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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("firebase/firestore");
var DBController_1 = require("./../DBController");
var firebase_1 = require("../firebase");
/**
 * JSON 파일에 저장하기
 * @param data
 * @returns
 */
var setJSON = function (data) { return (0, DBController_1.writeDB)(DBController_1.DBField.CART, data); };
var cartResolver = {
    Query: {
        cart: function (parent, args, context, info) { return __awaiter(void 0, void 0, void 0, function () {
            var cart, cartSnap, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cart = (0, firestore_1.collection)(firebase_1.db, 'cart');
                        return [4 /*yield*/, (0, firestore_1.getDocs)(cart)];
                    case 1:
                        cartSnap = _a.sent();
                        data = [];
                        cartSnap.forEach(function (doc) {
                            data.push(__assign({ id: doc.id }, doc.data()));
                        });
                        return [2 /*return*/, data];
                }
            });
        }); },
    },
    Mutation: {
        /**
         * 카트에 상품 추가
         * @param parent
         * @param productId 구매할 상품의 ID
         * @returns
         */
        addCart: function (parent, _a) {
            var productId = _a.productId;
            return __awaiter(void 0, void 0, void 0, function () {
                var productRef, cartCollection, exist, cartRef, cartSnapshot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!productId)
                                throw new Error('상품 ID가 필요합니다.');
                            productRef = (0, firestore_1.doc)(firebase_1.db, 'products', productId);
                            cartCollection = (0, firestore_1.collection)(firebase_1.db, 'cart');
                            return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)(cartCollection, (0, firestore_1.where)('product', '==', productRef)))];
                        case 1: return [4 /*yield*/, (_b.sent()).docs[0]];
                        case 2:
                            exist = _b.sent();
                            if (!exist) return [3 /*break*/, 4];
                            // 기존 카트에 수량을 1씩 증가시킴
                            cartRef = (0, firestore_1.doc)(firebase_1.db, 'cart', exist.id);
                            return [4 /*yield*/, (0, firestore_1.updateDoc)(cartRef, {
                                    amount: (0, firestore_1.increment)(1),
                                })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, (0, firestore_1.addDoc)(cartCollection, {
                                amount: 1,
                                product: productRef,
                            })];
                        case 5:
                            // 카트에 상품을 추가함
                            cartRef = _b.sent();
                            _b.label = 6;
                        case 6: return [4 /*yield*/, (0, firestore_1.getDoc)(cartRef)];
                        case 7:
                            cartSnapshot = _b.sent();
                            return [2 /*return*/, __assign({ id: cartSnapshot.id, product: productRef }, cartSnapshot.data())];
                    }
                });
            });
        },
        /**
         * 장바구니의 상품 업데이트
         * @param parent
         * @param cartId 장바구니 ID
         * @param amount 변경할 상품의 수량
         * @returns
         */
        updateCart: function (parent, _a) {
            var cartId = _a.cartId, amount = _a.amount;
            return __awaiter(void 0, void 0, void 0, function () {
                var cartRef, cartSnapshot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (amount < 1)
                                throw new Error('상품 수량은 1 이하로 바꿀 수 없습니다.');
                            cartRef = (0, firestore_1.doc)(firebase_1.db, 'cart', cartId);
                            if (!cartRef)
                                throw new Error('장바구니에 해당 상품이 존재하지 않습니다.');
                            return [4 /*yield*/, (0, firestore_1.updateDoc)(cartRef, {
                                    amount: amount,
                                })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, firestore_1.getDoc)(cartRef)];
                        case 2:
                            cartSnapshot = _b.sent();
                            return [2 /*return*/, __assign(__assign({}, cartSnapshot.data()), { id: cartSnapshot.id })];
                    }
                });
            });
        },
        /**
         * 장바구니에서 상품 제거
         * @param parent
         * @param cartId 삭제할 장바구니 ID
         * @returns
         */
        deleteCart: function (parent, _a) {
            var cartId = _a.cartId;
            return __awaiter(void 0, void 0, void 0, function () {
                var cartRef;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cartRef = (0, firestore_1.doc)(firebase_1.db, 'cart', cartId);
                            if (!cartRef)
                                throw new Error('삭제할 상품이 없습니다.');
                            return [4 /*yield*/, (0, firestore_1.deleteDoc)(cartRef)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, cartId];
                    }
                });
            });
        },
        /**
         * 결제하기
         * @param parent
         * @param ids 구매할 상품이 담긴 장바구니 아이디 배열
         * @returns
         */
        executePay: function (parent, _a) {
            var ids_1, ids_1_1;
            var ids = _a.ids;
            return __awaiter(void 0, void 0, void 0, function () {
                var deleted, id, cartRef, cartSnapshot, cartData, productRef, product, e_1_1;
                var e_1, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            deleted = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 9, 10, 15]);
                            ids_1 = __asyncValues(ids);
                            _c.label = 2;
                        case 2: return [4 /*yield*/, ids_1.next()];
                        case 3:
                            if (!(ids_1_1 = _c.sent(), !ids_1_1.done)) return [3 /*break*/, 8];
                            id = ids_1_1.value;
                            cartRef = (0, firestore_1.doc)(firebase_1.db, 'cart', id);
                            return [4 /*yield*/, (0, firestore_1.getDoc)(cartRef)];
                        case 4:
                            cartSnapshot = _c.sent();
                            cartData = cartSnapshot.data();
                            productRef = cartData === null || cartData === void 0 ? void 0 : cartData.product;
                            if (!productRef)
                                throw new Error('상품 정보가 없다.');
                            return [4 /*yield*/, (0, firestore_1.getDoc)(productRef)];
                        case 5:
                            product = (_c.sent()).data();
                            if (!product.createdAt)
                                throw new Error('풀절인 상품이 포함되어 있습니다.');
                            //? 장바구니에서 제거하고 구매한 상품을 배열에 담아 리턴
                            return [4 /*yield*/, (0, firestore_1.deleteDoc)(cartRef)];
                        case 6:
                            //? 장바구니에서 제거하고 구매한 상품을 배열에 담아 리턴
                            _c.sent();
                            deleted.push(id);
                            _c.label = 7;
                        case 7: return [3 /*break*/, 2];
                        case 8: return [3 /*break*/, 15];
                        case 9:
                            e_1_1 = _c.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 15];
                        case 10:
                            _c.trys.push([10, , 13, 14]);
                            if (!(ids_1_1 && !ids_1_1.done && (_b = ids_1.return))) return [3 /*break*/, 12];
                            return [4 /*yield*/, _b.call(ids_1)];
                        case 11:
                            _c.sent();
                            _c.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 14: return [7 /*endfinally*/];
                        case 15: return [2 /*return*/, deleted];
                    }
                });
            });
        },
    },
    //? Type Resolver
    //? CartItem을 return할 때 각 CartItem마다 product에서 찾아서 가져온다
    CartItem: {
        product: function (cartItem, args) { return __awaiter(void 0, void 0, void 0, function () {
            var product, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, firestore_1.getDoc)(cartItem.product)];
                    case 1:
                        product = _a.sent();
                        data = product.data();
                        return [2 /*return*/, __assign(__assign({}, data), { id: product.id })];
                }
            });
        }); },
    },
};
exports.default = cartResolver;

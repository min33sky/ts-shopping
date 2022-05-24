"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDB = exports.readDB = exports.DBField = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var DBField;
(function (DBField) {
    DBField["CART"] = "cart";
    DBField["PRODUCTS"] = "products";
})(DBField = exports.DBField || (exports.DBField = {}));
//! ES6에서는 __dirname을 사용할 수 없다. path.resolve()로 대체
var basePath = path_1.default.resolve();
var filenames = (_a = {},
    _a[DBField.CART] = path_1.default.resolve(basePath, 'src/db/cart.json'),
    _a[DBField.PRODUCTS] = path_1.default.resolve(basePath, 'src/db/product.json'),
    _a);
var readDB = function (target) {
    try {
        return JSON.parse(fs_1.default.readFileSync(filenames[target], 'utf-8'));
    }
    catch (error) {
        console.error(error);
    }
};
exports.readDB = readDB;
var writeDB = function (target, data) {
    try {
        fs_1.default.writeFileSync(filenames[target], JSON.stringify(data, null, '  '));
    }
    catch (error) {
        console.error(error);
    }
};
exports.writeDB = writeDB;

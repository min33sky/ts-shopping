"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cart_1 = __importDefault(require("./cart"));
var product_1 = __importDefault(require("./product"));
exports.default = [product_1.default, cart_1.default];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBController_1 = require("./../DBController");
var uuid_1 = require("uuid");
try {
    var db = Array.from({ length: 100 }).map(function (_, idx) { return ({
        id: (0, uuid_1.v4)(),
        title: "\uC784\uC2DC\uC0C1\uD488 ".concat(idx),
        description: "\uC784\uC2DC\uC0C1\uC138\uB0B4\uC6A9 ".concat(idx),
        imageUrl: "https://picsum.photos/id/".concat(Math.floor(Math.random() * idx * 3), "/200/200"),
        price: Math.floor(Math.random() * 90001) + 1000,
        createdAt: new Date().setMonth(0) + 1000 * 60 * 60 * 5 * idx,
    }); });
    (0, DBController_1.writeDB)(DBController_1.DBField.PRODUCTS, db);
    console.log('DB Initialized');
}
catch (error) {
    console.log('DB ERROR :<');
}

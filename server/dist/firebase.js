"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var envLoader_1 = __importDefault(require("./envLoader"));
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: envLoader_1.default.fb_apiKey,
    authDomain: envLoader_1.default.fb_authDomain,
    projectId: envLoader_1.default.fb_projectId,
    storageBucket: envLoader_1.default.fb_storageBucket,
    messagingSenderId: envLoader_1.default.fb_messagingSenderId,
    appId: envLoader_1.default.fb_appId,
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
exports.default = app;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var opencv4nodejs_1 = __importDefault(require("opencv4nodejs"));
var news = __importStar(require("./newspaper"));
var crop = __importStar(require("./crop"));
var post = __importStar(require("./post"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var instagramCredentials, twitterCredentials, paper, boundingBoxes, randomBox, croppedImg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                instagramCredentials = {
                    username: process.env.INSTAGRAM_USERNAME,
                    password: process.env.INSTAGRAM_PASSWORD,
                };
                twitterCredentials = {
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
                };
                console.log("Running on " + new Date().toLocaleString('en-US', { timeZone: 'america/Chicago' }) + " Central Time");
                console.log('Downloading JP2');
                return [4 /*yield*/, news.downloadJP2()];
            case 1:
                paper = _a.sent();
                console.log('Finding contours');
                boundingBoxes = crop.findBoxes(paper.image);
                console.log("Bounding boxes:");
                boundingBoxes.forEach(function (box) {
                    console.log("[" + box.x + ", " + box.y + ", " + box.width + ", " + box.height + "]");
                });
                _a.label = 2;
            case 2:
                if (!(boundingBoxes.length == 0)) return [3 /*break*/, 4];
                console.log("No valid bounding boxes. Downloading new JP2");
                return [4 /*yield*/, news.downloadJP2()];
            case 3:
                paper = _a.sent();
                boundingBoxes = crop.findBoxes(paper.image);
                console.log("Bounding boxes:");
                boundingBoxes.forEach(function (box) {
                    console.log("[" + box.x + ", " + box.y + ", " + box.width + ", " + box.height + "]");
                });
                return [3 /*break*/, 2];
            case 4:
                console.log("Caption: " + paper.instagramCaption);
                randomBox = boundingBoxes[Math.floor(Math.random() * boundingBoxes.length)];
                console.log("Cropping image: [" + randomBox.x + ", " + randomBox.y + ", " + randomBox.width + ", " + randomBox.height + "]");
                croppedImg = crop.crop(paper.image, randomBox);
                console.log('Writing image');
                opencv4nodejs_1.default.imwrite('./post.jpg', croppedImg);
                console.log('Posting on Instagram');
                return [4 /*yield*/, post.postInstagram(instagramCredentials, './post.jpg', paper.instagramCaption)];
            case 5:
                if (!(_a.sent())) {
                    console.error('Error posting to Instagram. Exiting');
                    return [2 /*return*/];
                }
                console.log('Posted on Instagram');
                console.log('Posting on Twitter');
                return [4 /*yield*/, post.postTwitter(twitterCredentials, './post.jpg', paper.twitterCaption)];
            case 6:
                if (!(_a.sent())) {
                    console.error('Error posting to Twitter. Exiting');
                    return [2 /*return*/];
                }
                console.log('Posted on Twitter');
                console.log('Cleaning files');
                fs_1.default.unlinkSync('./post.jpg');
                console.log('Done!');
                return [2 /*return*/];
        }
    });
}); })();

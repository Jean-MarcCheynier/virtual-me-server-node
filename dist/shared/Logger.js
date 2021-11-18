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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-call */
const winston_1 = require("winston");
const Winston = __importStar(require("winston"));
const { combine, prettyPrint } = winston_1.format;
const customlevels = {
    levels: {
        trace: 9,
        input: 8,
        verbose: 7,
        prompt: 6,
        debug: 5,
        info: 4,
        data: 3,
        help: 2,
        warn: 1,
        error: 0
    },
    colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red'
    }
};
Winston.addColors(customlevels.colors);
const loggerFormat = combine(prettyPrint(), winston_1.format.colorize(), winston_1.format.splat(), winston_1.format.simple());
const logger = winston_1.createLogger({
    level: 'debug',
    format: loggerFormat,
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: './error.log', level: 'error' }),
        new winston_1.transports.File({ filename: './info.log', level: 'info' })
    ],
    levels: customlevels.levels,
    exitOnError: false
});
exports.default = logger;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const port = config_1.default.port || 3000;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json()); //express.json
app.use('/api', routes_1.default);
app.get('/', function (_req, res) {
    res.send('Hello World!');
});
app.use(error_middleware_1.errorMiddleware);
app.use((_req, res) => {
    res.status(404).json({
        message: 'Incorrect URL, kindly check the API docs.',
    });
});
app.listen(3000, function () {
    console.log(`app started on port: ${port}`);
});
exports.default = app;

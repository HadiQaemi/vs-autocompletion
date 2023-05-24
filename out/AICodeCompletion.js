"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AICodeCompletion = void 0;
const axios_1 = require("axios");
const Configurations = require("./configuration");
class AICodeCompletion {
    constructor(inputCode = "", codeCompletionMethod = "ADVANCED", codeCompletionLanguage = "java") {
        this.accepted_prefix = ['import'];
        this.accepted_keywords = ['http', 'new'];
        this.inputCode = inputCode;
        this.codeCompletionMethod = codeCompletionMethod;
        this.codeCompletionLanguage = codeCompletionLanguage;
    }
    checkCodeStartsKeyword(str, accepted_prefix) {
        if (accepted_prefix.length == 0) {
            accepted_prefix = this.accepted_keywords;
        }
        return accepted_prefix.some((accepted_prefix) => str.startsWith(accepted_prefix));
    }
    static validateCodeinput(input) {
        const accepted_prefix = ['import'];
        const accepted_keywords = ['http', 'new'];
        const pref_check = accepted_prefix.some((accepted_prefix) => input.startsWith(accepted_prefix));
        const keyword_check = accepted_keywords.some((accepted_keywords) => input.includes(accepted_keywords));
        if (!keyword_check && !pref_check) {
            return false;
        }
        return true;
    }
    // Gets code AI code completion model prediction
    async getSuggestions(codeInput) {
        const data = JSON.stringify({
            "code_input": codeInput,
            "method": "advanced",
            "language": "java",
            "code_sugg_len": 10,
            "code_sugg_lines": 2
        });
        const config = {
            method: 'post',
            url: Configurations.smartCLIDETargetHost + ':' + Configurations.smartCLIDETargetPort + Configurations.smartCLIDETargetPath,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        };
        return (0, axios_1.default)(config)
            .then(function (response) {
            console.log('res:::', response.data.code_suggestions);
            return response.data.code_suggestions;
        });
    }
}
exports.AICodeCompletion = AICodeCompletion;
//# sourceMappingURL=AICodeCompletion.js.map
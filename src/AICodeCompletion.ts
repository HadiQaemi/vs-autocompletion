import axios from "axios";
import * as Configurations from './configuration';

export class AICodeCompletion {
    inputCode: string;
    codeCompletionMethod: string;
    codeCompletionLanguage: string;
    accepted_prefix: string[] = ['import'];
    accepted_keywords: string[] = ['http', 'new'];

    constructor(
        inputCode = "",
        codeCompletionMethod = "ADVANCED",
        codeCompletionLanguage = "java"
    ) {
        this.inputCode = inputCode;
        this.codeCompletionMethod = codeCompletionMethod;
        this.codeCompletionLanguage = codeCompletionLanguage;
    }

    checkCodeStartsKeyword(str: string, accepted_prefix: string[]) {
        if (accepted_prefix.length == 0) {
            accepted_prefix = this.accepted_keywords;
        }
        return accepted_prefix.some((accepted_prefix) =>
            str.startsWith(accepted_prefix)
        );
    }

    static validateCodeinput(input: string) {
        const accepted_prefix: string[] = ['import'];
        const accepted_keywords: string[] = ['http', 'new'];

        const pref_check = accepted_prefix.some((accepted_prefix) =>
            input.startsWith(accepted_prefix)
        );
        const keyword_check = accepted_keywords.some((accepted_keywords) =>
            input.includes(accepted_keywords)
        );
        if (!keyword_check && !pref_check) { return false; }
        return true;
    }
    // Gets code AI code completion model prediction
    async getSuggestions(codeInput: string) {
        interface User {
            id: number;
            firstName: string;
        }

        // You can export the type TUserList to use as -
        // props type in your `UserList` component
        type TUserList = User[]
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

        return axios(config)
            .then(function (response) {
                console.log('res:::', response.data.code_suggestions);
                return response.data.code_suggestions;
            });
    }
}

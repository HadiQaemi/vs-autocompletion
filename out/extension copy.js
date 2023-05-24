"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    var suggested_codel_lines = [];
    const provider1 = vscode.languages.registerCompletionItemProvider(documentSelector, {
        provideCompletionItems(document, position, token, context) {
            const linePrefix = document
                .lineAt(position)
                .text.substr(0, position.character);
            let AICompletionOBJ = new AICodeCompletion(linePrefix);
            var res = AICodeCompletion.validateCodeinput(linePrefix);
            if (!res) {
                return [];
            }
            //check to be juststring including http:// not more chars
            if (!linePrefix.startsWith("import")) {
                if (!linePrefix.includes("http")) {
                    return [];
                }
            }
            if (!linePrefix.startsWith("import") && linePrefix.includes('http')) {
                if (linePrefix.endsWith(".")) {
                    //Search Discovered URLs from OSS repos
                    const path = require('path');
                    var file_t = path.join(__dirname, '../src/data/data.txt');
                    var fs = require('fs');
                    // var file_t = '/home/zakieh/Desktop/00_vscode___different/code_repo_ext/vscode_ext_enviroment/plugin/autocomplete-code/src/data/data.txt'
                    var items = fs.readFileSync(file_t).toString().split("\n");
                    var suggested_url = [];
                    // find all strings in array containing 'user http adress query'
                    //extract http from user query
                    var regex = /https/g;
                    var http_start = linePrefix.search(regex);
                    console.log('accurated:', linePrefix.search(regex));
                    var http_substring = linePrefix.substr(http_start, 20);
                    console.log(http_substring);
                    var i = 0;
                    for (i in items) {
                        if (items[i].includes(http_substring)) {
                            suggested_url.push(items[i]);
                        }
                    }
                    let completionItems = [];
                    var max_sugg = 10;
                    if (suggested_url.length < max_sugg) {
                        max_sugg = suggested_url.length;
                    }
                    for (let i = 0; i < max_sugg; i++) {
                        //remove user search query from URL
                        var sugg_url = suggested_url[i].replace(http_substring, "");
                        var serviceCompletion = new vscode.CompletionItem(sugg_url);
                        completionItems.push(serviceCompletion);
                    }
                    suggested_url = [];
                    return completionItems;
                }
            }
            //manage API call just when input ens with dot char
            if (linePrefix.endsWith(".")) {
                console.log(linePrefix);
                let codes = AICompletionOBJ.getSuggestions(linePrefix);
                console.log(codes);
                codes.then(function (result) {
                    console.log(result); // "Some User token"
                    suggested_codel_lines = result;
                });
                //provide suggestion items
                let completionItems = [];
                for (let i = 0; i < suggested_codel_lines.length; i++) {
                    //remove user search query from suggested code
                    var sugg_code = suggested_codel_lines[i].replace(linePrefix, "");
                    var codeCompletion = new vscode.CompletionItem(sugg_code);
                    completionItems.push(codeCompletion);
                }
                return completionItems;
            }
        },
    }, "." // triggered whenever a '.' is being typed
    );
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension%20copy.js.map
/// <reference path="../../../typings/main.d.ts" />
import index = require("../../index");
import assert = require("assert");
import ramlWrapper = require("../artifacts/raml10parser");
import jsyaml = require("../jsyaml/jsyaml2lowLevel");
import hlimpl = require("../highLevelImpl");
import util = require("./test-utils");
var fs = require("fs");

parseAllRaml("");

function parseAllRaml(dir: string, reportsFolder?: string){
    var path: string = util.data(dir).replace(/\\/g,'/');
    var dirContent: string[] = fs.readdirSync(path);
    dirContent.forEach(file=>{
        var filePath: string = path + "/" + file;

        if(fs.lstatSync(filePath).isFile()){
            if (file.lastIndexOf(".raml") != -1
                && (filePath.indexOf("/Overlays/test029/overlay.raml") != -1
                || filePath.indexOf("/https/test001/api.raml") != -1
                || filePath.indexOf("/HTTPS/api001/api.raml") != -1
                || filePath.indexOf("/jsonscheme/test11/api") != -1
                || filePath.indexOf("/jsonscheme/test2/api") != -1
                || filePath.indexOf("/jsonscheme/test6/api") != -1
                || filePath.indexOf("/jsonscheme/test9/api") != -1
                || filePath.indexOf("/add/api-") != -1
                || filePath.indexOf("/src/raml1/test/data/api.raml") != -1
                || filePath.indexOf("/src/raml1/test/data/api-remove-paged.raml") != -1
                || filePath.indexOf("/src/raml1/test/data/api-remove-version.raml") != -1))
                    testParsingByEditing(filePath, reportsFolder);
        } else
            parseAllRaml(filePath);
    })
}

function testParsingByEditing(ramlFile: string, reportsFolder?: string){
    var reportContent: string = "";

    var content = fs.readFileSync(ramlFile, "utf8");
    var contentBuffer: string = content.substr(0, content.indexOf("\n") + "\n".length);
    var resolver = new jsyaml.FSResolverImpl();
    var fsResolver = {
        content: (path) => {
            if (path == ramlFile) {
                return contentBuffer;
            }
            return resolver.content(path);
        },
        contentAsync: (path) => {
            return Promise.resolve("");
        }
    };
    console.log(ramlFile + " " + content.length);

            for (var i = contentBuffer.length; i < content.length; i++){
                try {
                    contentBuffer += content.substr(i, 1);
                    var api = (index.loadApiSync(ramlFile, [], {
                        fsResolver: fsResolver
                    })).expand();
                    var apiJSON = api.toJSON({rootNodeDetails: true});
                } catch (err) {
                    if (Object.keys(err).length > 0)
                        reportContent += ramlFile + "\n\n" +
                            JSON.stringify(err, null, 4) + "\n\n" +
                            contentBuffer + "\n\n";
                }
            }

    if (reportContent.length>0 && reportsFolder) {
        var reportFile = reportsFolder + ramlFile;
        var reportFolder: string = (reportFile).substr(0, reportFile.lastIndexOf("/"));
        createSubFolders(reportFolder);
        fs.writeFileSync(reportFile, reportContent);
    }
}

function createSubFolders(path: string){
    if (!fs.existsSync(path)) {
        var partialPath: string = "";
        path.split("/").forEach(part=> {
            if (part.length > 0) {
                partialPath += "/" + part;
                if (!fs.existsSync(partialPath))
                    fs.mkdirSync(partialPath);
            }
        });
    }
}
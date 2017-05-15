/// <reference path="../../../typings/main.d.ts" />
import assert = require("assert")
import ll=require("../lowLevelAST")
import linter=require("../ast.core/linter")
import yll=require("../jsyaml/jsyaml2lowLevel")
import hl=require("../highLevelAST")
import util = require("./test-utils")
import funcUtil = require("./funcUtils");
import tools = require("./testTools")

import index = require("../../index");
import parserMod = require("../../parserMod");
import project = require("../../project");
import search = require("../../search/search-interface");
import schema = require("../../schema");
import fs = require("fs");
import path = require("path");
import universes = require("../tools/universe");
import factory10 = require("../artifacts/raml10factory");
import factory08 = require("../artifacts/raml08factory");
import highLevelImpl = require("../highLevelImpl");


function deleteIds(v:any){

    delete v["@id"];
    Object.keys(v).forEach(x=>{
        if (typeof v[x]=="object"){
            deleteIds(v[x]);
        }
    })
}
describe('Parser index functions tests', function () {
    this.timeout(15000);
    // it("Fragment 001", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test1.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Api/test001/api.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Api/test001/api.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "schema-org:name": "test"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Fragment 004", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test2.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Fragments/test004/DataType.raml",
    //                 "@type": [
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Fragments/test004/DataType.raml#",
    //                     "@type": [
    //                         "shacl:NodeShape",
    //                         "shacl:Shape"
    //                     ],
    //                     "shacl:property": [
    //                         {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Fragments/test004/DataType.raml#/property/first",
    //                             "@type": [
    //                                 "shacl:PropertyShape",
    //                                 "shacl:Shape"
    //                             ],
    //                             "raml-shapes:propertyLabel": "first",
    //                             "shacl:dataType": {
    //                                 "@id": "xsd:string"
    //                             },
    //                             "shacl:maxCount": 1,
    //                             "shacl:minCount": 1,
    //                             "shacl:path": {
    //                                 "@id": "http://raml.org/vocabularies/shapes/anon#first"
    //                             }
    //                         },
    //                         {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Fragments/test004/DataType.raml#/property/second",
    //                             "@type": [
    //                                 "shacl:PropertyShape",
    //                                 "shacl:Shape"
    //                             ],
    //                             "raml-shapes:propertyLabel": "second",
    //                             "shacl:dataType": {
    //                                 "@id": "xsd:string"
    //                             },
    //                             "shacl:maxCount": 1,
    //                             "shacl:minCount": 1,
    //                             "shacl:path": {
    //                                 "@id": "http://raml.org/vocabularies/shapes/anon#second"
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Test 003", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test3.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Api/test004/api.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Api/test004/api.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "raml-http:host": "api.example.com",
    //                     "raml-http:scheme": [
    //                         "HTTP",
    //                         "HTTPS"
    //                     ],
    //                     "schema-org:name": "test"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Test 004", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test4.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "raml-http:basePath": "/some/base/uri",
    //                     "raml-http:endpoint": [
    //                         {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0",
    //                             "@type": [
    //                                 "raml-http:EndPoint",
    //                                 "raml-doc:DomainElement"
    //                             ],
    //                             "raml-http:path": "/someChildUri",
    //                             "hydra:supportedOperation": {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/get",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "get",
    //                                 "hydra:returns": {
    //                                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/get/200",
    //                                     "@type": [
    //                                         "raml-http:Response",
    //                                         "raml-doc:DomainElement"
    //                                     ],
    //                                     "raml-http:payload": {
    //                                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/get/200/body/application%2Fxml",
    //                                         "@type": [
    //                                             "raml-http:Payload",
    //                                             "raml-doc:DomainElement"
    //                                         ],
    //                                         "raml-http:mediaType": "application/xml",
    //                                         "raml-http:schema": {
    //                                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/get/200/body/application%2Fxml/shape",
    //                                             "@type": [
    //                                                 "shacl:NodeShape",
    //                                                 "shacl:Shape"
    //                                             ],
    //                                             "schema-org:description": "some very useful resource"
    //                                         }
    //                                     },
    //                                     "schema-org:name": "200",
    //                                     "hydra:statusCode": "200"
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/end-points/0",
    //                             "@type": [
    //                                 "raml-http:EndPoint",
    //                                 "raml-doc:DomainElement"
    //                             ],
    //                             "raml-http:path": "/someChildUri/anotherChild",
    //                             "hydra:supportedOperation": {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/end-points/0/put",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:expects": {
    //                                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/end-points/0/put/request",
    //                                     "@type": [
    //                                         "raml-http:Request",
    //                                         "raml-doc:DomainElement"
    //                                     ],
    //                                     "raml-http:payload": {
    //                                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/end-points/0/put/body/application%2Fjson",
    //                                         "@type": [
    //                                             "raml-http:Payload",
    //                                             "raml-doc:DomainElement"
    //                                         ],
    //                                         "raml-http:mediaType": "application/json",
    //                                         "raml-http:schema": {
    //                                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test001/api.raml#/api-documentation/end-points/0/end-points/0/put/body/application%2Fjson/shape",
    //                                             "@type": [
    //                                                 "shacl:NodeShape",
    //                                                 "shacl:Shape"
    //                                             ],
    //                                             "schema-org:description": "another very useful resource"
    //                                         }
    //                                     }
    //                                 },
    //                                 "hydra:method": "put"
    //                             }
    //                         }
    //                     ],
    //                     "schema-org:name": "API"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Test 005", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test5.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "raml-http:endpoint": {
    //                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0",
    //                         "@type": [
    //                             "raml-http:EndPoint",
    //                             "raml-doc:DomainElement"
    //                         ],
    //                         "raml-http:path": "/methods",
    //                         "hydra:supportedOperation": [
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/get",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "get"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/patch",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "patch"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/delete",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "delete"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/head",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "head"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/post",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "post"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/options",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "options"
    //                             },
    //                             {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Methods/test003/meth03.raml#/api-documentation/end-points/0/put",
    //                                 "@type": [
    //                                     "hydra:Operation",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "hydra:method": "put"
    //                             },
    //                         ]
    //                     },
    //                     "schema-org:name": "test"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Test 006", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test6.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "raml-http:basePath": "/some/base/uri",
    //                     "raml-http:endpoint": {
    //                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation/end-points/0",
    //                         "@type": [
    //                             "raml-http:EndPoint",
    //                             "raml-doc:DomainElement"
    //                         ],
    //                         "raml-http:parameter": {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/%2FsomeChildUri%2F%7Bblah%7D/pathParameters/blah",
    //                             "@type": [
    //                                 "raml-http:Parameter",
    //                                 "raml-doc:DomainElement"
    //                             ],
    //                             "raml-http:paramBinding": "path",
    //                             "raml-http:schema": {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/%2FsomeChildUri%2F%7Bblah%7D/pathParameters/blah",
    //                                 "@type": [
    //                                     "raml-shapes:Scalar",
    //                                     "shacl:Shape"
    //                                 ],
    //                                 "shacl:dataType": {
    //                                     "@id": "xsd:string"
    //                                 }
    //                             },
    //                             "schema-org:name": "blah",
    //                             "hydra:required": true
    //                         },
    //                         "raml-http:path": "/someChildUri/{blah}",
    //                         "hydra:supportedOperation": {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation/end-points/0/get",
    //                             "@type": [
    //                                 "hydra:Operation",
    //                                 "raml-doc:DomainElement"
    //                             ],
    //                             "hydra:method": "get",
    //                             "hydra:returns": {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation/end-points/0/get/200",
    //                                 "@type": [
    //                                     "raml-http:Response",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "raml-http:payload": {
    //                                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation/end-points/0/get/200/body/application%2Fxml",
    //                                     "@type": [
    //                                         "raml-http:Payload",
    //                                         "raml-doc:DomainElement"
    //                                     ],
    //                                     "raml-http:mediaType": "application/xml",
    //                                     "raml-http:schema": {
    //                                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/Resources/test002/api.raml#/api-documentation/end-points/0/get/200/body/application%2Fxml/shape",
    //                                         "@type": [
    //                                             "shacl:NodeShape",
    //                                             "shacl:Shape"
    //                                         ],
    //                                         "schema-org:description": "some very useful resource"
    //                                     }
    //                                 },
    //                                 "schema-org:name": "200",
    //                                 "hydra:statusCode": "200"
    //                             }
    //                         }
    //                     },
    //                     "schema-org:name": "API"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    // it("Test 007", function (done) {
    //     this.timeout(15000);
    //     index.loadRAML(util.data("../amf/test7.raml"), []).then((api) => {
    //         try {
    //             var obj=api.toJSON({jsonLD: true});
    //             deleteIds(obj);
    //             var t={
    //                 "@context": {
    //                     "raml-doc": "http://raml.org/vocabularies/document#",
    //                     "raml-http": "http://raml.org/vocabularies/http#",
    //                     "raml-shapes": "http://raml.org/vocabularies/shapes#",
    //                     "hydra": "http://www.w3.org/ns/hydra/core#",
    //                     "shacl": "http://www.w3.org/ns/shacl#",
    //                     "schema-org": "http://schema.org/",
    //                     "xsd": "http://www.w3.org/2001/XMLSchema#"
    //                 },
    //                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml",
    //                 "@type": [
    //                     "raml-doc:Document",
    //                     "raml-doc:Fragment",
    //                     "raml-doc:Module",
    //                     "raml-doc:Unit"
    //                 ],
    //                 "raml-doc:encodes": {
    //                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml#/api-documentation",
    //                     "@type": [
    //                         "raml-http:APIDocumentation",
    //                         "raml-doc:DomainElement"
    //                     ],
    //                     "raml-http:endpoint": {
    //                         "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml#/api-documentation/end-points/0",
    //                         "@type": [
    //                             "raml-http:EndPoint",
    //                             "raml-doc:DomainElement"
    //                         ],
    //                         "raml-http:path": "/test",
    //                         "hydra:supportedOperation": {
    //                             "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml#/api-documentation/end-points/0/get",
    //                             "@type": [
    //                                 "hydra:Operation",
    //                                 "raml-doc:DomainElement"
    //                             ],
    //                             "hydra:method": "get",
    //                             "hydra:returns": {
    //                                 "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml#/api-documentation/end-points/0/get/200",
    //                                 "@type": [
    //                                     "raml-http:Response",
    //                                     "raml-doc:DomainElement"
    //                                 ],
    //                                 "raml-http:payload": {
    //                                     "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test002/methResp02.raml#/api-documentation/end-points/0/get/200/body/application%2Fjson",
    //                                     "@type": [
    //                                         "raml-http:Payload",
    //                                         "raml-doc:DomainElement"
    //                                     ],
    //                                     "raml-http:mediaType": "application/json"
    //                                 },
    //                                 "schema-org:name": "200",
    //                                 "hydra:statusCode": "200"
    //                             }
    //                         }
    //                     },
    //                     "schema-org:name": "test"
    //                 }
    //             }
    //             deleteIds(t);
    //             assert.deepEqual(obj,t);
    //             done();
    //         } catch (exception) {
    //             done(exception);
    //         }
    //     });
    // });
    it("Test 008", function (done) {
        this.timeout(15000);
        index.loadRAML(util.data("../amf/test8.raml"), []).then((api) => {
            try {
                var obj=api.toJSON({jsonLD: true});
                deleteIds(obj);
                var t={
                    "@context": {
                        "raml-doc": "http://raml.org/vocabularies/document#",
                        "raml-http": "http://raml.org/vocabularies/http#",
                        "raml-shapes": "http://raml.org/vocabularies/shapes#",
                        "hydra": "http://www.w3.org/ns/hydra/core#",
                        "shacl": "http://www.w3.org/ns/shacl#",
                        "schema-org": "http://schema.org/",
                        "xsd": "http://www.w3.org/2001/XMLSchema#"
                    },
                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml",
                    "@type": [
                        "raml-doc:Document",
                        "raml-doc:Fragment",
                        "raml-doc:Module",
                        "raml-doc:Unit"
                    ],
                    "raml-doc:declares": [
                        {
                            "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/account",
                            "@type": [
                                "shacl:NodeShape",
                                "shacl:Shape"
                            ],
                            "schema-org:name": "account",
                            "shacl:property": [
                                {
                                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/account/property/username",
                                    "@type": [
                                        "shacl:PropertyShape",
                                        "shacl:Shape"
                                    ],
                                    "raml-shapes:propertyLabel": "username",
                                    "shacl:dataType": {
                                        "@id": "xsd:string"
                                    },
                                    "shacl:maxCount": 1,
                                    "shacl:minCount": 0,
                                    "shacl:path": {
                                        "@id": "http://raml.org/vocabularies/shapes/anon#username"
                                    }
                                },
                                {
                                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/account/property/id",
                                    "@type": [
                                        "shacl:PropertyShape",
                                        "shacl:Shape"
                                    ],
                                    "raml-shapes:propertyLabel": "id",
                                    "shacl:dataType": {
                                        "@id": "xsd:string"
                                    },
                                    "shacl:maxCount": 1,
                                    "shacl:minCount": 0,
                                    "shacl:path": {
                                        "@id": "http://raml.org/vocabularies/shapes/anon#id"
                                    }
                                }
                            ]
                        },
                        {
                            "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TypeBase",
                            "@type": [
                                "shacl:NodeShape",
                                "shacl:Shape"
                            ],
                            "schema-org:name": "TypeBase",
                            "shacl:property": {
                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TypeBase/property/id",
                                "@type": [
                                    "shacl:PropertyShape",
                                    "shacl:Shape"
                                ],
                                "raml-shapes:propertyLabel": "id",
                                "shacl:dataType": {
                                    "@id": "xsd:string"
                                },
                                "shacl:maxCount": 1,
                                "shacl:minCount": 1,
                                "shacl:path": {
                                    "@id": "http://raml.org/vocabularies/shapes/anon#id"
                                }
                            }
                        },
                        {
                            "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TestType",
                            "@type": [
                                "shacl:NodeShape",
                                "shacl:Shape"
                            ],
                            "raml-shapes:inherits": {
                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TestType/type",
                                "@type": [
                                    "raml-shapes:NodeShape",
                                    "shacl:Shape"
                                ],
                                "raml-shapes:inherits": {
                                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TypeBase"
                                },
                                "schema-org:name": "TypeBase"
                            },
                            "schema-org:name": "TestType",
                            "shacl:property": {
                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TestType/property/username",
                                "@type": [
                                    "shacl:PropertyShape",
                                    "shacl:Shape"
                                ],
                                "raml-shapes:propertyLabel": "username",
                                "shacl:dataType": {
                                    "@id": "xsd:string"
                                },
                                "shacl:maxCount": 1,
                                "shacl:minCount": 1,
                                "shacl:path": {
                                    "@id": "http://raml.org/vocabularies/shapes/anon#username"
                                }
                            }
                        }
                    ],
                    "raml-doc:encodes": {
                        "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation",
                        "@type": [
                            "raml-http:APIDocumentation",
                            "raml-doc:DomainElement"
                        ],
                        "raml-http:endpoint": {
                            "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0",
                            "@type": [
                                "raml-http:EndPoint",
                                "raml-doc:DomainElement"
                            ],
                            "raml-http:path": "/test",
                            "hydra:supportedOperation": {
                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post",
                                "@type": [
                                    "hydra:Operation",
                                    "raml-doc:DomainElement"
                                ],
                                "hydra:method": "post",
                                "hydra:returns": {
                                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post/201",
                                    "@type": [
                                        "raml-http:Response",
                                        "raml-doc:DomainElement"
                                    ],
                                    "raml-http:payload": {
                                        "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post/201/body/application%2Fjson",
                                        "@type": [
                                            "raml-http:Payload",
                                            "raml-doc:DomainElement"
                                        ],
                                        "raml-http:mediaType": "application/json",
                                        "raml-http:schema": {
                                            "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post/201/body/application%2Fjson/shape",
                                            "@type": [
                                                "shacl:NodeShape",
                                                "shacl:Shape"
                                            ],
                                            "raml-shapes:inherits": {
                                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post/201/body/application%2Fjson/shape/type",
                                                "@type": [
                                                    "raml-shapes:NodeShape",
                                                    "shacl:Shape"
                                                ],
                                                "raml-shapes:inherits": {
                                                    "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/definitions/TestType"
                                                },
                                                "schema-org:name": "TestType"
                                            },
                                            "shacl:property": {
                                                "@id": "https://mulesoft-labs.github.io/amf-playground/raml/tck/raml-1.0/MethodResponses/test005/methResp05.raml#/api-documentation/end-points/0/post/201/body/application%2Fjson/shape/property/additionalField",
                                                "@type": [
                                                    "shacl:PropertyShape",
                                                    "shacl:Shape"
                                                ],
                                                "raml-shapes:propertyLabel": "additionalField",
                                                "shacl:dataType": {
                                                    "@id": "xsd:string"
                                                },
                                                "shacl:maxCount": 1,
                                                "shacl:minCount": 0,
                                                "shacl:path": {
                                                    "@id": "http://raml.org/vocabularies/shapes/anon#additionalField"
                                                }
                                            }
                                        }
                                    },
                                    "schema-org:name": "201",
                                    "hydra:statusCode": "201"
                                }
                            }
                        },
                        "schema-org:name": "test"
                    }
                }
                deleteIds(t);
                assert.deepEqual(obj,t);
                done();
            } catch (exception) {
                done(exception);
            }
        });
    });
})
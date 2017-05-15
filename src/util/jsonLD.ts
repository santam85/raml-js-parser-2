/// <reference path="../../typings/main.d.ts" />
import hl = require("../raml1/highLevelAST");
import {Api, Response, TypeDeclaration, Method, Resource} from "../raml1/artifacts/raml10parserapi";
/**
 *
 */
export interface StringMap {
    [ name: string]: string
}
var context = {
    "raml-doc": "http://raml.org/vocabularies/document#",
    "raml-http": "http://raml.org/vocabularies/http#",
    "raml-shapes": "http://raml.org/vocabularies/shapes#",
    "hydra": "http://www.w3.org/ns/hydra/core#",
    "shacl": "http://www.w3.org/ns/shacl#",
    "schema-org": "http://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
}
var API_TYPE = [
    "raml-http:APIDocumentation",
    "raml-doc:DomainElement"
]

var NODE_SHAPE = [
    "shacl:NodeShape",
    "shacl:Shape"
]
var PROP = [
    "shacl:PropertyShape",
    "shacl:Shape"
]

var NODE_PROPERTY = [
    "shacl:PropertyShape",
    "shacl:Shape"
]
var ENCODES_PROPERTY = "raml-doc:encodes";


var pMap = {
    Api: {
        title: "schema-org:name",
        baseUri: "raml-http:host",
        protocols: "raml-http:scheme"
    }
    , TypeDeclaration: {
        properties: "shacl:property",
        name: "raml-shapes:propertyLabel"
    }
}
//data

export interface LDNode {
    "@context"?: StringMap
    "@id": string
    "@type": string[]
    [name: string]: any
}
export function unitId(h: hl.IHighLevelNode): string {
    return h.lowLevel().unit().absolutePath();
}
export function composingId(h: hl.IHighLevelNode, postFix: string): string {
    return unitId(h) + postFix;
}

export function appendProp(obj: any, property: string, value: any) {
    if (obj[property]) {
        if (Array.isArray(obj[property])) {
            obj[property].push(value);
        }
        else {
            obj[property] = [obj[property], value]
        }
    }
    else {
        obj[property] = value;
    }
}
export class JSONLD {


    mapProperty(k: string): string {
        return null;
    }

    newLDNode(id: string, types: string[], topLevel: boolean = false): LDNode {
        var res: LDNode = {"@id": id, "@type": types};
        if (topLevel) {
            res["@context"] = context;
        }
        return res;
    }

    types(n: hl.IHighLevelNode): string[] {
        var name = n.definition().nameId();
        if (name == "Api") {
            return [
                "raml-doc:Document",
                "raml-doc:Fragment",
                "raml-doc:Module",
                "raml-doc:Unit"
            ]
        }
        else if (name == "Library") {
            return [
                "raml-doc:Fragment",
                "raml-doc:Module",
                "raml-doc:Unit"
            ]
        }
        else {
            return [
                "raml-doc:Fragment",
                "raml-doc:Unit"
            ]
        }
    }

    dumpNode(h: hl.IHighLevelNode) {
        var r = this.newLDNode(unitId(h), this.types(h), true);
        if (h.definition().nameId() == "Api") {
            var api=(<Api>h.wrapperNode())
            api.schemas().forEach(x=>{
                appendProp(r,"raml-doc:declares",this.dumpType(x));
            })
            api.types().forEach(x=>{
                appendProp(r,"raml-doc:declares",this.dumpType(x));
            })
        }
        r[ENCODES_PROPERTY] = this.buildEncodes(h);
        return r;
    }

    buildResponse(r: Response) {
        var res = {
            "@id": r.highLevel().id() + "/body",
            "@type": [
                "raml-http:Response",
                "raml-doc:DomainElement"
            ],
            "hydra:statusCode": r.code().value(),
            "schema-org:name": r.code().value()
        }
        r.body().forEach(x => {
            appendProp(res, "raml-http:payload", this.buildPayload(x));
        })
        return res;
    }

    buildBody(m: Method) {
        var res = {
            "@id": m.highLevel().id() + "/body",
            "@type": [
                "raml-http:Request",
                "raml-doc:DomainElement"
            ],

        }
        m.body().forEach(x => {
            appendProp(res, "raml-http:payload", this.buildPayload(x));
        })
        return res;
    }

    buildPayload(t: TypeDeclaration) {
        var res= {
            "@id": t.highLevel().id(),
            "@type": [
                "raml-http:Payload",
                "raml-doc:DomainElement"
            ],
            "raml-http:mediaType": t.name(),

        }
        var v=t.highLevel().lowLevel().dumpToObject();
        v=v[Object.keys(v)[0]];
        if (v&&Object.keys(v).length>0) {
            res["raml-http:schema"] = {
                "@type": [
                    "shacl:NodeShape",
                    "shacl:Shape"
                ],
                "schema-org:description": t.description() ? t.description().value() : null
            }
        }
        return res;
    }

    buildUriParameter(r: TypeDeclaration) {
        return {
            "@id": r.highLevel().id(),
            "@type": [
                "raml-http:Parameter",
                "raml-doc:DomainElement"
            ],
            "raml-http:paramBinding": "path",
            "raml-http:schema": this.dumpType(r),
            "schema-org:name": r.name(),
            "hydra:required": r.required()
        }
    }

    dumpType(t: TypeDeclaration) {
        return {
            "@id": t.highLevel().id(),
            "@type": [
                "raml-shapes:Scalar",
                "shacl:Shape"
            ],
            "shacl:dataType": {
                "@id": "xsd:string"
            }
        }
    }

    buildEncodes(h: hl.IHighLevelNode) {
        var r: LDNode = null;
        var isProp = h.property() && h.property().nameId() == "properties";
        if (h.definition().isAssignableFrom("TypeDeclaration")) {
            r = this.newLDNode(composingId(h, "#/dataType"), isProp ? PROP : NODE_SHAPE);
        }
        else {
            r = this.newLDNode(composingId(h, "#/api-documentation"), API_TYPE);
        }
        h.attrs().forEach(x => {
            //map attribute;
            this.append(r, x);
        });
        h.elements().forEach(x => {
            this.append(r, x);
        })
        var node = r;
        if (h.definition().nameId() == "Api") {
            var api = (<Api>h.wrapperNode())
            api.allResources().forEach(r => {
               this.buildResource(r, node);
            })

        }
        if (isProp) {
            var pr = h.parent().localType().property(h.name());
            r["shacl:maxCount"] = 1;
            r["shacl:minCount"] = pr.isRequired() ? 1 : 0;
            r["shacl:path"] = {};
            var isS = pr.range().isAssignableFrom("StringType");
            var id = ""
            if (isS) {
                id = "xsd:string"
            }
            r["shacl:dataType"] = {"@id": id}
        }
        return r;
    }

    private buildResource(r: Resource, node: LDNode) {
        var res = {
            "@type": [
                "raml-http:EndPoint",
                "raml-doc:DomainElement"
            ]
            , "raml-http:path": r.completeRelativeUri()
        }
        r.allUriParameters().forEach(x => {
            appendProp(res, "raml-http:parameter", this.buildUriParameter(x))
        })
        r.methods().forEach(m => {
            var op = {
                "@type": [
                    "hydra:Operation",
                    "raml-doc:DomainElement"
                ]
            }
            op["hydra:method"] = m.method();
            appendProp(res, "hydra:supportedOperation", op);
            m.responses().forEach(x => {
                appendProp(op, "hydra:returns", this.buildResponse(x));
            });
            if (m.body().length > 0) {
                appendProp(op, "hydra:expects", this.buildBody(m));
            }
        })
        appendProp(node, "raml-http:endpoint", res);
    }

    pid(x: hl.IParseResult): string {
        if (x.property()) {
            return x.property().nameId();
        }
        return x.name();
    }

    private
    append(r: LDNode, x: hl.IParseResult) {
        var pm = pMap[x.parent().definition().nameId()]
        var mapping = pm ? pm[this.pid(x)] : null;
        if (!mapping) {
            x.parent().definition().allSuperTypes().forEach(y => {
                if (!mapping) {
                    pm = pMap[y.nameId()]
                    mapping = pm ? pm[this.pid(x)] : null;
                }
            });
        }
        if (!mapping){
            return
        }
        var vl = null;
        if (x.isAttr()) {
            vl = x.asAttr().value()
        }
        else {
            vl = this.buildEncodes(x.asElement());
        }
        if (mapping == 'raml-http:host') {
            if (vl.indexOf("/") == 0) {
                mapping = "raml-http:basePath"
            }
        }
        if (mapping) {
            var val = r[mapping];
            if (val) {
                if (Array.isArray(val)) {
                    val.push(vl);
                }
                else {
                    r[mapping] = [val, vl];
                }
            }
            else {
                r[mapping] = vl;
            }
        }
    }
}
function cleanup(v:any){
    if (typeof v=="object") {
        if (Array.isArray(v)){
            v.forEach(f=>cleanup(f));
        }
        else {
            Object.keys(v).forEach(x => {
                if (v[x] == null || v[x] == undefined) {
                    delete v[x];
                }
                else {

                    cleanup(v[x]);

                }
            })
        }
    }
}
//print LD
export function dump(node: hl.IHighLevelNode) {
    var res=new JSONLD().dumpNode(node);
    cleanup(res);
    return res;
}
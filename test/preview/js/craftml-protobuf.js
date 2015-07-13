var proto = {
    "package": "Craftml",
    "messages": [
        {
            "name": "Solid",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "type",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "Box",
                    "name": "layout",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "Matrix",
                    "name": "m",
                    "id": 3
                },
                {
                    "rule": "repeated",
                    "type": "Polygon",
                    "name": "polygons",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "Buffer",
                    "name": "buffer",
                    "id": 5
                },
                {
                    "rule": "repeated",
                    "type": "KeyValuePair",
                    "name": "style",
                    "id": 6
                },
                {
                    "rule": "repeated",
                    "type": "Solid",
                    "name": "children",
                    "id": 7
                }
            ],
            "messages": [
                {
                    "name": "KeyValuePair",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "keyValue",
                            "id": 1
                        }
                    ]
                }
            ]
        },
        {
            "name": "Buffer",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "float",
                    "name": "vertices",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "float",
                    "name": "normals",
                    "id": 2
                }
            ]
        },
        {
            "name": "Polygon",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "Vertex",
                    "name": "vertices",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "Vertex",
                    "name": "normal",
                    "id": 2
                }
            ]
        },
        {
            "name": "Vertex",
            "fields": [
                {
                    "rule": "required",
                    "type": "float",
                    "name": "x",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "float",
                    "name": "y",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "float",
                    "name": "z",
                    "id": 3
                }
            ]
        },
        {
            "name": "Matrix",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "float",
                    "name": "elements",
                    "id": 1
                }
            ]
        },
        {
            "name": "Box",
            "fields": [
                {
                    "rule": "required",
                    "type": "Point3D",
                    "name": "location",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "Point3D",
                    "name": "size",
                    "id": 2
                }
            ],
            "messages": [
                {
                    "name": "Point3D",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "float",
                            "name": "x",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "float",
                            "name": "y",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "float",
                            "name": "z",
                            "id": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "Properties",
            "fields": []
        },
        {
            "name": "CSG",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "Polygon",
                    "name": "polygons",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "Properties",
                    "name": "properties",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "isCanonicalized",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "isRetesselated",
                    "id": 4
                },
                {
                    "rule": "repeated",
                    "type": "Vector3D",
                    "name": "cachedBoundingBox",
                    "id": 5
                }
            ]
        },
        {
            "name": "Plane",
            "fields": [
                {
                    "rule": "required",
                    "type": "Vector3D",
                    "name": "normal",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "float",
                    "name": "w",
                    "id": 2
                }
            ]
        },
        {
            "name": "Vector3D",
            "fields": [
                {
                    "rule": "required",
                    "type": "float",
                    "name": "_x",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "float",
                    "name": "_y",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "float",
                    "name": "_z",
                    "id": 3
                }
            ]
        },
        {
            "name": "Polygon1",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "Vertex",
                    "name": "vertices",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "Polygon",
                    "name": "shared",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "color",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "Plane",
                    "name": "plane",
                    "id": 4
                },
                {
                    "rule": "repeated",
                    "type": "Vector3D",
                    "name": "cachedBoundingBox",
                    "id": 5
                }
            ]
        }
    ]
}

var ProtoBuf = dcodeIO.ProtoBuf;
var builder = ProtoBuf.loadJson(proto)
var SolidProto = builder.build("Craftml").Solid

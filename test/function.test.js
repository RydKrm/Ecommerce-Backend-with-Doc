const request = require("supertest");
const { app } = require("../index");
const { adminToken } = require("./variable.test");

exports.adminGET = async (url) => {
    return await request(app)
        .get(url)
        .set("Authorization", `Bearer ${adminToken}`)
}

exports.adminPost = async (url, obj) => {
    return await request(app)
        .post(url)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(obj);
}

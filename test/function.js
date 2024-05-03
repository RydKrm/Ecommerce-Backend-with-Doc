const request = require("supertest");
const app = require("../index");
const { adminToken, customerToken } = require("./variable");

exports.adminGet = async (url) => {
    return await request(app)
        .get(url)
        .set("Authorization", `Bearer ${adminToken}`)
}

exports.adminPost = async (url, obj = {}) => {
    return await request(app)
        .post(url)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(obj);
}

exports.adminPatch = async (url, obj = {}) => {
    return await request(app)
        .patch(url)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(obj)
}

exports.adminPut = async (url, obj = {}) => {
    return await request(app)
        .patch(url)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(obj)
}

exports.adminDelete = async (url, obj = {}) => {
    return await request(app)
        .delete(url)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(obj)
}

exports.customerGet = async (url) => {
    return await request(app)
        .get(url)
        .set("Authorization", `Bearer ${customerToken}`)
}

exports.customerPost = async (url, obj = {}) => {
    return await request(app)
        .post(url)
        .set("Authorization", `Bearer ${customerToken}`)
        .send(obj);
}

exports.customerPatch = async (url, obj = {}) => {
    return await request(app)
        .patch(url)
        .set("Authorization", `Bearer ${customerToken}`)
        .send(obj)
}

exports.customerPut = async (url, obj = {}) => {
    return await request(app)
        .patch(url)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(obj)
}

exports.customerDelete = async (url, obj = {}) => {
    return await request(app)
        .delete(url)
        .set("Authorization", `Bearer ${customerToken}`)
        .send(obj)
}
/* eslint-disable no-undef */

const { adminGet, adminPatch, adminDelete, adminPost } = require("./function");

let categoryId = '';

describe("Testing category CRUD ", () => {
    it("Will create a category", async () => {
        const category = {
            name: "Electronics",
            description: "All electronic product store here",
        }
        const res = await adminPost('/api/category/create', category);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        categoryId = res.body.data._id;
    })

    it("Will find a category By category _id", async () => {
        const res = await adminGet(`/api/category/getSingle/${categoryId}`);

        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data._id).toMatch(categoryId);
    })

    it("Update product ", async () => {
        const product = {
            name: "Electronic and electrical",
            description: "This is very good product",
        }

        const res = await adminPatch(`/api/category/update/${categoryId}`, product);
        expect(res.body.success).toBe(true);
    })

    it("Get all product ", async () => {
        const res = await adminGet(`/api/category/getAll`);
        expect(res.body.success).toBe(true);
    })

    it("Get all status true product ", async () => {
        const res = await adminGet('/api/category/getTrue')
        expect(res.body.success).toBe(true);
    })

    it("Delete a product", async () => {
        const res = await adminDelete(`/api/category/delete/${categoryId}`);
        expect(res.body.success).toBe(true)
    })

});

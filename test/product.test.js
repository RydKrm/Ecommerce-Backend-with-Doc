/* eslint-disable no-undef */

const { adminGet, adminPatch, adminDelete, adminPost } = require("./function");

let productId = '';

describe("Testing product CRUD ", () => {
    it("Will create a product", async () => {
        const product = {
            name: "Zi_friend keyboard",
            sellingPrice: 250,
            previousPrice: 300,
            buyingPrice: 200,
            description: "This is very good product",
            category: "662cb685bc0ee5346c4328d6",
            image: "upload/zi-friends.jpeg",
            stockQuantity: 15
        }

        const res = await adminPost('/api/product/create', product);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        productId = res.body.data._id;

    })

    it("Will find a product By product _id", async () => {
        const res = await adminGet(`/api/product/getSingle/${productId}`);

        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data._id).toMatch(productId);
    })

    it("Update product ", async () => {
        const product = {
            name: "Zi_friend keyboard T98",
            sellingPrice: 300,
            previousPrice: 350,
            buyingPrice: 220,
            description: "This is very good product",
            category: "662cb685bc0ee5346c4328d6",
            image: "upload/zi-friends.jpeg",
            stockQuantity: 10
        }

        const res = await adminPatch(`/api/product/update/${productId}`, product);
        expect(res.body.success).toBe(true);
    })

    it("Get all product ", async () => {
        const res = await adminGet(`/api/product/getAll`);
        expect(res.body.success).toBe(true);
    })

    it("Get all status true product ", async () => {
        const res = await adminGet('/api/product/getAllTrue')
        expect(res.body.success).toBe(true);
    })

    it("Update product status", async () => {
        const res = await adminPatch(`/api/product/updateStatus/${productId}`);
        expect(res.body.success).toBe(true);
    })

    it("Delete a product", async () => {
        const res = await adminDelete(`/api/product/delete/${productId}`);
        expect(res.body.success).toBe(true)
    })

});

// }
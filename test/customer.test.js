/* eslint-disable no-undef */

const { adminGet, adminPatch, adminDelete, adminPost, customerPost, customerGet } = require("./function");

let customerId = '';
let customerEmail = '';
let token = '';

describe("Testing Customer Profile ", () => {
    it("Will create a customer", async () => {
        const random = Math.random();
        const customer = {
            name: `customer-${random}`,
            email: `customer_${random}@gmail.com`,
            password: "123456",
            phone: "12345678",
            address: "Dhaka Mirpur"
        }
        const res = await adminPost('/api/customer/signup', customer);

        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        customerId = res.body.data._id;
        customerEmail = customer.email;
    })

    it("Will a customer can login", async () => {
        const data = {
            email: customerEmail,
            password: "123456"
        }

        const res = await customerPost('/api/customer/login', data);
        // console.log(res.body);

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        token = res.body.token;

    })

    it("Will find a customer by customerId", async () => {
        const res = await customerGet(`/api/customer/getSingleCustomer/${customerId}`);

        console.log(res.body);


        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data._id).toMatch(customerId);
    })

});

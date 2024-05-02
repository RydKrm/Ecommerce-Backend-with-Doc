/* eslint-disable no-undef */
const request = require("supertest");
const { app } = require("../index");
const { managerToken } = require("./variable");

// for(let i=0;i<10;i++) {

describe("Identification Field Unit Testing ", () => {
    // ! ===============  function list ==============

    const getTrueDataField = async () => {
        return await request(app)
            .get(`/manager/getTrueDataField`)
            .set("Authorization", `Bearer ${managerToken}`);
    };

    const addIdentificationField = async (fieldId) => {
        return await request(app)
            .post("/manager/addIdentificationFieldCompany")
            .set("Authorization", `Bearer ${managerToken}`)
            .send({ fieldId });
    };

    const changeIdentificationStatus = async (fieldId) => {
        return await request(app)
            .patch(`/manager/changeIdentificationStatus/${fieldId}`)
            .set("Authorization", `Bearer ${managerToken}`);
    };

    const getTrueIdentificationField = async () => {
        return await request(app)
            .get(`/manager/getTrueIdentificationFields`)
            .set("Authorization", `Bearer ${managerToken}`);
    };

    const getIdentificationField = async () => {
        return await request(app)
            .get(`/manager/getIdentificationField`)
            .set("Authorization", `Bearer ${managerToken}`);
    };

    const deleteIdentificationField = async (fieldId) => {
        return await request(app)
            .delete(`/manager/deleteIdentificationField/${fieldId}`)
            .set("Authorization", `Bearer ${managerToken}`);
    };

    //  ! =============== variables  =====================

    let dataFields = [];
    let newIdentificationId = "";
    let randomId = "";

    //   ! ============== testing the api ================

    it("Will it get all data field?", async () => {
        const res = await getTrueDataField();
        expect(res.body.status).toBe(true);
        expect(res.body.trueDataFields).toBeDefined();
        dataFields = res.body.trueDataFields;
    });

    it("Will it add identification field?", async () => {
        const itemNumber = Math.floor(Math.random() * (dataFields.length - 1));
        randomId = dataFields[itemNumber]._id;
        const res = await addIdentificationField(randomId);
        expect(res.body.status).toBe(true);
        expect(res.body.data).toBeDefined();
        newIdentificationId = res.body.data[res.body.data.length - 1]._id;
    });

    it("Does it add not duplicate field into the identification field?", async () => {
        const res = await addIdentificationField(randomId);
        expect(res.body.status).toBe(false);
    });

    it("check for new field added or not?", async () => {
        const res = await getIdentificationField();
        expect(res.body.status).toBe(true);
        expect(res.body.identificationFields).toBeDefined();
        identificationList = res.body.identificationFields;
        let check = false;
        res.body.identificationFields.forEach((item) => {
            if (item._id == newIdentificationId) check = true;
        });

        expect(check).toBe(true);
    });

    it("Does it change status of new added field?", async () => {
        const res = await changeIdentificationStatus(newIdentificationId);
        expect(res.body.status).toBe(true);
    });

    it("check true identification field found not contain false status ?", async () => {
        const res = await getTrueIdentificationField();

        expect(res.body.status).toBe(true);
        expect(res.body.list).toBeDefined();
        let check = false;
        res.body.list.forEach((item) => {
            if (item._id == newIdentificationId) check = true;
        });
        expect(check).toBe(false);
    });

    it("Does it deleted new field?", async () => {
        const res = await deleteIdentificationField(randomId);
        expect(res.body.status).toBe(true);
    });
});

// }
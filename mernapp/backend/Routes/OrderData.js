const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
    try {
        console.log("OrderData req.body:", req.body);

        // Validate required fields
        if (!req.body.email || !req.body.order_data) {
            return res.status(400).json({ success: false, message: "Missing email or order_data" });
        }

        let data = req.body.order_data;
        if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, message: "order_data must be an array" });
        }

        data.unshift({ Order_date: req.body.order_date });

        let eId = await Order.findOne({ email: req.body.email });
        if (eId === null) {
            await Order.create({
                email: req.body.email,
                order_data: [data],
                order_date: req.body.order_date
            });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
        }
        return res.json({ success: true });
    } catch (error) {
        console.log("OrderData error:", error.message);
        return res.status(500).send("Internal server error: " + error.message);
    }
});

router.post('/myOrderData', async (req, res) => {
    try{
        let myData = await Order.findOne({ 'email': req.body.email });
        res.json({orderData:myData});
    }
    catch(error){
        res.send("Server error:", error.message);
    }
});
module.exports = router;
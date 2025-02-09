const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(express.json());

let db;
const client = new MongoClient("mongodb://localhost:27017");
client.connect()
    .then(() => {
        db = client.db("ecommerce");
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err);
    });

// 🟢 ดึงข้อมูลทั้งหมด
app.get('/product', async (req, res) => {
    try {
        const product = await db.collection("product").find().toArray();
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// 🔍 ค้นหาสินค้าตาม Topping
app.get('/product/topping/:topping', async (req, res) => {
    try {
        const topping = req.params.topping;
        const product = await db.collection("product").find({
            "topping": { $in: [{ "name": topping }] }
        }).toArray();
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products by topping" });
    }
});

// 🔍 ดึงข้อมูลสินค้าตาม ID
app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await db.collection("product").findOne({ "_id": new ObjectId(id) });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Invalid product ID" });
    }
});

// ➕ เพิ่มสินค้าใหม่
app.post('/product', async (req, res) => {
    try {
        const data = req.body;
        if (!data.name || !data.price) {
            return res.status(400).json({ error: "Name and Price are required" });
        }

        const product = await db.collection("product").insertOne(data);
        res.json({ message: "Product added successfully", product });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

// ✏️ แก้ไขข้อมูลสินค้า
app.put('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const product = await db.collection("product").updateOne(
            { "_id": new ObjectId(id) },
            { $set: data }
        );

        if (product.matchedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// 🗑️ ลบสินค้า (ใหม่)
app.delete('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("product").deleteOne({ "_id": new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server started on port 3000");
});

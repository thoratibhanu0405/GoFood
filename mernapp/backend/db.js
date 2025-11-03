const mongoose = require('mongoose');

const mongoURI = process.env.mongoURI;

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB Atlas");

    const foodItemsCollection = mongoose.connection.db.collection("food_items");
    const foodItemsData = await foodItemsCollection.find({}).toArray();

    const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");
    const foodCategoryData = await foodCategoryCollection.find({}).toArray();

    if (foodItemsData.length && foodCategoryData.length) {
      global.food_items = foodItemsData;
      global.foodCategory = foodCategoryData;
      console.log("Loaded food_items and foodCategory into global variables");
    } else {
      console.warn("⚠️ No data found in food_items or foodCategory collections");
    }

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

module.exports = mongoDB;

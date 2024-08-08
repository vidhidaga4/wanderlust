const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      'Trending',
      'Rooms',
      'Cities',
      'Mountains',
      'Castles',
      'Amazing Pools',
      'Camping',
      'Arctic',
      'Farm'
    ],
    required:true,
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

//post middleware for handling deletion of listing
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
     await Review.deleteMany({_id:{$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   writer: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true, // URL to image
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   // Optional fields (you can use them or not from frontend)
//   slug: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   tags: [String],
//   isPublished: {
//     type: Boolean,
//     default: true,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Blog', blogSchema);





// modified one with 4 images :





const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Now it can store up to 4 image URLs
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    required: true, 
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });


function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model('Blog', blogSchema);

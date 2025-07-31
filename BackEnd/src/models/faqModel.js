import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Optional: adds createdAt & updatedAt fields
  }
);

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;

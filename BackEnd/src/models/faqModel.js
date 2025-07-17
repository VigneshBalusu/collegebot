import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true }
});

faqSchema.index({ question: 'text' }); // optional full-text index

export default mongoose.model('FAQ', faqSchema);

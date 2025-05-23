import mongoose from "mongoose";

//para generar código alfanumérico
function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: generateCode,
  },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;

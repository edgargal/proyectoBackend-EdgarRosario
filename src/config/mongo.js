import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://felipe_99:281018@cluster0.pmbmkxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Conexión a MongoDB Atlas establecida");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
};

export default connectDB;

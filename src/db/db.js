import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://coder:coderpass@ecommerce-cluster.8s8ee.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Ecommerce-cluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB Atlas establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
};

export default connectDB;
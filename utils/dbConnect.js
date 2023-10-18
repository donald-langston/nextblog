import mongoose from 'mongoose'

const dbConnect = async () => {
    if(mongoose.Connection.readyState >= 1) {
        return; 
    }
    mongoose.connect(process.env.DB_URI);
}

export default dbConnect;
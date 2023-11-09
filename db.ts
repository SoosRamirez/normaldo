import mongoose from 'mongoose'

// main().catch(err => console.log(err));
//
// async function main(): Promise<void> {
//     await mongoose.connect('mongodb://127.0.0.1:27017/normaldo');
// }

class DB {
    async connect(): Promise<void> {
        await mongoose.connect('mongodb://127.0.0.1:27017/normaldo');
    }
}

export default DB
//* LIBRARY
const mongoose = require('mongoose');
const path = require('path');

//* USED LIBRARY
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const connectString = process.env.DEV_DB_MONGO_DB;

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectString);
    });

    // Close the connection to mongoose
    afterAll(async () => {
        await connection.disconnect();
    });

    it('Should connect to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('Should save a document to the database ', async () => {
        const user = new Test({ name: 'Tai Dev' });
        await user.save();
        expect(user).toBeDefined();
        expect(user.name).toBe('Tai Dev');
    });

    it('Should find a document to the database ', async () => {
        const user = await Test.findOne({ name: 'Tai Dev' });
        expect(user).toBeDefined();
        expect(user.name).toBe('Tai Dev');
    });
});

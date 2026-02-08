const { app } = require('./app.js');
const config = require('./config/config.js')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv')

dotenv.config({
    path: './env'
});

connectDB()
.then(async () => {
    app.listen(config.PORT || 4000, ()=>{
        logger.info(`Server is running on port ${config.PORT}`)
    })  
})
.catch((err)=> {
    logger.error("MongoDB connection Error ", err);
})

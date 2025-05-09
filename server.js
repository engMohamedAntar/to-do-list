//server.js
const express= require('express');
const dotenv= require('dotenv');
dotenv.config();
const PORT= process.env.PORT || 3000;
const userRoute= require('./routes/userRoute');
const authRoute= require('./routes/authRoute');
const dbConnection= require('./config/dbConnection');
const errorMiddleware= require('./middlewares/errorMiddleware');
const ApiError= require('./utils/apiError');

const app= express();
app.use(express.json());
dbConnection();

app.use('/users', userRoute);
app.use('/auth', authRoute);

//handle incorrect routes
app.all("*", (req, res, next) => {
  return next(new ApiError("This route not found", 404));
});

// Global globalError handler
app.use(errorMiddleware);

app.listen(PORT, ()=>{
    console.log(`App listened to port ${PORT}`);
})

//Handle errors outside express
process.on("uncaughtException", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  //server.close() waits for pending requests and then close
  server.close(()=>{
    console.log('Shutting down!');
    process.exit(1);
  });
});
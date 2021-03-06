import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import emoji from 'node-emoji';
import responseTime from 'response-time';
import userRouter from './routes/user';
import rateLimit from 'express-rate-limit';


dotenv.config();
const app = express();

app.use(helmet());                                // secure the server by setting various HTTP headers
app.use(express.json());                          // only parse JSON
app.use(express.urlencoded({ extended: false })); // only parse urlencoded bodies
app.use(hpp());                                   // protect against HTTP parameter pollution attacks
app.use(compression());                           // gzip/deflate/br compression outgoing responses
app.use(cookieParser());                          // parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cors());                                  // allow AJAX requests to skip the Same-origin policy and access resources from remote hosts
app.use(morgan('dev'));                           // request logger | (dev) output are colored by response status
app.use(responseTime());                          // records the response time for HTTP requests

// limit repeated requests to endpoints such as password reset
app.use(
  new rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                  // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again in 15 minutes'
  })
);

// routes
app.use('/', userRouter);

// setup ip address and port number
app.set('port', process.env.PORT || 3000);
app.set('ipaddr', '0.0.0.0');

// start express server
app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log(
    emoji.get('heart'),
    'The server is running @ ' + 'http://localhost' + app.get('port'),
    emoji.get('heart')
  );
});

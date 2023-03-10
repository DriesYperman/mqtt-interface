import express from 'express';
import path from 'path';


const APP = express();
const dirname = path.dirname(new URL(import.meta.url).pathname);

APP.use('/', express.static(dirname + '/view'));

export default APP;
// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import { apiHandler } from './../../helpers/api';
export default apiHandler(userHandler);
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)
async function userHandler(req,res){
  await cors(req, res);
  try {
    console.log("ss");
    const tmpuser = await prisma.tmpuser.findMany();
      res.status(200).json(tmpuser)

  } catch (error) {
       console.error(error);
      res.status(500).send({message: error.message?error.message:error})
  }
} 
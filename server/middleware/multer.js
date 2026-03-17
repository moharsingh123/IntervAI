import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage= multer.diskStorage({
    destination: function(req , file , cb){
        // store uploads in the server's public directory
        cb(null, path.join(__dirname, '..', 'public'))
    },
    filename:function(req,file , cb){
        const fileName= Date.now() + "" + file.originalname
        cb(null,fileName)
    }
})

 export   const upload= multer({
    storage:storage,
    limits:{fileSize:5*1024*1024}  // 5MB limit 
});
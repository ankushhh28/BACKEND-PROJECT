import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage }); //* as key: value pairs are same

//*  multer({ storage }) → Iska matlab hai ki Multer ko storage configuration ke saath initialize kar rahe hain.
//*  Isko upload naam se export kar diya taaki hum isko kisi bhi route me use kar sakein.

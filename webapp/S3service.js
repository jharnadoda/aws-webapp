const {S3} = require("aws-sdk");
const uuid = require("uuid").v4;
const AWS = require("aws-sdk");
// const AWS_BUCKET_NAME="csye-s3-bucket-jharna";
AWS.config.update({
//     accessKeyId: "AKIAX44MSPS2MTRIQY2Q",
//     secretAccessKey: "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",
    region: "us-east-1"
  });


exports.S3upload = async(file) => {
   const s3 = new S3( );

    const param={
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`, 
        Body: file.buffer
        
    }
   return  await s3.upload(param).promise();


}

exports.S3delete = async(key) => {
    const s3 = new S3();
  
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    console.log("Deleted");
    return await s3.deleteObject(params).promise();
  };

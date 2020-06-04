
require('dotenv').config()

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
//see file folder types
//eg mime.lookup('file.html')
// const mime = require('mime-types')
const fs = require('fs')
// Set the region
// AWS.config.update({region: 'REGION'})
// Create S3 service object allow us to upload to s3
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const path = require('path')

const s3Upload = function(file){
  // Configure the file stream and obtain the upload parameters
  //require filesystem

  //fileStream allow s3.upload to access our file
  const fileStream = fs.createReadStream(file.path)
  //if there was an error reading from the file print it out
  fileStream.on('error', function(err) {
    console.log('File Error', err)
  })

  //to upload something you need the following params
  //bucket - which bucket to upload to
  //key - them name or key of the data in the bucket
  //body - which data to upload

  // call S3 to retrieve upload file to specified bucket
  const uploadParams = {
  Bucket: 'toddsharon',
  Key: path.basename(file.filename),
  Body: fileStream,
  //who could read the file
  ACL: 'public-read',
  //to identify the file type automaticly
  ContentType:file.mimetype
  }

  // set the body (the content) to the fileStream
  // uploadParams.Body = fileStream


  //set the name of upload key to be the name of file
  //path.basename return the last portion of a url
  //path.basename('foo/bar/baz/asdf/quux.html')
  //return quux.html
  // uploadParams.Key = path.basename(file)

  //make sure we have access to the image
  // call S3 to retrieve upload file to specified bucket
  return s3.upload (uploadParams).promise()

}
// the first argument to our script will be the file we want to upload
// check secretkey is useful or not
// AWS.config.getCredentials(function(err) {
//   if (err) console.log(err.stack)
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId)
//     console.log("Secret access key:", AWS.config.credentials.secretAccessKey)
//   }
// })
module.exports = s3Upload

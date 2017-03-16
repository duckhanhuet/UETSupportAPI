var fs = require('fs');
var FileController=require('../controllers/FileController');
var File = require('../models/File')

module.exports ={
    //====================================================
    //function savefile and callback idFiles
    saveFile: function (files, idFiles) {
        files.forEach(function (file) {
            //console.log('file la:');
            //console.log(file)
            // Tên file
            var originalFilename = file.name;
            // File type
            var fileType         = file.type.split('/')[1];
            // File size
            var fileSize         = file.size;
            //pipe save file
            var pathUpload       = __dirname +'/../files/' + originalFilename;

            console.log('path upload la:'+pathUpload);

            //tra ve object file de luu vao database
            var objectFile ={
                tenFile: originalFilename,
                link: pathUpload
            }

            // var filet= new File()
            // filet.img.data = fs.readFileSync(pathUpload)
            // filet.img.contentType = 'image/'+fileType;
            //console.log(filet)
            // if (fileType=='png'||fileType=='jpeg'||fileType=='gif')
            // {
            // }
            //console.log('object file:'+objectFile)
            //doc file va luu file vao trong /files/

            fs.readFile(file.path, function(err, data) {
                if(!err) {
                    fs.writeFile(pathUpload, data, function() {
                        return;
                    });
                }
            });
            console.log(objectFile)
            //luu file vao database
            FileController.create(objectFile,function (err, filess) {
                if (err){
                    callback(err,null);
                }
                idFiles.push(filess._id);
                console.log('Create file success');
            })
        })
    }
//========================================================
//========================================================
}
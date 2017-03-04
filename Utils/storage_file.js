var fs = require('fs');
var FileController=require('../controllers/FileController');

module.exports ={
    //====================================================
    //function savefile and callback idFiles
    saveFile: function (files, idFiles) {
        files.forEach(function (file) {
            // Tên file
            var originalFilename = file.name;
            // File type
            var fileType         = file.type.split('/')[1];
            // File size
            var fileSize         = file.size;
            //pipe save file
            var pathUpload       = __dirname +'/../files/' + originalFilename;
            console.log('path upload la:'+pathUpload)
            //doc file va luu file vao trong /files/
            fs.readFile(file.path, function(err, data) {
                if(!err) {
                    fs.writeFile(pathUpload, data, function() {
                        return;
                    });
                }
            });
            //tra ve object file de luu vao database
            var objectFile ={
                tenFile: originalFilename,
                link: pathUpload
            }
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
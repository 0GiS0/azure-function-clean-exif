const
    execFile = require('child_process').execFile,
    exiftool = require('dist-exiftool'),
    fs = require('fs');

module.exports = function(context, myBlob) {
    context.log("Clean EXIF function is going to process this blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

    fs.writeFile(context.bindingData.name, myBlob, function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log("The file was saved in ", __dirname + '\\' + context.bindingData.name);
            execFile(exiftool, ['-all=', context.bindingData.name], (error, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${error}`);
                    return;
                }

                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);

                fs.readFile(context.bindingData.name, (err, data) => {
                    context.bindings.outBlobName = context.bindingData.name;
                    context.bindings.output = data;

                    fs.unlink(context.bindingData.name, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted ' + context.bindingData.name);
                    });

                    fs.unlink(context.bindingData.name + '_original', (err) => {
                        if (err) throw err;
                        console.log('successfully deleted ' + context.bindingData.name + '_original');
                    });

                    context.done();
                });
            });
        }
    });
};
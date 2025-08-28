const fs = require('fs');

const path = require('path');

//? Sync File Operations
//* The code waits for the file operation to complete before moving on to the next line.

// define the folder path
const folderPath = path.join(__dirname, 'data');

// creating folder
if(!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
}

// define the file path
const filePath = path.join(folderPath, 'example.txt');

// writing in file
fs.writeFileSync(filePath, 'hello');

// reading from file
const fileContent = fs.readFileSync(filePath, 'utf-8');
console.log('File content:', fileContent);

// appending to file
fs.appendFileSync(filePath, '\n new content');


//? Async File Operations
//* The file operation happens in the background, and the next line of code runs immediately.

// define the file path
const asyncFilePath = path.join(folderPath, 'asyncExample.txt');

// writing in file
fs.writeFile(asyncFilePath, 'yes this is me.', (error) => {
    if(error) {
        console.log('Error in writing file', error);
    }
});

// appending to file
fs.appendFile(asyncFilePath, '\n new async content', (error) => {
    if(error) {
    console.log("Error in appending content async", error);
    }
});

// reading from file
fs.readFile(asyncFilePath, 'utf-8',(error, data) => {
    if(error) {
        console.log('Error in reading file', error);
    }
    console.log("Async file content:", data);
});
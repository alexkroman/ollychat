const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 1. Specify your input and output directories
const inputDir = './input';    // Directory containing your JSON files
const outputDir = './filtered';  // Directory to store the filtered files

// 2. Ensure the output directory exists (if not, create it)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 3. Read all files in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  // 4. Process each file
  files.forEach((file) => {
    // (a) We only want to process .json files (or remove this check if you want all files)
    if (path.extname(file).toLowerCase() === '.json') {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, `filtered_${file}`);

      // (b) Create a read stream for the current file
      const fileStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });

      // (c) Create a write stream for the filtered file
      const writeStream = fs.createWriteStream(outputFilePath);

      // (d) Create a readline interface
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      // (e) Listen for each line, check for "expr", and write to new file if it matches
      rl.on('line', (line) => {
        if (line.includes('expr')) {
          writeStream.write(line + '\n'); // append newline
        }
      });

      // (f) When finished, close the write stream
      rl.on('close', () => {
        writeStream.end();
        console.log(`Done processing "${file}". Filtered lines saved to "${outputFilePath}"`);
      });
    }
  });
});
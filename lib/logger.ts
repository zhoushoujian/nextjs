import * as fs from 'fs';
import * as path from 'path';
import Logger from 'beauty-logger';

function checkFileExist(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, '');
  }
}

function checkFolderExist(folder: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

checkFolderExist(path.join(__dirname, '../logs'));
checkFileExist(path.join(__dirname, '../logs/LOG.log'));
checkFileExist(path.join(__dirname, '../logs/INFO.log'));
checkFileExist(path.join(__dirname, '../logs/WARN.log'));
checkFileExist(path.join(__dirname, '../logs/ERROR.log'));

const logger = new Logger({
  logFileSize: 1024 * 1024 * 50,
  logFilePath: {
    log: path.join(__dirname, '../logs/LOG.log'),
    info: path.join(__dirname, '../logs/INFO.log'),
    warn: path.join(__dirname, '../logs/WARN.log'),
    error: path.join(__dirname, '../logs/ERROR.log'),
  },
});

export default logger;

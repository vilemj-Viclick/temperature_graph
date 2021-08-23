import * as fs from 'fs';
import { writeJSON } from 'fs-extra';
import path from 'path';

export const ensureFolder = (folderName: string) => {
  if (!fs.existsSync(folderName)) {
    ensureFolder(path.join(folderName, '..'));
    fs.mkdirSync(folderName, 0o744);
  }
};


export const saveAsJson = async <TJSonObject>(obj: TJSonObject, filePath: string) => {
  return new Promise((resolve, reject) => {
    const dirName = path.dirname(filePath);
    ensureFolder(dirName);

    writeJSON(filePath, obj, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(true);
      }
    });
  });
};

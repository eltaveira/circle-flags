import fs from "node:fs/promises";
import path from "node:path";


const src = './flags';
const dest = './out_flags';
const dir = await fs.readdir(src, { encoding: 'utf-8' });

const outFolderExists = await (async () => {
  try {
    await fs.access(dest, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
})();

outFolderExists && await fs.rm(dest, { recursive: true, force: true });

await fs.mkdir(dest, { recursive: true });


for await (const file of dir) {
  const pathOfFile = path.join(src, file);
  const stat = await fs.lstat(pathOfFile);
  

  if (stat.isSymbolicLink()) {
    //delete symbolic link and create a copy of the file 'symbolicLink' with the name of the file 'file' in the out_flags folder
    const symbolicLink = await fs.readlink(pathOfFile);
    console.info(`${pathOfFile} is symbolic link to ${symbolicLink}`);
    await fs.copyFile(`${src}/${symbolicLink}`, `${dest}/${file}`);
    continue;
  }

  //copy the file to the out_flags folder
  stat.isFile() && await fs.copyFile(pathOfFile, `${dest}/${file}`);
}

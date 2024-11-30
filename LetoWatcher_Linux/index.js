import spawn from 'cross-spawn';

import  { wait, makeSignalFolders } from './utils.js';

const watchFolders = [
  '/home/letodb/Andrey/LetoDBF/bin',
  '/home/letodb/Andrey/LetoDB/bin'
]
const restartSignal = 'restart';
const runCommand = 'letodb';


const rawStartProcess = async(targetFolder, processName) => {
  await spawn(`./${processName}`, [], { cwd: `${targetFolder}` });
  console.log(`[INFO] Starting new \"${processName}\" process in folder: ${targetFolder}`);
}
const onReloadSignal = async() => {
  try {
    await spawn('killall', [runCommand]);
    await wait(1500);
    const starts = watchFolders.map((folder) => rawStartProcess(folder, runCommand));
    await Promise.all(starts);
  } catch (ex) {
    console.error(ex);
  }
}
watchFolders.map((folder) => {
  console.log(`[INFO] Watching folder: ${folder}`);
  makeSignalFolders(folder, {
    [restartSignal]() {
      console.log(`[INFO] Received restart signal in folder: ${folder}`);
      onReloadSignal();
    }
  }, { removeDelay: 2000 })
})
onReloadSignal();

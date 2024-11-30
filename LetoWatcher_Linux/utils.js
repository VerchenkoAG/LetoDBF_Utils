import * as fs from 'fs';

export const tryRemove = (path) => {
  //console.log(path);
  if (!fs.existsSync(path)) return;
  console.log('[DEBUG] Removing file: ', path);
  fs.unlinkSync(path);
}
export const wait = (time) => new Promise(resolve => setTimeout(resolve, time));

export const makeSignalFolders = (folder, signalHandlers, options = undefined) => {
  const { removeDelay=0 } = options ?? {};
  // Удаляем все старые сигналы
  Object.keys(signalHandlers).forEach((fname) => tryRemove(`${folder}/${fname}`));
  // Смотрим за новыми сигналами в папке
  fs.watch(folder, (ev, fname) => {
    const fullPath = `${folder}/${fname}`;
    if (ev !== 'rename') return;
    if (!(fname in signalHandlers)) return;
    if (!fs.existsSync(fullPath)) return;
    signalHandlers[fname]();
    if (removeDelay) wait(removeDelay).then(() => tryRemove(fullPath));
  })
}

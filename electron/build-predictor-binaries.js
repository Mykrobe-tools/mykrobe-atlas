/* @flow */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

let command, folder;

const executeCommand = command => {
  console.log(command);
  execSync(command, { stdio: [0, 1, 2] });
};

folder = path.join(__dirname, 'predictor-binaries');
if (!fs.existsSync(path.join(folder, '.git'))) {
  command = `git clone --recursive -b add-model-to-output git@github.com:iqbal-lab/Mykrobe-predictor.git ${folder}`;
} else {
  command = `cd ${folder} && git pull`;
}
executeCommand(command);

// git clone --recursive git@github.com:iqbal-lab/Mykrobe-predictor.git
// cd ./mccortex && make
// pip install git+https://github.com/Phelimb/atlas
// cd dist && pyinstaller --workpath='./pyinstaller_build/binary_cache' --distpath='./pyinstaller_build' mykrobe_predictor_pyinstaller.spec

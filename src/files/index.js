import { createProjectFile, createUserFile } from 'common/util';

import codeCpp from './skeletons/code.cpp?raw';
import codeJava from './skeletons/code.java?raw';
import codeJs from './skeletons/code.js?raw';
import rootReadme from './algorithm-visualizer/README.md?raw';
import scratchReadme from './scratch-paper/README.md?raw';
import apiReference from './api-reference.md?raw';

const readProjectFile = (name, content) => createProjectFile(name, content);
const readUserFile = (name, content) => createUserFile(name, content);

export const CODE_CPP = readUserFile('code.cpp', codeCpp);
export const CODE_JAVA = readUserFile('code.java', codeJava);
export const CODE_JS = readUserFile('code.js', codeJs);
export const ROOT_README_MD = readProjectFile('README.md', rootReadme);
export const SCRATCH_PAPER_README_MD = readProjectFile('README.md', scratchReadme);
export const API_REFERENCE_MD = apiReference;

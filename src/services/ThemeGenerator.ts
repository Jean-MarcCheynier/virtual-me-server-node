import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
const git: SimpleGit = simpleGit();
const options: Partial<SimpleGitOptions> = {
  baseDir: '/public/themes/tmp/',
  binary: 'git',
  maxConcurrentProcesses: 6,
};

class ThemeGenerator {
  
}
const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const ora = require('ora');
const { exec } = require('child_process');

const pkg = require('../package.json');

function executeCmd(cmd, dest) {
  return new Promise(res => {
    const child = exec(cmd, { cwd: dest });
    child.stdout.on('data', function (data) {
      console.info(data);
    });
    child.stderr.on('data', function (data) {
      console.warn(data);
    });
    child.on('exit', function (code) {
      console.info(`exit code: `, code);
      res();
    });
  });
}

program.version(pkg.version).name('shuyun-ssr-cli').usage('<command>').description('nextjs服务端渲染脚手架');

program
  .command('init')
  .alias('i')
  .description('初始化项目')
  .action(async function () {
    let spinner = ora('正在初始化项目...').start();
    const dest = process.cwd() + '/ssr-project';
    try {
      shell.rm('-rf', dest);
      shell.cp('-R', path.join(__dirname, './template/'), dest);
      spinner.stop();
      spinner = ora('正在安装依赖...').start();
      await executeCmd('npm i --registry=http://npm.kylin.shuyun.com/', dest);
      spinner.stop();
      console.info('done!');
    } catch (err) {
      spinner.fail(err.stack || err.toString());
      console.error('init error', err);
    }
  });

program.on('--help', function () {
  `shuyun-ssr-cli init`;
  console.log('');
  console.log('shuyun-ssr-cli init');
  console.log('');
});

program.parse(process.argv);

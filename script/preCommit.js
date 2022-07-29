const fs = require('fs');
const { AutoComplete } = require('enquirer');

const CrReset  = "\x1b[0m"
const FgYellow = "\x1b[33m"
const FgWhite  = "\x1b[1m"
const PKG_FILE     = `package.json`
const CMD_ADDFILE  = `git add .`
const debug    =(e)=> console.log(`${FgYellow}${e}${CrReset}`)
const succ     =(e)=> console.log(`${FgWhite}${e}${CrReset}`)


const cmd = async(CMD,info)=>{
  return new Promise(resolve => {
    info && debug(info)
    let params = CMD.split(' ')
    let child = spawn(params[0], params.slice(1), {
      cwd: process.cwd(),
      detached: true,
      stdio: "inherit"
    });

    child.on('error', (code) => {
      console.log('error', code)
      process.exit(1);
    });

    child.on('close', (code) => {
      if (code === 0) {
        info && succ('successful!')
        resolve()
      }else{
        process.exit(1);
      }
    });
  })
}

const getVersion = new AutoComplete({
  message: '要升级哪个版本?\n',
  choices: [
    'patch',
    'minor',
    'major',
  ]
});

const chgVer = async(index)=> {
  const data = fs.readFileSync(PKG_FILE,{encoding:'utf8', flag:'r'})
  const pkg = JSON.parse(data)
  const ver = pkg.version
  const arr = ver.split('.')
  const len = arr.length-1

  arr[index] = `${parseInt(arr[index])+1}`
  pkg.version = arr.join('.')
  const file = JSON.stringify(pkg, null, 4)
  fs.writeFileSync(PKG_FILE, file)

  debug(`version: ${pkg.version}\n`)
  succ('successful!')
}

const version = async()=> {
  const ver = await getVersion.run();

  switch(ver) {
    case 'major': chgVer(0);break;
    case 'minor': chgVer(1);break;
    case 'patch': chgVer(2);break;
  }
}

const run =async()=>{
  await version()

  await cmd(CMD_ADDFILE, null)
}

run()

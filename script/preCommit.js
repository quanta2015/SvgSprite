const fs = require('fs');
const { AutoComplete } = require('enquirer');

const CrReset  = "\x1b[0m"
const FgYellow = "\x1b[33m"
const FgWhite  = "\x1b[1m"
const PKG_FILE     = `package.json`
const debug    =(e)=> console.log(`${FgYellow}${e}${CrReset}`)
const succ     =(e)=> console.log(`${FgWhite}${e}${CrReset}`)


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
}

run()

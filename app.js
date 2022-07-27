var fs = require('fs')
var xml2js = require('xml2js');
var ps = xml2js.parseString;
var builder = new xml2js.Builder();


const PATH_SVG = 'icomoon'
const FILE_SVG = 'sprite.svg'
const FILE_JSON = 'sprite.json'
const SIZE_SVG = 20

const getPath =async(e)=>{
  return new Promise(resolve => {
    ps(e, function (err, r) {
      let np = []
      r.svg.path.map((item,i)=>{
        let {fill,...o} = item['$']
        np.push({'$': o})
      })
      resolve(np)
    })
  })
}

const patchFile = async(path,data,list)=>{
  const files = fs.readdirSync(path);

  await Promise.all(
    files.map(async(f, index) =>{
      if (f==='.DS_Store') return

      let id = f.split('.')[0]
      let d = fs.readFileSync(`${path}/${f}`)
      let p = await getPath(d)
      data.push({path: p, $: {id},})
      list.push(id)
    }) 
  )
}

const init = async() => {
  let data = []
  let list = []
  await patchFile(`${__dirname}/${PATH_SVG}`,data,list)

  console.log(list)
  let ret = { svg:{ symbol: data, $: {viewBox:`0 0 ${SIZE_SVG} ${SIZE_SVG}`,xmlns:"http://www.w3.org/2000/svg"} }}
  let xml = builder.buildObject(ret);
  fs.writeFileSync(FILE_SVG,xml)
  fs.writeFileSync(FILE_JSON,JSON.stringify(list))
}


init()

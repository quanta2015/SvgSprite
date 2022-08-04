var fs = require('fs')
var xml2js = require('xml2js');
var ps = xml2js.parseString;
var builder = new xml2js.Builder();

const SIZE_SVG   = 24
const XMLNS      = "http://www.w3.org/2000/svg"
const FILE_SVG   =(e)=> `svg/sprite_${e}.svg`
const FILE_JSON  =(e)=> `svg/sprite_${e}.json`
const NORM_SVG   = 'normal'
const THIN_SVG   = 'thin'
const SUO24_SVG  = 'suo24'
const SUO64_SVG  = 'suo64'

const getPath =async(e)=>{
  return new Promise(resolve => {
    ps(e, function (err, r) {
      let {$,title,...list}=r.svg
      resolve(list)
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
      let p = await getPath(d, id)
      
      data.push({$:{id}, ...p})
      list.push(id)
    }) 
  )
}


const init = async(file) => {
  let data = []
  let list = []
  await patchFile(`${__dirname}/src/${file}`,data,list)

  let ret = { svg: {symbol:data, $: {viewBox:`0 0 ${SIZE_SVG} ${SIZE_SVG}`,xmlns:XMLNS }}} 
  let xml = builder.buildObject(ret);
  fs.writeFileSync(FILE_SVG(file),xml)
  fs.writeFileSync(FILE_JSON(file),JSON.stringify(list))
}


init(NORM_SVG)
// init(THIN_SVG)
init(SUO24_SVG)
init(SUO64_SVG)


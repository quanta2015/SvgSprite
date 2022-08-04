# SVG Sprite
`SVG Sprite` 技术是矢量图形的最新应用模式，其优势在于：

1. 减少页面的媒体资源请求
2. 规范项目的目录结构
3. 提高前端的开发效率


### 目录结构

```
├── build.js
├── index.html
├── script
├── src
│   ├── Component      Svg 组件
│   ├── index.js       组件声明
│   ├── normal         普通 svg 库
│   ├── suo24          所思 svg 库(24pix) 
│   ├── suo64          所思 svg 库(64pix) 
│   └── thin           细长 svg 库     
├── svg                编译生成的SVG Sprite
└── tools
    ├── ColorFilter    色彩生成工具
    └── svg.js         全局注入svg
```


### 使用方法

1. 根据项目需求可以在 `src` 目录下的 `normal`、`suo24`、`suo64`和`thin`文件夹中添加 svg 图标
2. 通过执行 `node build` 将 `svg` 编译成 `SVGSprite`, 生成位置在 `svg\` 目录
3. 项目使用之前通过 `npm i suo-svg` 安装库
4. React项目可以通过 `单色` 或者 `双色` 方式进行调用,具体范例如下 



### Svg Sprite 资源文件结构
`SVG Sprite` 的结构是将原 svg 文件代码中的 `path` 和 `stroke` 对象作为 `symbol` 对象的内容引入，每个 `symbol` 对象设置一个单独的 `id` 引用。

> 注意：不能加 fill属性

```
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

  <symbol id="task">
    <path d="xxx" p-id="1940"></path>
  </symbol>

  <symbol id="user">
    <path d="xxx" p-id="2752"></path>
  </symbol>
</svg>
```


### React 引用方法
在 React 工程中，只要引入 `Svg Sprite` 资源文件，然后用下面两种方法调用：

- 单色SVG: 传入 `color`、`size`、`id` 参数即可，`size` 默认值 `100%`, `color` 默认值 `#eee`
- 双色SVG: 传入 `color`、`size`、`id` 参数，然后在 `css` 中，指定 `m-svg` 元素的 `color` 属性来控制第二种颜色，前面 `color` 是第一种颜色

```
import spr from '@/static/sprite.svg';

const Svg = ({ id, size, color, sprite }) => (
  <svg className="m-svg" fill={color} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
       <use xlinkHref={`${sprite}#${id}`} />
  </svg>
);


return (
  <>
    <Svg id={'user'} size={32} color={`#ff0000`} sprite={spr} />
  </>  
)


.m-svg {
  color: var(--clr-main);
}
```


### Svg Sprite ID
`Svg Sprite`的 ID 是根据文件名生成的，可以打开 `index.html` ，通过点击图标获取其 `ID`。



# SVG 色彩控制
除了 `SvgSprite` 之外，传统还有两种方式来使用 `Svg` 图标。


### 1. SVG 嵌入模式
在页面中插入 SVG 格式的图片，一般通过下面2种模式：

- 内嵌 `svg` 代码
- 将 `svg` 图片作为 `img` 元素的 `src`

> 其中第一种方法不推荐使用，因为会导致页面代码嵌入大量的 `svg` 图形代码。作为规范推荐使用第二种方法。


### 2. 控制色彩的方法
根据上述的两种方法，其中第一种解决方案非常简单，只要定义类似 `svg>path { fill:#666}` 的代码即可， 不做具体讨论。 下面具体讨论第二种方式，即使用 `img` 插入的 `svg` 图片链接。

#### 2.1 filter
通过设置 filter 属性控制 svg 的色彩，其原理和步骤如下：

```bash
# 1. 将白色变暗成棕褐色， 作为基色。
# 此时生成的色彩为 rgb(178, 160, 128)， 等价于 hsl(38, 24.5%, 60%)
filter: brightness(50%) sepia(1); 

# 2. 将基色转换为目标色
# 如果目标色是 #689d94， 将其转换成 hsl(170, 21.3%, 51.2%)， 计算两者的差值

H:  170 - 38             ->  132°
S:  100 + (24.5 - 21.3)  ->  103.2%  (relative to base 100% =  3.2%)
L:  100 + (51.2 - 60.0)  ->   91.2%  (relative to base 100% = -8.8%)

# 3. 将差值作为 filter 的参数

/*      ------ base color ------  -------  target color ------------------------------*/
filter: brightness(50%) sepia(1)  hue-rotate(132deg) saturate(103.2%) brightness(91.2%);
```

根据上述原理，只要将项目的 `svg` 图像都设置为白色，即 `fill: #ffffff` ,然后设置 `filter` 就可以得到相应的颜色。

> 项目的 tools 目录提供了色彩过滤工具，用来计算目标色彩


#### 2.2 load-file
定义 `load-file` 元素，将文件资源嵌入到文档的 `shadowRoot`
在页面初始化函数中，将 `shadowRoot` 的 `svg` 对象的所有 `path` 节点加上 `part` 属性
在 CSS 中通过 `::part` 伪元素，穿透 shadow DOM改变 `path` 的 `fill` 样式

```bash
# 全局的 part 属性注入
customElements.define("load-file", class extends HTMLElement {
  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
  ) {
    shadowRoot.innerHTML = await (await fetch(src)).text()
    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))

    // 注入 part 属性，穿透shadowRoot
    shadowRoot.childNodes.forEach((item,i)=>{
      if (item.nodeName==='svg') {
        item?.setAttribute("part","svg")
        Array.from(item.children).forEach((o,j)=>{
          if (o.nodeName === 'path') {
            o.setAttribute("part","path")
          }
        })
      }
    })
    this.hasAttribute("replaceWith") && this.replaceWith(...shadowRoot.childNodes)
  }
})
```


```bash
# react 代码
<load-file class="g-svg" src="https://xxx/fm-password.svg"></load-file>


# CSS 代码
.g-svg::part(svg) {
  fill: #ff6600;
}

# 全局的 part 属性注入
customElements.define("load-file", class extends HTMLElement {
  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
  ) {
    shadowRoot.innerHTML = await (await fetch(src)).text()
    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))
    // 注入 part 属性，穿透shadowRoot
    shadowRoot.childNodes.forEach((item,i)=>{
      if (item.nodeName==='svg') {
        item?.setAttribute("part","svg")
        Array.from(item.children).forEach((o,j)=>{
          if (o.nodeName === 'path') {
            o.setAttribute("part","path")
          }
        })
      }
    })
    this.hasAttribute("replaceWith") && this.replaceWith(...shadowRoot.childNodes)
  }
})

# react 代码
<load-file class="g-svg" src="https://xxx/fm-password.svg"></load-file>

# CSS 代码
.g-svg::part(svg) {
  fill: #ff6600;
}
```
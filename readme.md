# 背景
目前工程中使用的图标，大部分都是 svg类型，随着资源数据的增加，导致每个项目都要引入大量的图标文件，而且一个页面中如果有多个图片资源，也会导致多次的服务器资源请求，影响页面的加载时间。为了减少资源请求的次数，以及规范化项目的内容，采用 SVG Sprite技术，将图片资源整个成为一个 SVG文件。


### 1. 生成 Svg Sprite 资源文件
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


### 2. 引用方法
在 React 工程中，只要引入 `Svg Sprite` 资源文件，然后用下面两种方法调用：

- 1. 单色 SVG：传入 color、size、id参数即可
- 2. 双色 SVG:   传入 color、size、id参数，然后在 css 中，指定 m-svg元素的 color属性来控制第二种颜色，前面 color是第一种颜色

```
import spr from '@/static/sprite.svg';

const Svg = ({id, size, color, sprite}) => (
  <svg className="m-svg" 
       fill={color} 
       width={size} 
       height={size} 
       viewBox="0 0 1024 1024" >
    <use xlinkHref={`${spr}#${id}`} />
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
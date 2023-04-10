<script setup lang="ts">

import {onMounted} from "@vue/runtime-core";

const init = () => {
  //获取画布元素
  let cvs = document.getElementById('cvs') as any
  if (cvs) {
    let gl = cvs.getContext('webgl')
    //顶点着色器变量
    var VSHADER_SOURCE =
        //使用存储限定符定义一个接受顶点坐标的变量
        'attribute vec4 a_Position;' +
        'attribute vec4 a_Color;' +
        'varying vec4 v_Color;' +
        'void main() {' +
        //定义点的坐标并转换成变量保存
        'gl_Position = a_Position; ' +
        'v_Color = a_Color; ' +
        '} '

    //片段着色器变量
    var FSHADER_SOURCE =
        'precision mediump float;' +
        'varying vec4 v_Color;' +
        'void main() {' +
        //设置图形像素的颜色并保存
        'gl_FragColor = v_Color ;' +
        '}'

    //新建一个用于装顶点字符串的着色器对象
    var vertShader = gl.createShader(gl.VERTEX_SHADER)
    //加载保存好的顶点代码字符串变量
    gl.shaderSource(vertShader, VSHADER_SOURCE)
    //编译顶点着色器
    gl.compileShader(vertShader)

    //新建一个用于装片段字符串的着色器对象
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    //加载保存好的片段代码字符串变量
    gl.shaderSource(fragShader, FSHADER_SOURCE)
    //编译片段着色器
    gl.compileShader(fragShader)

    //新建一个程序
    var shaderProgram = gl.createProgram()

    //分别附加两个已编译好的着色器对象
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)

    //链接两个附件加好的着色器程序
    gl.linkProgram(shaderProgram)
    //开启程序的使用
    gl.useProgram(shaderProgram)
    //定义一个类型数组保存顶点坐标值
    var vertices = new Float32Array([
      //  x,   y,   red, green, blue
      0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
      1.0,
    ])
    //先创建一个缓存对象
    var vertexBuffer = gl.createBuffer()
    //说明缓存对象保存的类型
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    //写入坐标数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    //获取到数组中单个元素的字节数
    var FSIZE = vertices.BYTES_PER_ELEMENT

    //获取到顶点着色器中变量
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position')
    //将坐标值赋值给变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    //开启变量值的使用
    gl.enableVertexAttribArray(a_Position)

    //获取到顶点着色器中变量
    var a_Color = gl.getAttribLocation(shaderProgram, 'a_Color')
    //将坐标值赋值给变量
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    //开启变量值的使用
    gl.enableVertexAttribArray(a_Color)

    //绘制指定位置的图形
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}


const init2 = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 300
  canvas.height = 300
  canvas.innerText = "你的游览器不支持画布元素"

  const webglContainer = document.getElementById("webglContainer") as any
  if (webglContainer) {
    webglContainer.append(canvas)
  }

  const gl = canvas.getContext("webgl") as any
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // 创建着色器
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)

  gl.shaderSource(vertexShader,
      `attribute vec4 a_position;

      void main() {
        gl_Position = a_position;
      }
      `
  )
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(fragmentShader,
      `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
    }
  `
  )
  gl.compileShader(fragmentShader)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.useProgram(program)

  const colorLocation = gl.getUniformLocation(program, "u_color")

  gl.uniform4f(colorLocation, 0.93, 0, 0.56, 1)

  const positionLocation = gl.getAttribLocation(program, "a_position")

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0.5,
    0.5, 0
    - 0.5, -0.5
  ]), gl.STATIC_DRAW)

  gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
  )

  gl.enableVertexAttribArray(positionLocation)

  gl.clearColor(0, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(
      gl.TRIANGLES,
      0,
      3
  )


}

const init3 = () => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 300
  canvas.innerText = "你的游览器不支持画布元素"
  const webglContainer = document.getElementById("webglContainer") as any
  if (webglContainer) {
    webglContainer.append(canvas)
  }
  const gl = canvas.getContext('webgl') as any
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const program = createProgramFromSource(gl, `
        attribute vec4 aPos;
        attribute vec4 aColor;
        varying vec4 vColor;

        void main() {
          gl_Position = aPos;
          vColor = aColor;
        }
        `, `
        precision mediump float;
        varying vec4 vColor;

        void main() {
          gl_FragColor = vColor;
        }
      `)

  const points = new Float32Array([
    -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
    0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5
  ])
  const colors = new Float32Array([
    1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ])
  const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, // 前
    1, 4, 2, 4, 7, 2, // 右
    4, 5, 6, 4, 6, 7, // 后
    5, 3, 6, 5, 0, 3, // 左
    0, 5, 4, 0, 4, 1, // 上
    7, 6, 3, 7, 3, 2  // 下
  ])

  const [posLoc, posBuffer] = createAttrBuffer(gl, program, 'aPos', points)
  const [colorLoc, colorBuffer] = createAttrBuffer(gl, program, 'aColor', colors)
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(posLoc)

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(colorLoc)

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


  gl.drawElements(
      gl.TRIANGLES, // 要渲染的图元类型
      indices.length, // 要渲染的元素数量
      gl.UNSIGNED_BYTE, // 元素数组缓冲区中的值的类型
      0 // 元素数组缓冲区中的偏移量, 字节单位
  )
}

function createShader(gl: any, type: any, source: any) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader;
}

function createProgramFromSource(gl: any, vertex: any, fragment: any) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  return program
}

function createAttrBuffer(gl: any, program: any, attr: any, data: any) {
  const location = gl.getAttribLocation(program, attr)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return [location, buffer]
}

onMounted(() => {
  init3()
})


</script>

<template>
  <div id="webglContainer"></div>
</template>


<style scoped lang="scss">

</style>

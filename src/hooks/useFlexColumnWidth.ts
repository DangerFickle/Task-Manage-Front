/**遍历列的所有内容，获取最宽一列的宽度
 * @param arr
 */
function getMaxLength(arr: Array<string>) {
  return arr.reduce((acc, item) => {
    if (item) {
      const calcLen = getTextWidth(item)
      if (acc < calcLen) {
        acc = calcLen
      }
    }
    return acc
  }, 0)
}
/**
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param str
 */
function getTextWidth(str: string) {
  let width = 200
  const html = document.createElement("span")
  html.innerText = str
  html.className = "getTextWidth"
  document.querySelector("body")?.appendChild(html)
  // @ts-ignore
  width = document.querySelector(".getTextWidth")?.offsetWidth
  document.querySelector(".getTextWidth")?.remove()
  return width
}

/**
 * el-table-column 自适应列宽
 * @param data
 * @param label
 * @param prop
 */
export function flexColumnWidth(data: Array<any>, label: string, prop: string) {
  // 1.获取该列的所有数据
  const arr = data.map((x) => x[prop])
  arr.push(label) // 把每列的表头也加进去算
  // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
  return getMaxLength(arr) + 30 + "px"
}

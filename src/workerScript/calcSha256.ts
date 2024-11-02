// 导入sha256库
// @ts-ignore
import sha256 from "crypto-js/sha256"

self.onmessage = async function calcSha256(event) {
  const file = event.data
  // 等待分片读取，计算sha256完成
  let sha256Code = await new Promise(async (resolve) => {
    const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(await file.arrayBuffer()));
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    resolve(hashHex)
  })
  self.postMessage(sha256Code)
}


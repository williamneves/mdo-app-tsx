import SecureLS from "secure-ls"

let ls: any
const init = () => {
  ls = new SecureLS({
    encodingType: "aes",
    encryptionSecret: process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY,
    isCompression: false
  })
}
if (global?.localStorage) init()

export default ls

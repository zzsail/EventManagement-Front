export function alertMsg(msg, type) {
  this.$message({
    message: msg,
    type: type
  })
}

export default alertMsg

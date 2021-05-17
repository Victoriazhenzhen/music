// 格式化数据
export function formatSongDetail(val) {
  const newVal = [];
  val.forEach((item) => {
    const detail = {};
    detail.id = item.id;
    detail.al = Object.assign({}, item.al || item.album || item.song.album);
    detail.ar = [].concat(item.ar || item.artists || item.song.artists);
    detail.name = item.name;
    newVal.push(detail);
  });
  return newVal;
}

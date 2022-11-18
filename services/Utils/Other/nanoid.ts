const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export function nanoid(size: number = 8){
  let id = '';
  let i = size;
  while (i>=0) {
    id += urlAlphabet[(Math.random() * 64) | 0]
    i--;
  }
  return id
}
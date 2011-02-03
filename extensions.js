Number.prototype.pad = function(len) {
  s = num.toString();
  if (s.length < len) {
    s = ('00000000000000000000' + s).slice(-len);
  }
  return s;
};
'use strict';

const node = require('./node.js');
const { MIME_TYPES, HEADERS } = require('./constants.js');

const toBool = [() => true, () => false];

module.exports = ({ static: root, console }) => {
  const STATIC_PATH = node.path.join(node.cwd, root);

  const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = node.path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await node.fsp.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + '/404.html';
    const ext = node.path.extname(streamPath).substring(1).toLowerCase();
    const stream = node.fs.createReadStream(streamPath);
    return { found, ext, stream };
  };

  return async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { ...HEADERS, 'Content-Type': mimeType });
    console.log(`${req.method} ${req.url} ${statusCode}`);
    file.stream.pipe(res);
  };
};

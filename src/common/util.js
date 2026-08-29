const classes = (...arr) => arr.filter(v => v).join(' ');

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const extension = fileName => /(?:\.([^.]+))?$/.exec(fileName)[1];

const createSeededRandom = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const refineGist = gist => {
  const gistId = gist.id;
  const title = gist.description;
  delete gist.files['algorithm-visualizer'];
  const { login, avatar_url } = gist.owner;
  const files = Object.values(gist.files).map(file => ({
    name: file.filename,
    content: file.content,
    contributors: [{ login, avatar_url }],
  }));
  return { login, gistId, title, files };
};

const createFile = (name, content, contributors) => ({ name, content, contributors });

const createProjectFile = (name, content) => createFile(name, content, [{
  login: 'algorithm-visualizer',
  avatar_url: 'https://github.com/algorithm-visualizer.png',
}]);

const createUserFile = (name, content) => createFile(name, content, undefined);

const isSaved = ({ titles, files, lastTitles, lastFiles }) => {
  const serialize = (titles, files) => JSON.stringify({
    titles,
    files: files.map(({ name, content }) => ({ name, content })),
  });
  return serialize(titles, files) === serialize(lastTitles, lastFiles);
};

const chunkCommands = (commands = []) => {
  const chunks = [{
    commands: [],
    lineNumber: undefined,
  }];
  const queue = commands.slice();
  while (queue.length) {
    const command = queue.shift();
    const { key, method, args } = command;
    if (key === null && method === 'delay') {
      const [lineNumber] = args;
      chunks[chunks.length - 1].lineNumber = lineNumber;
      chunks.push({
        commands: [],
        lineNumber: undefined,
      });
    } else {
      chunks[chunks.length - 1].commands.push(command);
    }
  }
  return chunks;
};

export {
  classes,
  distance,
  extension,
  createSeededRandom,
  refineGist,
  createFile,
  createProjectFile,
  createUserFile,
  isSaved,
  chunkCommands,
};

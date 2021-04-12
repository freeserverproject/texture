const Builder = require('./utils/Builder.js');
const builder = new Builder('./pack');

builder.buildMeta();
builder.minify();

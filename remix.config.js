/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildPath: 'functions/[[path]].js',
  serverConditions: ['worker'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverPlatform: 'neutral',
};

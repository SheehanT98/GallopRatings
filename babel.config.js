module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = process.env.NODE_ENV === 'test';

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ]
  ];

  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins,
  };
};

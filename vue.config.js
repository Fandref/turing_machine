module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/styles/base/_index.scss";`,
            },
      },
    },
  };
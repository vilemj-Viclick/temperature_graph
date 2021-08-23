import { Application } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import path from 'path';
import {
  Compiler,
  webpack,
} from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { webpackConfig } from './webpack.config';

export const compileClient = (app: Application) => {
  const compiler = webpack(webpackConfig);

  app.use(refreshAfterInitialBuild(compiler));
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig?.output?.publicPath as string,
    writeToDisk: (pathname) => pathname.endsWith('.html'),
  }));
};

function refreshAfterInitialBuild(compiler: Compiler): RequestHandler<any> {
  const pathToClientHtml = path.join(webpackConfig?.output?.path ?? '', 'client.html');

  return (
    _req,
    res,
    next,
  ) => {
    compiler.outputFileSystem.readFile(pathToClientHtml, (err) => {
      if (!err) {
        return next();
      }

      const noClientMessage = `File ${pathToClientHtml} does not exist yet.`;
      console.log(noClientMessage);
      res.send(`
        <script>setTimeout(() => self.location.reload(), 3 * 1000)</script>
        <p align="center">${noClientMessage} Initial build takes about 3 minutes…<br />[If this page turns blank, refresh manually]</p>
      `);
    });
  };
}

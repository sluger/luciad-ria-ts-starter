//See https://github.com/webpack-contrib/raw-loader/issues/56#issuecomment-507057511 and
//https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
declare module "raw-loader!*" {
  const content: string;
  export default content;
}

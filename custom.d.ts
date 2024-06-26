declare module "*.svg?url" {
  const content: {
    src: string;
    height: number;
    width: number;
    blurWidth: number;
    blurHeight: number;
  };
  export default content;
}

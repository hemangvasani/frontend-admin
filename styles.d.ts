// For CSS
declare module "*.module.css" {
  const content: any;
  export default content;
}

// For LESS
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}


// For SCSS
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

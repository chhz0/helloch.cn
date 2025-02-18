import { EnhanceAppContext } from "vitepress";

export default ({ app }: EnhanceAppContext) => {
  const globalComponents = import.meta.glob("./components/dev/*.vue",{
    eager: true,
    import: 'default'
  });

  Object.entries(globalComponents).forEach(([path, component]) => {
    const componentName = getComponentName(path);
    // console.log(componentName);

    app.component(componentName, component);
  });
};

function getComponentName(path:string) {
  return path
  .replace(/^\.\/components\//, '')
  .replace(/\.vue$/, '')
  .split('/')
  .pop()!
  .split(/[\/-]/)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join('')
}

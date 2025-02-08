import { EnhanceAppContext } from "vitepress";

export default ({ app }: EnhanceAppContext) => {
  const globalComponents = import.meta.glob("../components/*.vue",{
    eager: true,
    import: 'default'
  });

  Object.entries(globalComponents).forEach(([path, component]) => {
    const componentName = getComponentName(path);
    app.component(componentName, component);
  });
};

function getComponentName(path:string) {
  return path
  .split('/')
  .pop()!
  .replace(/\.vue$/, '')
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join('')
}

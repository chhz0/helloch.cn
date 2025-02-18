import path from "path";
import fs from "fs";
import matter from "gray-matter";



export default function autoSidebar(baseDir: string) {
  const sidebar: any[] = [];
  const docsPath = path.join(process.cwd(), baseDir);

  const readDir = (dir: string, currentPath: string) => {
    const items = fs.readdirSync(dir);
    items.sort((a, b)=>{
      // 排序顺序
      return a.localeCompare(b)
    })

    const result: any[] = []
    items.forEach((item) => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      const relativePath = path.relative(docsPath, fullPath)

    });


  };

}

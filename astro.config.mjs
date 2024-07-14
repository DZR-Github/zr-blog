import { defineConfig, squooshImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: `zrDeng's website`,
      social: {
        discord: "https://astro.build/chat",
        github: "https://github.com/DZR-Github",
      },
      customCss: ["./src/tailwind.css"],
      sidebar: [
        {
          label: "手写题",
          items: [
            {
              label: "JavaScript基础",
              link: "/write/javascript-basics",
            },
            {
              label: "数据处理",
              link: "/write/data-processing",
            },
            {
              label: "场景应用",
              link: "/write/scenario-application",
            },
          ],
        },
        {
          label: "数据结构与算法",
          items: [
            {
              label: "排序算法",
              link: "/data-structures-and-algorithms/sorting-algorithm",
            },
          ],
        },
        {
          label: "框架",
          items: [
            {
              label: "React",
              autogenerate: { directory: "framework/react" },
            },
            {
              label: "Nextjs",
              autogenerate: { directory: "framework/next" },
            },
          ],
        },
        {
          label: "浏览器",
          autogenerate: {
            directory: "browser",
          },
        },
      ],
    }),
    tailwind({
      // 禁用默认的基础样式
      applyBaseStyles: false,
    }),
  ],
  image: {
    service: squooshImageService(),
  },
});

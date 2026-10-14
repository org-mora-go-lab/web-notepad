import { THEME_STORAGE_KEY } from "@/src/4-entity";

export function ThemeInitialization() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{document.documentElement.dataset.theme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="light"?"light":"dark"}catch{document.documentElement.dataset.theme="dark"}`,
      }}
    />
  );
}

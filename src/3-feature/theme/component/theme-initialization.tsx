import { THEME_STORAGE_KEY } from "@/src/4-entity";

export function ThemeInitialization() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var root=document.documentElement;root.dataset.theme="dark";root.style.setProperty("--font-scale","0.9");try{root.dataset.theme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="light"?"light":"dark";var stored=JSON.parse(localStorage.getItem("web-notepad-storage")||"null");var scale=stored&&stored.state&&stored.state.settings&&stored.state.settings.fontScale;if([0.8,0.9,1,1.1,1.2,1.3].includes(scale))root.style.setProperty("--font-scale",String(scale))}catch{}})()`,
      }}
    />
  );
}

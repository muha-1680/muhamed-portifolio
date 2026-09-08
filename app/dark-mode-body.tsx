"use client";

import { useSyncExternalStore } from "react";

function getDarkMode() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("darkMode") === "true";
  } catch {
    return false;
  }
}

function subscribe(_callback: () => void) {
  return () => {};
}

export default function DarkModeBody() {
  const dark = useSyncExternalStore(subscribe, getDarkMode, () => false);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(
            function(){
              try{
                var m=localStorage.getItem('darkMode')==='true';
                if(m!==${String(dark)}){
                  document.body.classList.toggle('dark-mode',m);
                }
              }catch(e){}
            })();
          `,
        }}
      />
      <div style={{ display: "contents" }}>
        {/* children of body are rendered by the layout; this div is a
            harmless placeholder so the component returns a React node. */}
      </div>
    </>
  );
}

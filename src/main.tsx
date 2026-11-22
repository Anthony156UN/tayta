import { createRoot } from "react-dom/client";
import Desktop from "./desktop";
import Mobile from "./mobile";
const root = createRoot(document.getElementById("root")!);
const small = window.matchMedia("(max-width: 767px)");
function render() {
  root.render(small.matches ? <Mobile /> : <Desktop />);
}
small.addEventListener("change", render);
render();

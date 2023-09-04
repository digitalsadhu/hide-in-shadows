import { dsdPolyfill } from "dsd-polyfill";
if (document.currentScript?.previousElementSibling) {
  dsdPolyfill(document.currentScript.previousElementSibling);
}

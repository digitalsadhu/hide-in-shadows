import http from "node:http";
import fs from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test, after } from "node:test";
import assert from "node:assert";
import { chromium, webkit, firefox } from "playwright";
import esbuild from "esbuild";
import { ssr } from "../server.js";
import App from "./app.js";
import AppWithProps from "./app-with-props.js";
import AppWithUrlProp from "./app-with-url-prop.js";
const __dirname = new URL(".", import.meta.url).pathname;

const build = async (path) => {
  const result = await esbuild.build({
    resolveExtensions: [".js", ".jsx"],
    legalComments: "none",
    entryPoints: [join(__dirname, path)],
    charset: "utf8",
    plugins: [],
    target: "esnext",
    bundle: true,
    format: "esm",
    outdir: `${tmpdir()}/podlet-name`,
    minify: true,
    write: false,
  });
  return result.outputFiles[0].text;
};

let template = "";
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>${template}</body>
    </html>
  `);
});
server.listen(3333, "0.0.0.0");

test("tests", async (t) => {
  after(() => {
    server.close();
  });

  await test("Server rendered React app with hydration", async (t) => {
    await t.test("Basic case", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", App)}
        <script type="module">${await build("./ssr-with-hydration.js")}</script>
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Polyfill for browsers that don't support DSD: Safari", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", App)}
        <script type="module">${await build("./ssr-with-hydration.js")}</script>
      `;

      const browser = await webkit.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });
    
    await t.test("Polyfill for browsers that don't support DSD: Firefox", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", App)}
        <script type="module">${await build("./ssr-with-hydration.js")}</script>
      `;

      const browser = await firefox.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Using props", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", AppWithProps, {
          props: { title: "Hello, world!" },
        })}
        <script type="module">${await build(
          "./ssr-with-hydration-and-props.js"
        )}</script>
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Using a reviver", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", AppWithUrlProp, {
          props: { url: new URL("https://example.com") },
        })}
        <script type="module">${await build(
          "./ssr-with-hydration-and-url-prop.js"
        )}</script>
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("div#url");
      const title = await page.$eval("div#url", (e) => e.textContent);
      assert.strictEqual(title, "https://example.com/");
      const initialDisplay = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval(
        "p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Including inline styles", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", App, {
          styles: await fs.readFile(join(__dirname, "./styles.css"), "utf8"),
        })}
        <script type="module">${await build(
          "./ssr-with-hydration.js"
        )}</script>
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      const styles = await page.$eval("hide-in-shadows-example-1 style", (e) => e.textContent);
      assert.strictEqual(styles, "h1 {\n    background-color: hotpink;\n}");
      await browser.close();
    });
  });

  await test("Multiple React apps on the same page", async (t) => {
    await t.test("Basic case", async () => {
      template = `
        ${ssr("hide-in-shadows-example-1", App)}
        ${ssr("hide-in-shadows-example-2", App)}
        <script type="module">${await build(
          "./multiple-ssr-with-hydration.js"
        )}</script>
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("hide-in-shadows-example-1");
      const title1 = await page.$eval("hide-in-shadows-example-1 h1", (e) => e.textContent);
      const title2 = await page.$eval("hide-in-shadows-example-2 h1", (e) => e.textContent);
      assert.strictEqual(title1, "Hello, world!");
      assert.strictEqual(title2, "Hello, world!");
      
      const initialDisplay1 = await page.$eval(
        "hide-in-shadows-example-1 p#click-display",
        (e) => e.textContent
      );
      const initialDisplay2 = await page.$eval(
        "hide-in-shadows-example-2 p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay1, "You clicked 0 times");
      assert.strictEqual(initialDisplay2, "You clicked 0 times");

      await page.locator("hide-in-shadows-example-1 button").click();
      const locator = await page.locator("hide-in-shadows-example-2 button");
      await locator.click();
      await locator.click();
      const displayAfterClick1 = await page.$eval(
        "hide-in-shadows-example-1 p#click-display",
        (e) => e.textContent
      );
      const displayAfterClick2 = await page.$eval(
        "hide-in-shadows-example-2 p#click-display",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick1, "You clicked 1 times");
      assert.strictEqual(displayAfterClick2, "You clicked 2 times");
      await browser.close();
    });
  });
});

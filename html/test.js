import http from "node:http";
import { test, after } from "node:test";
import assert from "node:assert";
import { chromium, webkit, firefox } from "playwright";
import { wrap } from "./server.js";

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

  await test("Wrapped app", async (t) => {
    await t.test("Basic case", async () => {
      template = `
        ${wrap(
          "example-one",
          `
          <h1>Hello, world!</h1>
          <p>You clicked <span id="click-display">0</span> times</p>
          <button>Click me</button>
          <script>
          const root = document.querySelector("example-one").shadowRoot;
          const button = root.querySelector("button");
          button.onclick = () => {
            const display = root.querySelector("#click-display");
            const count = parseInt(display.innerText, 10);
            display.innerText = count + 1;
          };
          </script>
        `
        )}
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Browsers that don't support DSD: Firefox", async () => {
      template = `
        ${wrap(
          "example-one",
          `
          <h1>Hello, world!</h1>
          <p>You clicked <span id="click-display">0</span> times</p>
          <button>Click me</button>
          <script>
          const root = document.querySelector("example-one").shadowRoot;
          const button = root.querySelector("button");
          button.onclick = () => {
            const display = root.querySelector("#click-display");
            const count = parseInt(display.innerText, 10);
            display.innerText = count + 1;
          };
          </script>
        `
        )}
      `;

      const browser = await firefox.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });

    await t.test("Browsers that don't support DSD: Safari", async () => {
      template = `
        ${wrap(
          "example-one",
          `
          <h1>Hello, world!</h1>
          <p>You clicked <span id="click-display">0</span> times</p>
          <button>Click me</button>
          <script>
          const root = document.querySelector("example-one").shadowRoot;
          const button = root.querySelector("button");
          button.onclick = () => {
            const display = root.querySelector("#click-display");
            const count = parseInt(display.innerText, 10);
            display.innerText = count + 1;
          };
          </script>
        `
        )}
      `;

      const browser = await webkit.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("h1");
      const title = await page.$eval("h1", (e) => e.textContent);
      assert.strictEqual(title, "Hello, world!");
      const initialDisplay = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(initialDisplay, "You clicked 0 times");
      await page.locator("button").click();
      const displayAfterClick = await page.$eval("p", (e) => e.textContent);
      assert.strictEqual(displayAfterClick, "You clicked 1 times");
      await browser.close();
    });
  });

  await test("Multiple wrapped apps on the same page", async (t) => {
    await t.test("Basic case", async () => {
      template = `
        ${wrap(
          "example-one",
          `
        <h1>Example 1</h1>
        <p>You clicked <span id="click-display">0</span> times</p>
        <button>Click me</button>
        <script type="module">
        const root = document.querySelector("example-one").shadowRoot;
        const button = root.querySelector("button");
        button.addEventListener("click", () => {
          const display = root.querySelector("#click-display");
          const count = parseInt(display.innerText, 10);
          display.innerText = count + 1;
        });
        </script>
      `
        )}
      ${wrap(
        "example-two",
        `
        <h1>Example 2</h1>
        <p>You clicked <span id="click-display">0</span> times</p>
        <button>Click me</button>
        <script type="module">
        const root = document.querySelector("example-two").shadowRoot;
        const button = root.querySelector("button");
        button.addEventListener("click", () => {
          const display = root.querySelector("#click-display");
          const count = parseInt(display.innerText, 10);
          display.innerText = count + 1;
        });
        </script>
      `
      )}
      `;

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:3333");
      await page.waitForSelector("example-one");
      const title1 = await page.$eval("example-one h1", (e) => e.textContent);
      const title2 = await page.$eval("example-two h1", (e) => e.textContent);
      assert.strictEqual(title1, "Example 1");
      assert.strictEqual(title2, "Example 2");

      const initialDisplay1 = await page.$eval(
        "example-one p",
        (e) => e.textContent
      );
      const initialDisplay2 = await page.$eval(
        "example-two p",
        (e) => e.textContent
      );
      assert.strictEqual(initialDisplay1, "You clicked 0 times");
      assert.strictEqual(initialDisplay2, "You clicked 0 times");

      await page.locator("example-one button").click();
      const locator = await page.locator("example-two button");
      await locator.click();
      await locator.click();
      const displayAfterClick1 = await page.$eval(
        "example-one p",
        (e) => e.textContent
      );
      const displayAfterClick2 = await page.$eval(
        "example-two p",
        (e) => e.textContent
      );
      assert.strictEqual(displayAfterClick1, "You clicked 1 times");
      assert.strictEqual(displayAfterClick2, "You clicked 2 times");
      await browser.close();
    });
  });
});

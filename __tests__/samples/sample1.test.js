// @vitest-environment jsdom
import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import path from 'path';

it('should run scripts dangerously from HTML inside the test', () => {
    const html = `<body>
  <div id="content"></div>
  <script>document.getElementById("content").append(document.createElement("hr"));</script>
</body>`
    const options = { runScripts: "dangerously" };
    const dom = new JSDOM(html, options);

    // The script will be executed and modify the DOM:
    // console.log(dom.window.document.getElementById("content").children.length); // 1
    const actual = dom.window.document.querySelector('hr');
    expect(actual).toBeDefined();
});

it('should run scripts dangerously from HTML loaded from a file', async () => {
    const options = { runScripts: "dangerously" };
    let dom = undefined;
    const filePath = path.join(process.cwd(), '__tests__', 'samples', 'sample1.html');
    await JSDOM.fromFile(filePath, options).then(result => dom = result);
    expect(dom).toBeDefined();
    const actual = dom.window.document.querySelector('hr');
    expect(actual).toBeDefined();
})


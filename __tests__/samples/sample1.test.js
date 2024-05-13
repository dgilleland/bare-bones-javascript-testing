// NOTE: We are not using a global window or document in these tests
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import path from 'path';

describe('HTML string with inline script within JSDOM', () => {
    let dom = undefined;
    const html = `<body>
  <div id="content"></div>
  <script>
    const span = document.createElement("span");
    span.innerText = "words";
    const div = document.getElementById("content");
    div.append(span);
  </script>
</body>`

    it('should have an undefined DOM to start', () => {
        expect(dom).toBeUndefined();
    })

    describe('having script execution disabled (JSDOM default)', () => {
        beforeEach(() => {
            dom = new JSDOM(html);
        });

        it('should have a div without children', () => {
            const div = dom.window.document.getElementById("content");
            expect(div.children.length).toBe(0)
        });
    });

    describe('running scripts dangerously', () => {
        beforeEach(() => {
            const options = { runScripts: "dangerously" };
            dom = new JSDOM(html, options);
        });
    
        it('should have a div with a child', () => {
            const div = dom.window.document.getElementById("content");
            expect(div.children.length).toBe(1)
        });

        it('should have a span with a word inside the div', () => {
            const div = dom.window.document.getElementById("content");
            const span = div.querySelector('span');
            expect(span.innerText).toBe('words');
        })
    });
})

describe('HTML file with inline script loaded by JSDOM', async () => {
    let dom = undefined;
    const filePath = path.join(process.cwd(), '__tests__', 'samples', 'sample1.html');

    it('should have an undefined DOM to start', () => {
        expect(dom).toBeUndefined();
    })

    describe('having script execution disabled (JSDOM default)', async () => {
        beforeEach(async () => {
            await JSDOM.fromFile(filePath).then(result => dom = result);
        });

        it('should have a div without children', () => {
            const div = dom.window.document.getElementById("content");
            expect(div.children.length).toBe(0)
        });
    });

    describe('running scripts dangerously', async() => {
        beforeEach(async () => {
            const options = { runScripts: "dangerously" };
            await JSDOM.fromFile(filePath, options).then(result => dom = result);
        });
    
        it('should have a div with a child', () => {
            const div = dom.window.document.getElementById("content");
            expect(div.children.length).toBe(1)
        });

        it('should have a span with more words inside the div', () => {
            const div = dom.window.document.getElementById("content");
            const span = div.querySelector('span');
            expect(span.innerText).toBe('more words');
        })

    })
});

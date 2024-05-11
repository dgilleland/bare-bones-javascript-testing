// @vitest-environment jsdom
import { test, expect } from 'vitest'

test('smoke test', () => {
    expect(window).toBeDefined();
})
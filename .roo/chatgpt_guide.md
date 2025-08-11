Yes, in a standard **HTML + JavaScript** setting (e.g., running in the browser), you have full access to the URL **the user used to reach your page**, and **you can also modify it** — all without any server or external service.

---

### ✅ Accessing URL and Query Parameters

You can use the `window.location` object:

```js
const url = window.location.href; // full URL
const params = new URLSearchParams(window.location.search); // query string parameters

const value = params.get("key"); // get value of ?key=value
```

**Example:**

If the user visits:

```
https://example.com/page.html?user=alice&debug=true
```

You can get:

```js
params.get("user"); // "alice"
params.get("debug"); // "true"
```

---

### ✅ Changing the URL (without reloading)

You can modify the browser's URL using the **History API**, without causing a page reload:

```js
history.pushState(null, "", "?user=bob&theme=dark");
```

This updates the address bar to:

```
https://example.com/page.html?user=bob&theme=dark
```

The page doesn't reload — this is ideal for SPAs (single-page applications) or for tracking user state.

You can also replace the current URL (instead of pushing a new one):

```js
history.replaceState(null, "", "?user=charlie");
```

---

### 🔒 Limitations

* You **can't change the domain** (e.g., from `example.com` to `othersite.com`) — only the **path**, **query**, and **hash**.
* Changes don't reload the page unless you explicitly trigger a reload (`location.reload()`).

---

### ✅ Access Hash (Fragment) Part

```js
window.location.hash // e.g. "#section2"
```

And you can update it easily:

```js
window.location.hash = "newSection";
```

---

Let me know if you're targeting a specific platform (like a webview, embedded iframe, or mobile PWA) — some of the above may vary slightly.

# Twisted Loops

A small static website for **twistedloops.co.in** — home, shop, and about pages with a cart + Razorpay checkout.

## Quick start

It's plain HTML/CSS/JS. Just open `index.html` in a browser, or run any static server:

```bash
# any of these work from the project root
python3 -m http.server 5173
# or
npx serve .
```

Then visit <http://localhost:5173>.

## Project structure

```
/
├── index.html         # Home
├── shop.html          # Shop (product grid + filters)
├── about.html         # About
├── css/style.css      # All styling
├── js/
│   ├── config.js      # Edit: Razorpay key + brand info
│   ├── products.js    # Edit: your product catalog
│   ├── cart.js        # Cart + checkout logic
│   ├── shop.js        # Shop page rendering + filters
│   └── main.js        # Shared UI (nav, newsletter, year)
└── images/            # Drop your own product photos here
```

## Edit your products

Open `js/products.js` and update the array. Each product needs:

```js
{
  id: "tl-unique-id",       // keep stable; used by the cart
  name: "Olive Bucket Bag",
  price: 1999,              // in INR (whole rupees)
  category: "bags",         // becomes a filter chip on the shop page
  image: "images/olive-bucket.jpg",
  badge: "new",             // optional, e.g. "bestseller"
  description: "..."
}
```

Any new category you add automatically becomes a filter chip at the top of the shop page.

## Replace the placeholder photos

The site currently uses stock photos from Unsplash. To use your own:

1. Drop images into the `images/` folder (recommend 1200px wide, JPG/WEBP).
2. In `js/products.js`, change each `image: "..."` to the local path (e.g. `images/olive-bucket.jpg`).
3. In `index.html`, the hero and gallery images are inline — swap the Unsplash URLs for `images/your-file.jpg`.

## Set up payments (Razorpay)

Razorpay is the easiest India-first option. Both test and live keys are supported.

1. Sign up at <https://dashboard.razorpay.com> and complete KYC.
2. Go to **Settings → API Keys** and generate a key.
3. Open `js/config.js` and paste your **Key ID**:

   ```js
   razorpayKeyId: "rzp_test_XXXXXXXXXXXX"
   ```

4. Reload the site and add something to the bag → the checkout will open.

### Test cards

In **test mode** you can use:

- Card: `4111 1111 1111 1111`
- Expiry: any future date · CVV: any 3 digits · OTP: any 6 digits

### Going live (recommended)

For production you should create a Razorpay **Order** on a server using your **Key Secret** and pass its `order_id` into the checkout. This prevents clients from tampering with the amount.

A minimal Node/Express endpoint looks like:

```js
import Razorpay from "razorpay";
const rzp = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });

app.post("/api/orders", async (req, res) => {
  const order = await rzp.orders.create({
    amount: req.body.amount, // paise
    currency: "INR",
    receipt: "tl_" + Date.now(),
  });
  res.json(order);
});
```

Then in `js/cart.js` inside `openCheckout()`, fetch `/api/orders` first and pass `order_id: order.id` into the `options` object. Also verify `razorpay_signature` in your webhook before shipping the order.

If you'd prefer not to run a server at all, two simpler alternatives:

- **Razorpay Payment Button** — generate a per-product button in your dashboard and paste its embed code into the shop card. Good for a handful of SKUs.
- **Razorpay Payment Links** — generate a link per order and email it to the customer manually. Great for made-to-order items with variable shipping.

## Deploy

Any static host works since there's no backend. Easiest options:

- **Netlify / Vercel** — drag the folder into the dashboard, point `twistedloops.co.in` at the generated domain.
- **Cloudflare Pages** — connect a git repo and deploy on push.
- **GitHub Pages** — push to `main`, enable Pages on the repo.

Make sure to also:

- Add a `favicon.ico` to the root.
- Replace `og:image` and SEO meta tags with your real brand photography.
- Add Google Analytics / Plausible if you want visitor stats.

## Credits

Built as a static site inspired by minimal fashion-studio layouts. Typography uses Playfair Display, Cormorant Garamond, and Jost from Google Fonts.

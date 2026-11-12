/* Twisted Loops — product catalog
   Edit prices, names, images, or add more items freely.
   Prices are in INR (paise is handled at checkout). */

window.PRODUCTS = [
  {
    id: "tl-tote-sage",
    name: "Sage Everyday Tote",
    price: 1899,
    category: "totes",
    badge: "bestseller",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80",
    description: "A roomy hand-crocheted tote in sage cotton yarn. Fits a laptop, a book, and your lunch."
  },
  {
    id: "tl-bag-blush",
    name: "Blush Shoulder Bag",
    price: 1499,
    category: "bags",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80",
    description: "Soft blush shoulder bag with a lined interior and magnetic clasp."
  },
  {
    id: "tl-mini-mustard",
    name: "Mustard Mini Pouch",
    price: 899,
    category: "pouches",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    description: "A pocket-sized zip pouch in warm mustard — perfect for cards, kohl, and keys."
  },
  {
    id: "tl-granny-rose",
    name: "Granny-Square Rose Bag",
    price: 2199,
    category: "bags",
    badge: "new",
    image: "https://images.unsplash.com/photo-1609702078237-68f4c82fdd07?auto=format&fit=crop&w=1000&q=80",
    description: "Classic granny-square patchwork in rose, ivory, and olive — fully lined."
  },
  {
    id: "tl-market-cream",
    name: "Cream Market Bag",
    price: 1299,
    category: "totes",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80",
    description: "Lightweight net-stitch market bag in natural cream cotton. Stretches to hold a week of groceries."
  },
  {
    id: "tl-bucket-olive",
    name: "Olive Bucket Bag",
    price: 1999,
    category: "bags",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80",
    description: "Deep olive bucket with drawstring top and a crochet shoulder strap."
  },
  {
    id: "tl-coasters-set",
    name: "Pastel Coaster Set (4)",
    price: 599,
    category: "home",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
    description: "A set of four hand-crocheted coasters in a soft pastel palette."
  },
  {
    id: "tl-scrunchie-trio",
    name: "Scrunchie Trio",
    price: 499,
    category: "pouches",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=1000&q=80",
    description: "Three crochet scrunchies in blush, olive, and cream. Gentle on hair."
  },
  {
    id: "tl-tote-terracotta",
    name: "Terracotta Beach Tote",
    price: 1699,
    category: "totes",
    image: "https://images.unsplash.com/photo-1596149615493-f0739de31c2d?auto=format&fit=crop&w=1000&q=80",
    description: "Oversized beach tote in sun-warmed terracotta with a long shoulder strap."
  }
];

window.formatINR = function (amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
};

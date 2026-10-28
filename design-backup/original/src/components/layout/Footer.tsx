import Link from 'next/link';

const FOOTER_LINKS = [
  {
    heading: 'Help',
    links: [
      { href: '/delivery', label: 'Delivery Information' },
      { href: '/returns', label: 'Returns' },
      { href: '/size-guide', label: 'Size Guide' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
  {
    heading: 'Abuja Gentleman',
    links: [
      { href: '/about', label: 'About' },
      { href: '/the-club', label: 'The Club' },
      { href: '/partner-brands/apply-to-sell', label: 'Sell on Abuja Gentleman' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-ivory">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">Abuja Gentleman</p>
          <p className="mt-2 text-sm text-ivory/70">
            Native and English wear, footwear, fragrance and accessories — one wardrobe,
            one cart.
          </p>
        </div>
        {FOOTER_LINKS.map((column) => (
          <div key={column.heading}>
            <p className="label-utility text-gold">{column.heading}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/80 hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10 py-4 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} Abuja Gentleman. All rights reserved.
      </div>
    </footer>
  );
}

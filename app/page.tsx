"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Poppins } from "next/font/google"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import {
  ChevronRight,
  Star,
  Download,
  Mail,
  Phone,
  MessageCircle,
  History,
  Instagram,
  Facebook,
  ExternalLink,
  MapPin,
  Gem,
  Sparkles,
  Heart,
  Gift,
  Copy,
  Check,
  X,
  BadgeCheck,
  Hand,
  Package,
  Clock,
  ShoppingBag,
  CalendarDays,
  FileText,
} from "lucide-react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

/* ------------------------------------------------------------------ */
/*  BRAND TOKENS                                                       */
/*  #903535 is Anaar's theme colour (read from shopanaar.com).          */
/*  Gold / ivory / ink are proposed and must be confirmed with Anaar.   */
/* ------------------------------------------------------------------ */
const GOLD_FOIL = "linear-gradient(135deg,#F1DDA0 0%,#C9A24B 38%,#A9822F 62%,#E7CF8E 100%)"
const HERO_BG =
  "radial-gradient(120% 90% at 50% 0%, #7A2A30 0%, #5A1D25 45%, #3A1218 100%)"

/* Optional: set to the real Anaar logo (gold, transparent PNG/SVG). Falls back to a wordmark. */
const LOGO_SRC = ""

/* Boutique details — replace with the store's real values before going live. */
const STORE = {
  name: "Anaar",
  gstin: "29XXXXXXXXXX1Z5",
  locatorUrl: "https://shopanaar.com/pages/store",
}

const BRAND = {
  site: "https://shopanaar.com",
  instagram: "https://www.instagram.com/worldofanaar/",
  facebook: "https://www.facebook.com/shopanaar",
  whatsapp: "https://wa.me/918655978333",
  phone: "tel:+918655978333",
  phoneLabel: "+91 86559 78333",
  email: "mailto:customercare@anaar.in",
  returnPolicy: "https://shopanaar.com/pages/return-policy",
  terms: "https://shopanaar.com/pages/terms-of-services",
}

const GST_RATE = 0.18 // footwear priced above ₹2,500 per pair

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const r2 = (n: number) => Math.round(n * 100) / 100
const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmt0 = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
  "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
]
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
const two = (n: number) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ""))
const three = (n: number) =>
  (n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : "") + (n % 100 ? two(n % 100) : "")

function inrWords(amount: number) {
  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)
  const crore = Math.floor(rupees / 10000000)
  const lakh = Math.floor(rupees / 100000) % 100
  const thousand = Math.floor(rupees / 1000) % 100
  const rest = rupees % 1000
  const parts = [
    crore ? `${three(crore)} Crore` : "",
    lakh ? `${two(lakh)} Lakh` : "",
    thousand ? `${two(thousand)} Thousand` : "",
    rest ? three(rest) : "",
  ].filter(Boolean)
  const rupeeText = `${parts.join(" ") || "Zero"} Rupees`
  return paise ? `${rupeeText} and ${two(paise)} Paise Only` : `${rupeeText} Only`
}

/* ------------------------------------------------------------------ */
/*  DATA  (SKUs / HSN from Anaar's product list; prices from the site)  */
/*  Sizes are illustrative: the list does not map SKU to size.          */
/* ------------------------------------------------------------------ */
type RawItem = {
  id: number
  name: string
  category: string
  size: string
  sku: string
  hsn: string
  price: number
  qty: number
}
type RawReceipt = {
  id: string
  date: string
  time: string
  associate: string
  payment: string
  items: RawItem[]
}

const RAW_RECEIPTS: Record<string, RawReceipt> = {
  current: {
    id: "ANR100326101400421",
    date: "14-10-2026",
    time: "12:41:18",
    associate: "Meera Nair",
    payment: "Google Pay · UPI",
    items: [
      { id: 0, name: "Marilyn Wedge Sneakers", category: "Wedge Sneakers", size: "38", sku: "8904430800754", hsn: "64022090", price: 11990, qty: 1 },
      { id: 1, name: "Raanjhan Platform Sandals", category: "Platforms", size: "39", sku: "8904430816694", hsn: "64022090", price: 14990, qty: 1 },
      { id: 2, name: "Hyderabad Heera Ballerinas", category: "Ballerinas", size: "37", sku: "8904430836609", hsn: "64041990", price: 4990, qty: 1 },
    ],
  },
  hist1: {
    id: "ANR100326091700318",
    date: "17-09-2026",
    time: "18:05:42",
    associate: "Ritu Sharma",
    payment: "Visa •••• 4532",
    items: [
      { id: 0, name: "Boogie Woogie Classic Sneakers", category: "Flat Sneakers", size: "38", sku: "8904430807708", hsn: "64022090", price: 8990, qty: 1 },
      { id: 1, name: "Jaipur Johari Ballerinas", category: "Ballerinas", size: "36", sku: "8904430836388", hsn: "64041990", price: 3990, qty: 1 },
    ],
  },
  hist2: {
    id: "ANR100326072200207",
    date: "22-07-2026",
    time: "15:27:09",
    associate: "Meera Nair",
    payment: "Google Pay · UPI",
    items: [
      { id: 0, name: "Disco 22 Signature Wedge Sneakers", category: "Wedge Sneakers", size: "38", sku: "8904430800846", hsn: "64022090", price: 9990, qty: 1 },
    ],
  },
}

function buildReceipt(raw: RawReceipt) {
  const items = raw.items.map((it) => {
    const line = it.price * it.qty
    const base = r2(line / (1 + GST_RATE))
    return { ...it, line, base, gst: r2(line - base) }
  })
  const total = items.reduce((s, i) => s + i.line, 0)
  const subtotal = r2(items.reduce((s, i) => s + i.base, 0))
  const tax = r2(total - subtotal)
  const cgst = r2(tax / 2)
  const sgst = r2(tax - cgst)
  return { ...raw, items, total, subtotal, tax, cgst, sgst }
}
type Receipt = ReturnType<typeof buildReceipt>

const RECEIPTS: Record<string, Receipt> = {
  current: buildReceipt(RAW_RECEIPTS.current),
  hist1: buildReceipt(RAW_RECEIPTS.hist1),
  hist2: buildReceipt(RAW_RECEIPTS.hist2),
}

const OCCASIONS = [
  { label: "Wedding", url: "https://shopanaar.com/collections/wedding-footwear-essentials-for-women" },
  { label: "Sangeet / Cocktail", url: "https://shopanaar.com/collections/sangeet-cocktail-footwear-essentials-for-women" },
  { label: "Haldi / Mehendi", url: "https://shopanaar.com/collections/haldi-mehendi-footwear-essentials-for-women" },
  { label: "Engagement / Reception", url: "https://shopanaar.com/collections/engagement-reception-footwear-essentials-for-women" },
  { label: "Honeymoon", url: "https://shopanaar.com/collections/honeymoon-footwear-essentials-for-women" },
  { label: "Everyday", url: "https://shopanaar.com/collections/everyday-essentials" },
]

const COMPLETE_THE_LOOK = [
  { name: "Seaside Dazzler", kind: "Mobile Chain", price: 4990, url: "https://shopanaar.com/collections/mobile-chains", Icon: Gem },
  { name: "Tribe Slingette", kind: "Clutch", price: 11990, url: "https://shopanaar.com/products/tribe-slingette-clutch", Icon: ShoppingBag },
  { name: "Maharani Glow", kind: "Charm", price: 1200, url: "https://shopanaar.com/collections/charms", Icon: Sparkles },
  { name: "Golden Alphabet", kind: "Charm", price: 150, url: "https://shopanaar.com/collections/charms", Icon: Heart },
  { name: "Luna Mini Dazzler", kind: "Chain", price: 1990, url: "https://shopanaar.com/collections/mobile-chains", Icon: Gem },
]

const CARE_TIPS = [
  "Keep your pair in the dust bag it came in, away from direct sunlight.",
  "Wipe gently with a soft, dry cloth. Avoid water on embroidery and embellishments.",
  "Rotate between pairs so the cushioning and shape stay fresh.",
]

/* ------------------------------------------------------------------ */
/*  SMALL PRESENTATIONAL PIECES                                        */
/* ------------------------------------------------------------------ */
function GoldText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{ backgroundImage: GOLD_FOIL, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
    >
      {children}
    </span>
  )
}

function Diamond({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rotate-45 bg-[#C9A24B] ${className}`} />
}

function SectionTitle({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B08A35]">
          <Diamond />
          {eyebrow}
        </div>
        <h3 className="mt-1.5 text-[21px] font-light leading-tight tracking-[0.01em] text-[#2A1A1A]">{title}</h3>
      </div>
      {right}
    </div>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`mx-3 rounded-[28px] border border-[#E9DFCF] bg-[#FFFDF8] shadow-[0_14px_34px_-22px_rgba(58,18,24,0.45)] ${className}`}
    >
      {children}
    </section>
  )
}

function GoldRule() {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A24B]/70 to-transparent" />
      <Diamond />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A24B]/70 to-transparent" />
    </div>
  )
}

function JaliPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]" aria-hidden="true">
      <defs>
        <pattern id="anaarJali" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M19 2 L36 19 L19 36 L2 19 Z" fill="none" stroke="#E7CF8E" strokeWidth="0.8" />
          <path d="M19 10 L28 19 L19 28 L10 19 Z" fill="none" stroke="#E7CF8E" strokeWidth="0.6" />
          <circle cx="19" cy="19" r="1.8" fill="#E7CF8E" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#anaarJali)" />
    </svg>
  )
}

/* A stylised pomegranate with a crown — the "anaar" — drawn in gold foil */
function Pomegranate({ size = 96 }: { size?: number }) {
  const seeds: Array<[number, number]> = [
    [42, 52], [50, 48], [58, 52], [38, 62], [46, 60], [54, 60], [62, 62], [42, 70], [50, 68], [58, 70], [50, 77],
  ]
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="anaarFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1DDA0" />
          <stop offset="45%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#A9822F" />
        </linearGradient>
      </defs>
      <path d="M38 34 L42 24 L46 31 L50 22 L54 31 L58 24 L62 34 Z" fill="none" stroke="url(#anaarFoil)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M50 35 C30 35 22 52 26 66 C30 80 42 86 50 86 C58 86 70 80 74 66 C78 52 70 35 50 35 Z" fill="none" stroke="url(#anaarFoil)" strokeWidth="1.8" />
      {seeds.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="url(#anaarFoil)" opacity={0.9} />
      ))}
    </svg>
  )
}

/* Circular "paid" seal — original, pomegranate-crown mark */
function PaidSeal() {
  return (
    <svg viewBox="0 0 100 100" width="56" height="56" className="shrink-0" style={{ transform: "rotate(-10deg)" }} aria-label="Paid">
      <defs>
        <linearGradient id="anaarSealFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1DDA0" />
          <stop offset="50%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#A9822F" />
        </linearGradient>
        <path id="anaarSealTop" d="M 14,50 A 36,36 0 1,1 86,50" fill="none" />
        <path id="anaarSealBottom" d="M 14,53 A 36,36 0 1,0 86,53" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="url(#anaarSealFoil)" strokeWidth="2" strokeDasharray="2.4 3.2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#anaarSealFoil)" strokeWidth="1" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="url(#anaarSealFoil)" strokeWidth="0.8" />
      <text fontSize="6.2" fontWeight="600" fill="#E7CF8E" letterSpacing="1.6">
        <textPath href="#anaarSealTop" startOffset="50%" textAnchor="middle">WITH LOVE</textPath>
      </text>
      <text x="50" y="55" fontSize="15" fontWeight="600" fill="url(#anaarSealFoil)" textAnchor="middle" letterSpacing="1.5">PAID</text>
      <text fontSize="6.2" fontWeight="600" fill="#E7CF8E" letterSpacing="1.6">
        <textPath href="#anaarSealBottom" startOffset="50%" textAnchor="middle">ANAAR</textPath>
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const customerName = "Ananya"

  const [currentReceiptId, setCurrentReceiptId] = useState<string>("current")
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedItemFeedback, setExpandedItemFeedback] = useState<number[]>([])
  const [itemFeedback, setItemFeedback] = useState<Record<number, { rating?: number; tags?: string[] }>>({})
  const [submittedItemFeedback, setSubmittedItemFeedback] = useState<Record<number, boolean>>({})

  const [showHistory, setShowHistory] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCare, setShowCare] = useState(false)
  const [showStore, setShowStore] = useState(false)

  const [rating, setRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const [tribe, setTribe] = useState({ name: customerName, mobile: "", email: "", occasion: "", date: "" })
  const [tribeSubmitted, setTribeSubmitted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const [promoSlide, setPromoSlide] = useState(0)
  const receiptContainerRef = useRef<HTMLDivElement>(null)

  const receipt = RECEIPTS[currentReceiptId]
  const itemCount = receipt.items.reduce((s, i) => s + i.qty, 0)

  /* auto-play promo carousel */
  useEffect(() => {
    if (!promoApi) return
    const id = setInterval(() => promoApi.scrollNext(), 4500)
    return () => clearInterval(id)
  }, [promoApi])

  useEffect(() => {
    if (!promoApi) return
    const onSelect = () => setPromoSlide(promoApi.selectedScrollSnap())
    promoApi.on("select", onSelect)
    return () => {
      promoApi.off("select", onSelect)
    }
  }, [promoApi])

  /* reset per-receipt UI state when switching receipts */
  useEffect(() => {
    setItemFeedback({})
    setExpandedItemFeedback([])
    setSubmittedItemFeedback({})
    setExpandedProducts([])
  }, [currentReceiptId])

  /* auto-height for WordPress / iframe embedding */
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }
    postHeight()
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)
    window.addEventListener("resize", postHeight)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2200)
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      showToast(`${code} copied`)
    } catch {
      showToast("Press and hold to copy the code")
    }
  }

  const toggleProduct = (id: number) =>
    setExpandedProducts((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const toggleItemFeedback = (id: number) =>
    setExpandedItemFeedback((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const setItemRating = (id: number, value: number) =>
    setItemFeedback((p) => ({ ...p, [id]: { ...p[id], rating: value } }))

  const toggleItemTag = (id: number, tag: string) =>
    setItemFeedback((p) => {
      const tags = p[id]?.tags || []
      return { ...p, [id]: { ...p[id], tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag] } }
    })

  const submitItemFeedback = (id: number) => {
    if (!itemFeedback[id]?.rating) return
    setSubmittedItemFeedback((p) => ({ ...p, [id]: true }))
    setExpandedItemFeedback((p) => p.filter((x) => x !== id))
  }

  const handleFeedbackSubmit = () => {
    if (!rating) return
    setFeedbackSubmitted(true)
  }

  const handleTribeSubmit = () => {
    if (!tribe.name.trim() || !tribe.mobile.trim()) {
      showToast("Please add your name and mobile number")
      return
    }
    setTribeSubmitted(true)
  }

  const handleEmailReceipt = () =>
    window.open(`mailto:?subject=${encodeURIComponent("Your Anaar receipt")}&body=${encodeURIComponent(`Receipt no. ${receipt.id}`)}`)

  const handleDownloadReceipt = () => {
    const rows = receipt.items
      .map(
        (it) => `
<tr>
  <td>
    <div class="item-name">${it.name}</div>
    <div class="item-meta">${it.category} · Size ${it.size}<br>SKU ${it.sku} · HSN ${it.hsn}</div>
  </td>
  <td class="c">${it.qty}</td>
  <td class="r">${fmt(it.base)}</td>
  <td class="r">${fmt(it.gst)}</td>
  <td class="r"><strong>${fmt(it.line)}</strong></td>
</tr>`,
      )
      .join("")

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Anaar Tax Invoice ${receipt.id}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Poppins',sans-serif;font-size:13px;color:#1E1616;background:#fff;width:800px;margin:0 auto;padding:32px;}
.head{text-align:center;padding-bottom:22px;border-bottom:1px solid #C9A24B;margin-bottom:22px;}
.head h1{font-size:30px;font-weight:300;letter-spacing:12px;color:#903535;padding-left:12px;}
.head p{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B08A35;margin-top:6px;}
.meta{display:flex;justify-content:space-between;font-size:12px;line-height:1.8;margin-bottom:22px;}
.meta .r{text-align:right;}
.cust{background:#FAF6EE;border-left:3px solid #C9A24B;padding:14px 16px;margin-bottom:22px;font-size:12px;color:#5b4b45;}
.cust strong{color:#903535;font-weight:500;}
table{width:100%;border-collapse:collapse;margin-bottom:22px;}
th{background:#903535;color:#F1DDA0;font-weight:500;text-transform:uppercase;letter-spacing:1px;font-size:10px;padding:11px 8px;text-align:left;}
th.c,td.c{text-align:center;} th.r,td.r{text-align:right;}
td{padding:14px 8px;border-bottom:1px solid #E9DFCF;vertical-align:top;font-size:12px;}
.item-name{font-weight:500;font-size:13px;}
.item-meta{font-size:10.5px;color:#8A7B72;margin-top:4px;line-height:1.7;}
.totals{margin-left:auto;width:280px;}
.totals div{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;color:#5b4b45;}
.totals .grand{font-size:17px;font-weight:600;color:#903535;border-top:1px solid #C9A24B;padding-top:10px;margin-top:10px;}
.words{margin-top:14px;font-size:11px;color:#5b4b45;}
.foot{text-align:center;margin-top:34px;padding-top:20px;border-top:1px dashed #C9A24B;font-size:11px;color:#8A7B72;line-height:1.9;}
.foot strong{color:#903535;font-weight:500;}
@media print{body{-webkit-print-color-adjust:exact;width:100%;padding:0;}}
</style>
</head>
<body>
<div class="head"><h1>ANAAR</h1><p>Tax Invoice</p></div>
<div class="meta">
  <div><strong>${STORE.name}</strong><br>GSTIN: ${STORE.gstin}<br>Styled by ${receipt.associate}</div>
  <div class="r">Receipt no. <strong>${receipt.id}</strong><br>${receipt.date} · ${receipt.time}<br>Paid via ${receipt.payment}</div>
</div>
<div class="cust"><strong>${customerName}</strong>, thank you for choosing Anaar. This receipt is your proof of purchase for exchanges and care.</div>
<table>
  <thead><tr><th>Piece</th><th class="c">Qty</th><th class="r">Taxable</th><th class="r">GST 18%</th><th class="r">Amount</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="totals">
  <div><span>Subtotal (excl. GST)</span><span>${fmt(receipt.subtotal)}</span></div>
  <div><span>CGST 9%</span><span>${fmt(receipt.cgst)}</span></div>
  <div><span>SGST 9%</span><span>${fmt(receipt.sgst)}</span></div>
  <div class="grand"><span>Total paid</span><span>${fmt(receipt.total)}</span></div>
</div>
<p class="words">Amount in words: ${inrWords(receipt.total)}</p>
<div class="foot">
  <strong>Handcrafted with love, made for the occasion.</strong><br>
  shopanaar.com · @worldofanaar · customercare@anaar.in · ${BRAND.phoneLabel}<br>
  Powered by RDEP Smart Receipts
</div>
</body>
</html>`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Anaar_Receipt_${receipt.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const openLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  const historyList = (["current", "hist1", "hist2"] as const).map((id) => ({
    id,
    date: RECEIPTS[id].date,
    pieces: RECEIPTS[id].items.reduce((s, i) => s + i.qty, 0),
    amount: RECEIPTS[id].total,
  }))

  const promoSlides = [
    {
      eyebrow: "Personalise",
      title: "Make your pair unmistakably yours",
      body: "Initials, charms and custom embellishments, crafted by hand.",
      cta: "Personalise & Customise",
      url: "https://shopanaar.com/pages/personalise-customise",
    },
    {
      eyebrow: "Gift of Love",
      title: "Not sure of her size? Gift an e-card",
      body: "Beautiful themed e-gift cards for every celebration.",
      cta: "Send a Gift Card",
      url: "https://shopanaar.com/pages/gift-page",
    },
    {
      eyebrow: "Anaar Edit",
      title: "15% off on orders above ₹15,000",
      body: "Use the code below on shopanaar.com.",
      cta: "ANAAR15",
      code: "ANAAR15",
      url: "https://shopanaar.com/collections/new-in",
    },
  ]

  const feedbackTags =
    rating >= 4
      ? ["Boutique experience", "Craftsmanship", "Comfort", "Design & detailing", "Packaging", "Styling help"]
      : ["Fit & sizing", "Comfort", "Waiting time", "Product availability", "Checkout", "Styling help"]

  return (
    <div className={`${poppins.variable} ${poppins.className} min-h-screen flex justify-center bg-[#F1E9DB]`}>
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="relative mx-auto w-full max-w-md overflow-hidden bg-[#FAF6EE] shadow-xl"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="flex w-full flex-col gap-4 pb-6 pt-4">
          {/* ============ HERO ============ */}
          <section className="relative mx-3 overflow-hidden rounded-[32px] text-[#FAF6EE]" style={{ background: HERO_BG }}>
            <JaliPattern />
            <div className="absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#C9A24B]/20 blur-3xl" />
            <div className="absolute inset-[10px] rounded-[24px] border border-[#C9A24B]/35" />

            <div className="relative z-10 px-7 pb-8 pt-9 text-center">
              {LOGO_SRC ? (
                <img src={LOGO_SRC} alt="Anaar" className="mx-auto h-9 w-auto" />
              ) : (
                <GoldText className="block pl-[0.5em] text-[30px] font-light tracking-[0.5em]">ANAAR</GoldText>
              )}
              <div className="mt-2 text-[9.5px] font-medium uppercase tracking-[0.34em] text-[#E7CF8E]/80">
                Handcrafted for every celebration
              </div>

              {/* arch */}
              <div className="mx-auto mt-7 h-[178px] w-[142px] rounded-t-[999px] rounded-b-[18px] border border-[#C9A24B]/70 p-[5px]">
                <div
                  className="relative flex h-full w-full flex-col items-center justify-center rounded-t-[999px] rounded-b-[13px]"
                  style={{ background: "linear-gradient(180deg,#4A1820 0%,#2E0E14 100%)" }}
                >
                  <Pomegranate size={92} />
                  <div className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.34em] text-[#E7CF8E]">Thank you</div>
                </div>
              </div>

              <h1 className="mt-6 text-[26px] font-light leading-tight tracking-[0.01em]">
                Congratulations, <span className="font-medium">{customerName}</span>
              </h1>
              <p className="mx-auto mt-2 max-w-[260px] text-[13px] leading-relaxed text-[#FAF6EE]/70">
                Your Anaar pieces are ready to walk into every beautiful moment.
              </p>

              {/* amount */}
              <div className="relative mt-7 rounded-[22px] border border-[#C9A24B]/45 bg-black/15 px-5 py-5 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 text-left">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#E7CF8E]/80">Amount paid</div>
                    <GoldText className="mt-1.5 block text-[40px] font-light leading-none tracking-tight">
                      {fmt0(receipt.total)}
                    </GoldText>
                    <div className="mt-2.5 text-[11.5px] text-[#FAF6EE]/55">
                      Inclusive of GST · {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                    </div>
                  </div>
                  <PaidSeal />
                </div>
              </div>
            </div>
          </section>

          {/* ============ RECEIPT DETAILS (invitation card) ============ */}
          <Card className="p-2">
            <div className="rounded-[22px] border border-[#C9A24B]/45 p-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className="rounded-2xl border border-[#E9DFCF] bg-white p-2">
                    <Image
                      src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                      alt="Receipt QR code"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.2em] text-[#B08A35]">At the boutique</div>
                </div>

                <dl className="min-w-0 flex-1 space-y-2.5 text-[12px]">
                  {[
                    ["Receipt no.", receipt.id],
                    ["Date", `${receipt.date} · ${receipt.time}`],
                    ["Boutique", STORE.name],
                    ["Styled by", receipt.associate],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[10px] uppercase tracking-[0.18em] text-[#8A7B72]">{k}</dt>
                      <dd className="truncate text-right font-medium text-[#2A1A1A]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Card>

          {/* ============ YOUR PIECES ============ */}
          <Card className="p-5">
            <SectionTitle
              eyebrow="Your order"
              title="Your Pieces"
              right={
                <span className="rounded-full border border-[#C9A24B]/60 bg-[#FAF6EE] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A6A22]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              }
            />

            <div className="space-y-3">
              {receipt.items.map((item) => {
                const open = expandedProducts.includes(item.id)
                const fbOpen = expandedItemFeedback.includes(item.id)
                return (
                  <div key={item.id} className="rounded-[22px] border border-[#EDE3D2] bg-[#FBF7EE] p-3.5">
                    <button
                      type="button"
                      onClick={() => toggleProduct(item.id)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <div
                        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#C9A24B]/60"
                        style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}
                      >
                        <GoldText className="text-[22px] font-light">{item.name.charAt(0)}</GoldText>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium leading-snug text-[#2A1A1A]">{item.name}</div>
                        <div className="mt-1 text-[11px] text-[#8A7B72]">
                          {item.category} · Size {item.size}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10.5px] text-[#8A7B72]">Qty {item.qty}</div>
                        <div className="mt-0.5 text-[14px] font-semibold text-[#903535]">{fmt0(item.line)}</div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 text-[#B08A35] transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
                    </button>

                    {open && (
                      <div className="mt-3.5 border-t border-dashed border-[#D9C79B] pt-3.5">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11.5px]">
                          {[
                            ["SKU", item.sku],
                            ["HSN", item.hsn],
                            ["Taxable value", fmt(item.base)],
                            ["GST @ 18%", fmt(item.gst)],
                          ].map(([k, v]) => (
                            <div key={k}>
                              <div className="text-[9.5px] uppercase tracking-[0.18em] text-[#8A7B72]">{k}</div>
                              <div className="mt-0.5 font-medium text-[#2A1A1A]">{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-[#F3EAD3]/70 px-3 py-2 text-[11px] text-[#6B5420]">
                          <Hand className="h-3.5 w-3.5 shrink-0" />
                          Handcrafted by Anaar artisans, one pair at a time.
                        </div>
                      </div>
                    )}

                    {/* per-piece feedback */}
                    <div className="mt-3">
                      {submittedItemFeedback[item.id] ? (
                        <div className="flex items-center justify-between text-[11.5px]">
                          <span className="flex items-center gap-1.5 font-medium text-[#5C7A3A]">
                            <Check className="h-3.5 w-3.5" /> Thanks for rating this piece
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSubmittedItemFeedback((p) => ({ ...p, [item.id]: false }))
                              toggleItemFeedback(item.id)
                            }}
                            className="font-medium text-[#903535]"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => toggleItemFeedback(item.id)} className="text-[11.5px] font-medium text-[#903535]">
                          {fbOpen ? "Hide feedback" : "Rate this piece"}
                        </button>
                      )}
                    </div>

                    {fbOpen && (
                      <div className="mt-3 rounded-[18px] border border-[#EDE3D2] bg-white p-4">
                        <div className="mb-3 flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} type="button" aria-label={`${s} star`} onClick={() => setItemRating(item.id, s)}>
                              <Star
                                className={`h-5 w-5 ${s <= (itemFeedback[item.id]?.rating || 0) ? "fill-[#C9A24B] text-[#C9A24B]" : "text-[#DCCFB6]"}`}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {["Comfort", "Fit", "Craftsmanship", "Embellishment", "Style"].map((tag) => {
                            const active = itemFeedback[item.id]?.tags?.includes(tag)
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleItemTag(item.id, tag)}
                                className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                                  active ? "border-[#903535] bg-[#903535] text-white" : "border-[#E4D8C0] bg-[#FBF7EE] text-[#6B5A52]"
                                }`}
                              >
                                {tag}
                              </button>
                            )
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={() => submitItemFeedback(item.id)}
                          disabled={!itemFeedback[item.id]?.rating}
                          className="mt-4 h-10 w-full rounded-xl bg-[#903535] text-[12px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* totals */}
            <div className="mt-6">
              <GoldRule />
              <div className="mt-5 space-y-2.5 text-[12.5px]">
                {[
                  ["Subtotal (excl. GST)", fmt(receipt.subtotal)],
                  ["CGST @ 9%", fmt(receipt.cgst)],
                  ["SGST @ 9%", fmt(receipt.sgst)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2">
                    <span className="text-[#6B5A52]">{k}</span>
                    <span className="flex-1 translate-y-[-3px] border-b border-dotted border-[#D9C79B]" />
                    <span className="font-medium text-[#2A1A1A]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-end justify-between rounded-2xl border border-[#C9A24B]/50 bg-[#FBF3DF] px-4 py-3.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7A5A14]">Total paid</span>
                <span className="text-[22px] font-semibold leading-none text-[#903535]">{fmt(receipt.total)}</span>
              </div>
              <p className="mt-3 text-center text-[10.5px] leading-relaxed text-[#8A7B72]">{inrWords(receipt.total)}</p>
            </div>

            {/* payment */}
            <div className="mt-5 flex items-center justify-between rounded-[20px] border border-[#EDE3D2] bg-[#FBF7EE] p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                  <BadgeCheck className="h-5 w-5 text-[#E7CF8E]" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#2A1A1A]">Payment received</div>
                  <div className="mt-0.5 text-[11px] text-[#8A7B72]">{receipt.payment}</div>
                </div>
              </div>
              <div className="text-[13px] font-semibold text-[#903535]">{fmt0(receipt.total)}</div>
            </div>
          </Card>

          {/* ============ RECEIPT ACTIONS ============ */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-[#EDE3D2]">
              {[
                { label: "Orders", Icon: History, onClick: () => setShowHistory(true) },
                { label: "Email", Icon: Mail, onClick: handleEmailReceipt },
                { label: "Invoice", Icon: Download, onClick: handleDownloadReceipt },
              ].map(({ label, Icon, onClick }) => (
                <button key={label} type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 py-4 transition active:bg-[#FBF3DF]">
                  <Icon className="h-5 w-5 text-[#903535]" />
                  <span className="text-[11px] font-medium text-[#4A3A34]">{label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* ============ HANDCRAFTED PROMISE ============ */}
          <Card className="p-5">
            <SectionTitle eyebrow="The Anaar promise" title="Crafted by hand, kept with care" />
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { Icon: Hand, t: "Handcrafted", s: "By skilled artisans" },
                { Icon: Sparkles, t: "Embellished", s: "Zari, zardozi & more" },
                { Icon: Package, t: "Made to last", s: "Comfort for hours" },
              ].map(({ Icon, t, s }) => (
                <div key={t} className="rounded-2xl border border-[#EDE3D2] bg-[#FBF7EE] px-2 py-3.5 text-center">
                  <Icon className="mx-auto h-5 w-5 text-[#B08A35]" />
                  <div className="mt-2 text-[11.5px] font-medium text-[#2A1A1A]">{t}</div>
                  <div className="mt-0.5 text-[9.5px] leading-snug text-[#8A7B72]">{s}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCare(!showCare)}
              aria-expanded={showCare}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[#C9A24B]/50 bg-[#FBF3DF] px-4 py-3 text-left"
            >
              <span className="text-[12px] font-medium text-[#6B4F10]">Care guide for your pieces</span>
              <ChevronRight className={`h-4 w-4 text-[#B08A35] transition-transform ${showCare ? "rotate-90" : ""}`} />
            </button>
            {showCare && (
              <ul className="mt-3 space-y-2.5 px-1">
                {CARE_TIPS.map((tip) => (
                  <li key={tip} className="flex gap-2.5 text-[12px] leading-relaxed text-[#5B4B45]">
                    <Diamond className="mt-[7px] shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            )}
            <a href={BRAND.returnPolicy} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-[#903535]">
              <FileText className="h-3.5 w-3.5" /> Return &amp; exchange policy
            </a>
          </Card>

          {/* ============ PROMO CAROUSEL ============ */}
          <Card className="relative overflow-hidden">
            <Carousel className="w-full" setApi={setPromoApi} opts={{ loop: true }}>
              <CarouselContent>
                {promoSlides.map((s) => (
                  <CarouselItem key={s.eyebrow}>
                    <div className="relative px-6 pb-12 pt-7 text-center text-[#FAF6EE]" style={{ background: HERO_BG }}>
                      <JaliPattern />
                      <div className="relative z-10">
                        <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#E7CF8E]">{s.eyebrow}</div>
                        <div className="mx-auto mt-2.5 max-w-[250px] text-[19px] font-light leading-snug">{s.title}</div>
                        <div className="mx-auto mt-2 max-w-[250px] text-[12px] leading-relaxed text-[#FAF6EE]/65">{s.body}</div>
                        {s.code ? (
                          <button
                            type="button"
                            onClick={() => copyCode(s.code!)}
                            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-[#E7CF8E] px-5 py-2 text-[12px] font-semibold tracking-[0.2em] text-[#E7CF8E]"
                          >
                            {s.cta} <Copy className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openLink(s.url)}
                            className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[12px] font-semibold text-[#3A1218]"
                            style={{ backgroundImage: GOLD_FOIL }}
                          >
                            {s.cta} <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5">
                {promoSlides.map((s, i) => (
                  <button
                    key={s.eyebrow}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => promoApi?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${promoSlide === i ? "w-5 bg-[#E7CF8E]" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </Carousel>
          </Card>

          {/* ============ SAVE THE DATE / ANAAR TRIBE ============ */}
          <Card className="p-5">
            {tribeSubmitted ? (
              <div className="py-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                  <Check className="h-6 w-6 text-[#E7CF8E]" />
                </div>
                <div className="mt-4 text-[18px] font-light text-[#2A1A1A]">Welcome to the Tribe, {tribe.name.split(" ")[0]}</div>
                <p className="mx-auto mt-1.5 max-w-[250px] text-[12px] leading-relaxed text-[#8A7B72]">
                  We&apos;ll keep your date in mind and send styling inspiration your way. Here&apos;s a little welcome gift.
                </p>
                <button
                  type="button"
                  onClick={() => copyCode("ANAARTRIBE10")}
                  className="mx-auto mt-4 flex items-center gap-2.5 rounded-2xl border border-dashed border-[#C9A24B] bg-[#FBF3DF] px-5 py-3"
                >
                  <Gift className="h-4 w-4 text-[#903535]" />
                  <span className="text-[14px] font-semibold tracking-[0.2em] text-[#903535]">ANAARTRIBE10</span>
                  <Copy className="h-3.5 w-3.5 text-[#B08A35]" />
                </button>
                <div className="mt-2 text-[10.5px] text-[#8A7B72]">10% off on shopanaar.com</div>
              </div>
            ) : (
              <>
                <SectionTitle eyebrow="Save the date" title="Join the Anaar Tribe" />
                <p className="-mt-2 mb-4 text-[12px] leading-relaxed text-[#8A7B72]">
                  Tell us about your celebration and unlock a welcome reward, fresh designs and styling inspiration.
                </p>

                <div className="space-y-3">
                  {[
                    { key: "name", label: "Full name", type: "text", ph: "e.g. Ananya Rao" },
                    { key: "mobile", label: "Mobile number", type: "tel", ph: "e.g. 98XXXXXXXX" },
                    { key: "email", label: "Email address", type: "email", ph: "name@email.com" },
                  ].map((f) => (
                    <label key={f.key} className="block">
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A7B72]">{f.label}</span>
                      <input
                        type={f.type}
                        placeholder={f.ph}
                        value={tribe[f.key as "name" | "mobile" | "email"]}
                        onChange={(e) => setTribe((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-[#E4D8C0] bg-white px-3.5 py-2.5 text-[13px] text-[#2A1A1A] outline-none placeholder:text-[#C2B6A6] focus:border-[#903535] focus:ring-1 focus:ring-[#903535]"
                      />
                    </label>
                  ))}

                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A7B72]">Your occasion</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setTribe((p) => ({ ...p, occasion: p.occasion === o.label ? "" : o.label }))}
                          className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                            tribe.occasion === o.label ? "border-[#903535] bg-[#903535] text-white" : "border-[#E4D8C0] bg-[#FBF7EE] text-[#6B5A52]"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8A7B72]">
                      <CalendarDays className="h-3 w-3" /> Date of celebration
                    </span>
                    <input
                      type="date"
                      value={tribe.date}
                      onChange={(e) => setTribe((p) => ({ ...p, date: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#E4D8C0] bg-white px-3.5 py-2.5 text-[13px] text-[#2A1A1A] outline-none focus:border-[#903535] focus:ring-1 focus:ring-[#903535]"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleTribeSubmit}
                  className="mt-5 h-11 w-full rounded-xl text-[12.5px] font-semibold text-[#3A1218] transition active:scale-[0.98]"
                  style={{ backgroundImage: GOLD_FOIL }}
                >
                  Join &amp; unlock my reward
                </button>
                <p className="mt-2.5 text-center text-[10px] text-[#A39688]">Free to join. Unsubscribe anytime.</p>
              </>
            )}
          </Card>

          {/* ============ COMPLETE THE LOOK ============ */}
          <Card className="overflow-hidden py-5">
            <div className="px-5">
              <SectionTitle eyebrow="Finishing touches" title="Complete the Look" />
            </div>
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="ml-5 mr-2">
                {COMPLETE_THE_LOOK.map(({ name, kind, price, url, Icon }) => (
                  <CarouselItem key={name} className="basis-[46%] pl-0 pr-3">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[20px] border border-[#EDE3D2] bg-[#FBF7EE]">
                      <div className="relative flex h-[104px] items-center justify-center" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                        <JaliPattern />
                        <Icon className="relative h-8 w-8 text-[#E7CF8E]" />
                      </div>
                      <div className="p-3">
                        <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#B08A35]">{kind}</div>
                        <div className="mt-1 truncate text-[12.5px] font-medium text-[#2A1A1A]">{name}</div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[#903535]">{fmt0(price)}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-[#B08A35]" />
                        </div>
                      </div>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </Card>

          {/* ============ SHOP BY OCCASION ============ */}
          <Card className="p-5">
            <SectionTitle eyebrow="For every function" title="Shop by Occasion" />
            <div className="grid grid-cols-2 gap-2.5">
              {OCCASIONS.map((o, i) => (
                <a
                  key={o.label}
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-[#E4D8C0] bg-[#FBF7EE] px-3.5 py-3.5"
                >
                  <div className="text-[9px] font-medium tracking-[0.3em] text-[#B08A35]">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1.5 text-[12.5px] font-medium leading-snug text-[#2A1A1A]">{o.label}</div>
                  <div className="mt-2 flex items-center gap-1 text-[10.5px] font-medium text-[#903535]">
                    Explore <ChevronRight className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </Card>

          {/* ============ RATE EXPERIENCE ============ */}
          <Card className="p-5">
            {feedbackSubmitted ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                  <Check className="h-6 w-6 text-[#E7CF8E]" />
                </div>
                <div className="mt-4 text-[18px] font-light text-[#2A1A1A]">Thank you for sharing</div>
                <p className="mx-auto mt-1.5 max-w-[250px] text-[12px] leading-relaxed text-[#8A7B72]">
                  Your words help us craft a more beautiful Anaar experience.
                </p>
                {rating >= 4 && (
                  <button
                    type="button"
                    onClick={() => openLink(BRAND.instagram)}
                    className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/60 bg-[#FBF3DF] px-5 py-2.5 text-[12px] font-medium text-[#6B4F10]"
                  >
                    <Instagram className="h-4 w-4" /> Tag us @worldofanaar
                  </button>
                )}
              </div>
            ) : (
              <>
                <SectionTitle eyebrow="Your voice" title="How was your Anaar visit?" />
                <div className="flex justify-center gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-label={`${s} star`}
                      onClick={() => {
                        setRating(s)
                        setSelectedTags([])
                      }}
                      className="transition-transform active:scale-90"
                    >
                      <Star className={`h-9 w-9 transition-colors ${s <= rating ? "fill-[#C9A24B] text-[#C9A24B]" : "text-[#DCCFB6]"}`} />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="mt-4">
                    <div className="mb-2.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#8A7B72]">Tell us more</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {feedbackTags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}
                          className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                            selectedTags.includes(t) ? "border-[#903535] bg-[#903535] text-white" : "border-[#E4D8C0] bg-[#FBF7EE] text-[#6B5A52]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  rows={3}
                  placeholder="Anything else you'd like us to know? (optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mt-4 w-full resize-none rounded-2xl border border-[#E4D8C0] bg-white p-3.5 text-[12.5px] text-[#2A1A1A] outline-none placeholder:text-[#C2B6A6] focus:border-[#903535] focus:ring-1 focus:ring-[#903535]"
                />
                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  disabled={!rating}
                  className="mt-3 h-11 w-full rounded-xl bg-[#903535] text-[12.5px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
                >
                  Submit feedback
                </button>
              </>
            )}
          </Card>

          {/* ============ CONCIERGE ============ */}
          <Card className="p-5">
            <SectionTitle eyebrow="We're here" title="Anaar Concierge" />
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Chat", Icon: MessageCircle, onClick: () => openLink(BRAND.whatsapp) },
                { label: "Call", Icon: Phone, onClick: () => window.open(BRAND.phone) },
                { label: "Email", Icon: Mail, onClick: () => window.open(BRAND.email) },
              ].map(({ label, Icon, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#E4D8C0] bg-[#FBF7EE] py-3.5 transition active:scale-[0.97]"
                >
                  <Icon className="h-5 w-5 text-[#903535]" />
                  <span className="text-[11px] font-medium text-[#4A3A34]">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A7B72]">
              <Clock className="h-3 w-3" /> 10 am to 6 pm · {BRAND.phoneLabel}
            </div>
          </Card>

          {/* ============ BOUTIQUE & SOCIAL ============ */}
          <Card className="p-5">
            <div className="flex justify-center gap-6">
              {[
                { label: "Instagram", Icon: Instagram, url: BRAND.instagram },
                { label: "Facebook", Icon: Facebook, url: BRAND.facebook },
                { label: "Website", Icon: ExternalLink, url: BRAND.site },
              ].map(({ label, Icon, url }) => (
                <button key={label} type="button" onClick={() => openLink(url)} className="flex flex-col items-center gap-1.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/70" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                    <Icon className="h-4 w-4 text-[#E7CF8E]" />
                  </span>
                  <span className="text-[10.5px] font-medium text-[#6B5A52]">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#FBF7EE] p-3.5 text-center">
              <button type="button" onClick={() => setShowStore(!showStore)} aria-expanded={showStore} className="flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-[#2A1A1A]">
                <MapPin className="h-3.5 w-3.5 text-[#903535]" /> {STORE.name} boutique details
                <ChevronRight className={`h-3.5 w-3.5 text-[#B08A35] transition-transform ${showStore ? "rotate-90" : ""}`} />
              </button>
              {showStore && (
                <div className="mt-3 space-y-1.5 text-[11px] text-[#6B5A52]">
                  <p>GSTIN: {STORE.gstin}</p>
                  <p>Styled by {receipt.associate}</p>
                  <a href={STORE.locatorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#903535]">
                    Find a boutique near you <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <button type="button" onClick={() => setShowTerms(!showTerms)} aria-expanded={showTerms} className="mt-3 h-8 w-full text-[11.5px] font-medium text-[#8A7B72]">
              Terms &amp; conditions {showTerms ? "▲" : "▼"}
            </button>
            {showTerms && (
              <div className="space-y-1.5 px-1 text-[11px] leading-relaxed text-[#8A7B72]">
                <p>• Prices are inclusive of applicable GST.</p>
                <p>• Offer codes are subject to the terms shown on shopanaar.com.</p>
                <p>• Please retain this digital receipt as proof of purchase for exchanges and care.</p>
                <p>
                  • Full policies at{" "}
                  <a className="font-medium text-[#903535] underline" href={BRAND.terms} target="_blank" rel="noopener noreferrer">
                    shopanaar.com
                  </a>
                  .
                </p>
              </div>
            )}
          </Card>

          {/* ============ FOOTER ============ */}
          <div className="px-6 text-center">
            <GoldRule />
            <div className="mt-4 text-[10.5px] text-[#A39688]">
              Digital receipt powered by <span className="font-semibold text-[#8A7B72]">RDEP Smart Receipts</span>
            </div>
          </div>

          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* ============ TOAST ============ */}
        {toast && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-[#3A1218] px-5 py-2.5 text-[12px] font-medium text-[#E7CF8E] shadow-xl" role="status">
            {toast}
          </div>
        )}

        {/* ============ ORDER HISTORY MODAL ============ */}
        {showHistory && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-[#1E0A0E]/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <div className="relative mx-4 w-full max-w-sm overflow-hidden rounded-[26px] border border-[#C9A24B]/50 bg-[#FFFDF8] shadow-2xl" role="dialog" aria-label="Order history">
              <div className="flex items-center justify-between px-5 py-4" style={{ background: HERO_BG }}>
                <div className="flex items-center gap-2.5">
                  <History className="h-4 w-4 text-[#E7CF8E]" />
                  <h3 className="text-[14px] font-medium tracking-[0.04em] text-[#FAF6EE]">Your Anaar orders</h3>
                </div>
                <button type="button" aria-label="Close" onClick={() => setShowHistory(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                  <X className="h-4 w-4 text-[#E7CF8E]" />
                </button>
              </div>
              <div className="max-h-80 space-y-3 overflow-y-auto p-4">
                {historyList.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      setCurrentReceiptId(h.id)
                      setShowHistory(false)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      currentReceiptId === h.id ? "border-[#C9A24B] bg-[#FBF3DF]" : "border-[#E4D8C0] bg-[#FBF7EE] hover:border-[#903535]"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(145deg,#7A2A30,#3A1218)" }}>
                      <ShoppingBag className="h-4 w-4 text-[#E7CF8E]" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium text-[#2A1A1A]">{h.pieces} {h.pieces === 1 ? "piece" : "pieces"}</span>
                      <span className="block text-[11px] text-[#8A7B72]">{h.date}</span>
                    </span>
                    <span className="text-[13px] font-semibold text-[#903535]">{fmt0(h.amount)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

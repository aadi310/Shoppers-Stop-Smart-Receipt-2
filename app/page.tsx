'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Download, History, Mail, ShoppingBag, Sparkles, HelpCircle, MapPin, ChevronDown, Instagram, Facebook, Globe, CreditCard, Gift, Award, MessageCircle, Phone, Zap } from 'lucide-react'

export default function Home() {
  const [currentReceiptId, setCurrentReceiptId] = useState('current')
  const [feedbackText, setFeedbackText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false)
  const [joinedDoughGetters, setJoinedDoughGetters] = useState(false)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
  })
  const [phoneError, setPhoneError] = useState('')
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showStoreDetails, setShowStoreDetails] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === 1 ? 0 : prev + 1))
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const receipts = {
    current: {
      id: "BD240211120545",
      date: "11-02-2025",
      time: "12:05:45",
      cashier: "Sarah Chen",
      storeLocation: "Bakers Delight - Sydney CBD",
      paymentMethod: "Card",
      cardLast4: "4532",
      items: [
        {
          id: 0,
          name: "Hi-Fibre Lo-GI White Block Loaf",
          description: "Fresh artisan sourdough loaf",
          price: 8.0,
          quantity: 1,
          category: "Bread",
          taxApplicable: false,
          baseAmount: 8.0,
          tax: 0,
          itemCode: "BREAD001",
        },
        {
          id: 1,
          name: "Cheesymite Scrolls",
          description: "Savory cheese and mite spread pastry",
          price: 6.0,
          quantity: 2,
          category: "Savory",
          taxApplicable: true,
          baseAmount: 12.0,
          tax: 1.2,
          itemCode: "SAV002",
        },
        {
          id: 2,
          name: "Traditional Hot Cross Buns",
          description: "6-Pack of seasonal spiced buns",
          price: 13.0,
          quantity: 1,
          category: "Sweet",
          taxApplicable: true,
          baseAmount: 13.0,
          tax: 1.3,
          itemCode: "SWEET001",
        },
      ],
      subtotal: 33.0,
      tax: 2.5,
      total: 35.5,
    },
    hist1: {
      id: "BD240208150320",
      date: "08-02-2025",
      time: "15:03:20",
      cashier: "Michael Torres",
      storeLocation: "Bakers Delight - Sydney CBD",
      paymentMethod: "Card",
      cardLast4: "4532",
      items: [
        {
          id: 0,
          name: "Sourdough Vienna",
          description: "Authentic European-style sourdough",
          price: 10.5,
          quantity: 1,
          category: "Bread",
          taxApplicable: false,
          baseAmount: 10.5,
          tax: 0,
          itemCode: "BREAD002",
        },
        {
          id: 1,
          name: "Scone 4-Pack",
          description: "Freshly baked plain scones",
          price: 13.0,
          quantity: 1,
          category: "Sweet",
          taxApplicable: true,
          baseAmount: 13.0,
          tax: 1.3,
          itemCode: "SWEET002",
        },
      ],
      subtotal: 23.5,
      tax: 1.3,
      total: 24.8,
    },
    hist2: {
      id: "BD240205103015",
      date: "05-02-2025",
      time: "10:30:15",
      cashier: "Emma Williams",
      storeLocation: "Bakers Delight - Sydney CBD",
      paymentMethod: "Card",
      cardLast4: "4532",
      items: [
        {
          id: 0,
          name: "Spinach & Feta Danishes",
          description: "Savory pastry with fresh spinach and feta",
          price: 6.0,
          quantity: 2,
          category: "Savory",
          taxApplicable: true,
          baseAmount: 12.0,
          tax: 1.2,
          itemCode: "SAV003",
        },
        {
          id: 1,
          name: "White Block Loaf",
          description: "Classic fresh white bread",
          price: 7.0,
          quantity: 1,
          category: "Bread",
          taxApplicable: false,
          baseAmount: 7.0,
          tax: 0,
          itemCode: "BREAD003",
        },
      ],
      subtotal: 19.0,
      tax: 1.2,
      total: 20.2,
    },
  }

  const currentReceipt = receipts[currentReceiptId as keyof typeof receipts]

  const customerName = "Aaditya";

  const transactionHistory = [
    {
      id: "current",
      date: "11-02-2025",
      branch: "Bakers Delight - Sydney CBD",
      amount: currentReceiptId === "current" ? receipts.current.total : 35.5,
    },
    { id: "hist1", date: "08-02-2025", branch: "Bakers Delight - Sydney CBD", amount: 24.8 },
    { id: "hist2", date: "05-02-2025", branch: "Bakers Delight - Sydney CBD", amount: 20.2 },
  ]

  const validateAUPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    return cleanPhone.length === 10 || (cleanPhone.length === 11 && cleanPhone.startsWith("61"))
  }

  const handleJoinDoughGetters = () => {
    setJoinedDoughGetters(true)
  }

  const downloadReceipt = () => {
    const receiptHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Baker's Delight Receipt - ${currentReceipt.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: #f9f9f9;
      padding: 40px;
    }
    .receipt-card {
      max-width: 700px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e0d5ce;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #862633;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-name {
      color: #862633;
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .info-grid {
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e0d5ce;
    }
    .info-block {
      display: flex;
      flex-direction: column;
    }
    .info-block.right {
      text-align: right;
    }
    .info-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #777;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .info-value {
      color: #862633;
      font-weight: 600;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      text-align: left;
      border-bottom: 2px solid #e0d5ce;
      padding: 10px;
      color: #862633;
      font-size: 12px;
      text-transform: uppercase;
    }
    td {
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
    }
    .item-name { font-weight: bold; color: #862633; }
    .item-desc { font-size: 11px; color: #666; }
    .totals {
      margin-left: auto;
      width: 250px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    .grand-total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #862633;
      font-size: 18px;
      font-weight: bold;
      color: #862633;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #888;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div class="brand-name">Baker's Delight</div>
      <p style="font-size: 12px; color: #666; margin-top: 5px;">Premium Bakery Experience</p>
    </div>

    <div class="info-grid">
      <div class="info-row">
        <div class="info-block">
          <p class="info-label">Receipt ID</p>
          <p class="info-value">${currentReceipt.id}</p>
        </div>
        <div class="info-block right">
          <p class="info-label">Date & Time</p>
          <p class="info-value">${currentReceipt.date} ${currentReceipt.time}</p>
        </div>
      </div>

      <div class="info-row" style="border-bottom: none; margin-bottom: 0;">
        <div class="info-block">
          <p class="info-label">Store</p>
          <p class="info-value">${currentReceipt.storeLocation}</p>
        </div>
        <div class="info-block right">
          <p class="info-label">Staff</p>
          <p class="info-value">${currentReceipt.cashier}</p>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 60%;">Item</th>
          <th style="width: 15%; text-align: center;">Qty</th>
          <th style="width: 25%; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${currentReceipt.items.map(item => `
          <tr>
            <td>
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.description}</div>
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span>$${currentReceipt.subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>GST (10%)</span>
        <span>$${currentReceipt.tax.toFixed(2)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <span>$${currentReceipt.total.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for shopping at Baker's Delight!</p>
      <p>Visit us at www.bakersdelight.com.au</p>
      <p style="margin-top: 10px; opacity: 0.6;">Powered by RDEP</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bakers_Delight_Receipt_${currentReceipt.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmitFeedback = () => {
    setShowFeedbackSuccess(true)
    setFeedbackText("")
    setRating(0)
    setTimeout(() => {
      setShowFeedbackSuccess(false)
    }, 6000)
  }

  const toggleItemExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleEmailClick = () => {
    window.location.href = "mailto:info@bakerdelight.com.au"
  }

  const slides = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banner%202-qah7Dw6Us0zbGj8Yttict3DShTIbb9.png",
    title: "Beauty Essentials",
    buttonText: "Explore Now",
    link: "https://www.shoppersstop.com/search/result?q=Beauty+Essentials&page=1",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banner%203-SzLwrK1uS5rdL5ShEFUWk7yyRICZXC.png",
    title: "Top Western Women Brands",
    buttonText: "Shop Collection",
    link: "https://www.shoppersstop.com/search/result?q=Top-Western-Women-Brands&page=1",
  },
];

  return (
    <div className="min-h-screen bg-white py-6 px-4 font-sans text-[#862633]">
      <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-3xl">
       {/* Card 1: Header */}
<div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e5e5e5] shadow-sm p-6 pt-4">

  {/* Logo */}
  <div className="flex justify-center mb-2">
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shoppers-Stop-Logo-Vector.svg--BKD2qiunWPNR8Wk8J3qrxaxAVW7MSw.png"
      alt="Shoppers Stop"
      width={420}
      height={140}
      className="h-24 w-auto object-contain"
      priority
    />
  </div>

  {/* Tagline */}
  <p className="text-center text-[11px] tracking-[0.25em] uppercase font-medium text-black">
    Fashion • Beauty • Home
  </p>

  {/* Customer Thank You */}
  <p className="text-center text-xs text-gray-600 mt-2 mb-5">
    Thank you for shopping with us, <span className="font-semibold text-black">{customerName}</span>
  </p>

  {/* Divider */}
  <div className="border-t border-[#e5e5e5] pt-4 space-y-2">

    {/* Top Row */}
    <div className="grid grid-cols-2 gap-4">

      <div>
        <p className="text-[11px] text-gray-600 font-medium mb-0.5">Receipt ID</p>
        <p className="font-semibold text-sm text-black">{currentReceipt.id}</p>
      </div>

      <div className="text-right">
        <p className="text-[11px] text-gray-600 font-medium mb-0.5">Date & Time</p>
        <p className="font-semibold text-sm text-black">
          {currentReceipt.date} {currentReceipt.time}
        </p>
      </div>

    </div>

    {/* Bottom Row */}
    <div className="grid grid-cols-2 gap-4 items-end">

      <div>
        <p className="text-[11px] text-gray-600 font-medium mb-0.5">Associate</p>
        <p className="font-semibold text-sm text-black">{currentReceipt.cashier}</p>
      </div>

      <div className="flex justify-end">
        <Image
          src="/images/qr-code.png"
          alt="QR Code"
          width={80}
          height={80}
          className="h-16 w-16 bg-white p-1 rounded border border-[#e5e5e5]"
        />
      </div>

    </div>
  </div>
</div>
        
        {/* Card 2: Items, Totals, Payment, and Actions */}
<div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e5e5e5] shadow-sm">

  {/* Items Section */}
  <div className="p-6 border-b border-[#e5e5e5]">

    <div className="flex items-center justify-between mb-5">

      <div className="flex items-center gap-3">
        <ShoppingBag size={20} className="text-black" />
        <h3 className="text-lg font-semibold text-black">Purchased Items</h3>
      </div>

      <span className="bg-black text-white text-[11px] font-semibold px-3 py-1 rounded-full">
        {currentReceipt.items.length} Items
      </span>

    </div>

    <div className="space-y-2">

      {currentReceipt.items.map((item) => {

        const isExpanded = expandedItems.includes(item.id);

        return (

          <div key={item.id}>

            <button
              onClick={() => toggleItemExpanded(item.id)}
              className="w-full bg-[#fafafa] rounded-xl p-4 border border-[#e5e5e5] text-left transition"
            >

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <p className="font-semibold text-sm text-black">
                    {item.name}
                  </p>

                  <div className="mt-1">
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                </div>

                <div className="text-right ml-4">

                  <p className="font-semibold text-sm text-black">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty {item.quantity}
                  </p>

                </div>

              </div>

              {isExpanded && (

                <div className="mt-3 pt-3 border-t border-[#e5e5e5] space-y-2">

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">

                    <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                      {item.taxApplicable ? "GST Included" : "GST-Free"}
                    </span>

                    <span className="text-xs font-medium text-gray-600">
                      {item.tax ? `₹${item.tax.toFixed(2)} tax` : ""}
                    </span>

                  </div>

                </div>

              )}

            </button>

          </div>

        );

      })}

    </div>

  </div>


  {/* Totals Section */}

  <div className="px-6 py-5 space-y-3 bg-white">

    <div className="flex justify-between items-center">
      <span className="text-gray-600 text-sm font-medium">Subtotal</span>
      <span className="font-semibold text-sm text-black">
        ₹{currentReceipt.subtotal.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between items-center border-t border-[#e5e5e5] pt-3">
      <span className="text-gray-600 text-sm font-medium">GST</span>
      <span className="font-semibold text-sm text-black">
        ₹{currentReceipt.tax.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between items-center pt-3 border-t-2 border-black">

      <span className="font-semibold text-base text-black">
        Total Paid
      </span>

      <span className="font-semibold text-lg text-black">
        ₹{currentReceipt.total.toFixed(2)}
      </span>

    </div>

  </div>


  {/* Payment Method */}

  <div className="border-t border-[#e5e5e5] px-6 py-4 bg-[#fafafa]">

    <div className="flex justify-between items-center">

      <div className="flex items-center gap-2">

        <CreditCard size={18} className="text-gray-600" />

        <div>

          <p className="text-xs font-medium text-gray-600">
            Card Payment
          </p>

          <p className="text-xs text-gray-500">
            •••• •••• •••• {currentReceipt.cardLast4}
          </p>

        </div>

      </div>

      <p className="font-semibold text-black">
        ₹{currentReceipt.total.toFixed(2)}
      </p>

    </div>

  </div>


  {/* Action Buttons */}

  <div className="border-t border-[#e5e5e5] px-3 md:px-6 py-4 md:py-6 flex gap-2 md:gap-3 bg-white">

    <button
      onClick={downloadReceipt}
      className="flex-1 bg-black text-white py-2 px-3 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
    >
      <Download size={14} />
      Download
    </button>

    <button
      onClick={() => setShowTransactionHistory(true)}
      className="flex-1 border border-black text-black py-2 px-3 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
    >
      <History size={14} />
      History
    </button>

    <button
      onClick={handleEmailClick}
      className="flex-1 bg-black text-white py-2 px-3 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
    >
      <Mail size={14} />
      Email
    </button>
  </div>
</div>
        {/* Carousel Banners */}
<div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e5e5e5]">

  {/* Image Container */}
  <div className="relative">

    <a
      href={slides[currentSlideIndex].link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={slides[currentSlideIndex].image}
        alt={slides[currentSlideIndex].title}
        width={1600}
        height={800}
        className="w-full h-auto object-contain"
        priority
      />
    </a>

    {/* Overlay Content */}
    <div className="absolute bottom-4 left-4">

      <h3 className="text-white font-semibold text-lg drop-shadow">
        {slides[currentSlideIndex].title}
      </h3>

      <a
        href={slides[currentSlideIndex].link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 px-5 py-2 rounded-md font-medium text-xs transition-all bg-white text-black hover:bg-gray-100"
      >
        {slides[currentSlideIndex].buttonText}
      </a>

    </div>

  </div>


  {/* Navigation */}
  <div className="flex justify-between items-center p-4">

    <button
      onClick={() =>
        setCurrentSlideIndex((prev) =>
          prev === 0 ? slides.length - 1 : prev - 1
        )
      }
      className="text-black hover:opacity-60"
    >
      ←
    </button>

    <div className="flex gap-2">

      {slides.map((_, index) => (

        <button
          key={index}
          onClick={() => setCurrentSlideIndex(index)}
          className={`h-2 rounded-full transition-all ${
            index === currentSlideIndex
              ? "bg-black w-6"
              : "bg-gray-300 w-2"
          }`}
        />

      ))}

    </div>

    <button
      onClick={() =>
        setCurrentSlideIndex((prev) =>
          prev === slides.length - 1 ? 0 : prev + 1
        )
      }
      className="text-black hover:opacity-60"
    >
      →
    </button>

  </div>

</div>
        
        {/* Loyalty Section */}
<div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e5e5e5]">

  {/* Header */}
  <div className="bg-black text-white p-6">
    <div className="flex items-center gap-3">
      <Gift size={20} />
      <h3 className="text-lg font-semibold">Join First Citizen Club</h3>
    </div>
    <p className="text-xs opacity-80 mt-1">
      Unlock exclusive rewards and member benefits
    </p>
  </div>

  <div className="p-6 space-y-4">

    {joinedDoughGetters ? (

      <div className="text-center py-8">

        <div className="text-4xl mb-3">✨</div>

        <h4 className="text-lg font-semibold text-black mb-2">
          Welcome to First Citizen Club
        </h4>

        <p className="text-sm text-gray-600">
          Your membership is now active. Enjoy exclusive rewards and early access to special collections.
        </p>

      </div>

    ) : (

      <>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>

          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-all text-sm"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>

          <input
            type="text"
            value={profile.mobile}
            onChange={(e) =>
              setProfile({ ...profile, mobile: e.target.value })
            }
            placeholder="+91 9XXXXXXXXX"
            className="w-full px-4 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-all text-sm"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="name@email.com"
            className="w-full px-4 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-all text-sm"
          />
        </div>


        <button
          onClick={handleJoinDoughGetters}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-all text-sm"
        >
          Join First Citizen Club
        </button>

      </>

    )}

  </div>

</div>
        
        {/* Dough Getters Loyalty Points Display */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <div className="bg-gradient-to-r from-[#862633] to-[#a8334a] text-white p-6">
            <div className="flex items-center gap-3">
              <Award size={20} />
              <h3 className="text-lg font-serif font-bold">Dough Getters Rewards</h3>
            </div>
            <p className="text-xs opacity-90 font-sans mt-1">Your loyalty benefits</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-gradient-to-br from-[#fdfaf7] to-[#f5ede5] rounded-lg p-5 border-2 border-[#e0d5ce]">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700 font-sans mb-1">Amount Spent</p>
                  <p className="text-2xl font-serif font-bold text-[#862633]">$125.50</p>
                </div>
                <div className="text-3xl">🥖</div>
              </div>
              <div className="bg-white h-2 rounded-full overflow-hidden border border-[#e0d5ce]">
                <div className="bg-gradient-to-r from-[#862633] to-[#a8334a] h-full" style={{ width: '48%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-sans font-semibold">Earn $5 for every $55 spent - $29.50 towards next reward</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-xs font-semibold text-gray-800 font-sans">Birthday Surprise</p>
                <p className="text-xs text-gray-600 mt-1 font-sans">Next month!</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg p-4 border-2 border-emerald-300">
                <p className="text-2xl mb-2">🎁</p>
                <p className="text-xs font-semibold text-gray-800 font-sans">Welcome Offer</p>
                <p className="text-xs text-gray-600 mt-1 font-sans">Free Hot Cross Bun 6-pack</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Your Experience Section */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <div className="bg-[#862633] text-white p-6">
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <h3 className="text-lg font-serif font-bold">Rate Your Experience</h3>
            </div>
          </div>

          <div className="p-6">
            {showFeedbackSuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 animate-bounce">✅</div>
                <p className="text-base font-serif font-bold text-[#862633] mb-1">Thanks for your feedback!</p>
                <p className="text-xs text-gray-600 font-sans">We appreciate your support</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 font-sans mb-3 text-center">How was your experience?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="text-3xl transition-all duration-200 transform hover:scale-110 cursor-pointer"
                      >
                        {star <= (hoveredRating || rating) ? (
                          <span className="text-[#862633]">🥖</span>
                        ) : (
                          <span className="opacity-20 grayscale">🥖</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-sans mb-2">Additional Comments</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share your feedback..."
                    className="w-full px-3 py-2 border-2 border-[#e0d5ce] rounded-lg focus:outline-none focus:border-[#862633] resize-none font-sans text-xs transition-all"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleSubmitFeedback}
                  className="w-full bg-[#862633] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#6b1f29] transition-all duration-200 font-sans"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Shop Your Favorites Section */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <div className="bg-gradient-to-r from-[#862633] to-[#a8334a] text-white p-6">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} />
              <h3 className="text-lg font-serif font-bold">Shop Your Favorites</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <a
                href="https://www.bakersdelight.com.au/products/sourdough-vienna"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/product-sourdough.png"
                  alt="Sourdough Vienna"
                  width={120}
                  height={120}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <p className="text-xs font-sans text-center text-gray-700">Sourdough Vienna</p>
              </a>
              <a
                href="https://www.bakersdelight.com.au/products/choc-mud-scone"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/product-scone.png"
                  alt="Choc Mud Scone"
                  width={120}
                  height={120}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <p className="text-xs font-sans text-center text-gray-700">Choc Mud Scone</p>
              </a>
              <a
                href="https://www.bakersdelight.com.au/products/apple-cinnamon-hot-cross-bun-6-pack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/product-hcb.png"
                  alt="Apple & Cinnamon Hot Cross Bun 6 Pack"
                  width={120}
                  height={120}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <p className="text-xs font-sans text-center text-gray-700">Apple & Cinnamon Hot Cross Bun 6 Pack</p>
              </a>
              <a
                href="https://www.bakersdelight.com.au/products/mediterranean-pizza"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/product-pizza.png"
                  alt="Mediterranean Pizza"
                  width={120}
                  height={120}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <p className="text-xs font-sans text-center text-gray-700">Mediterranean Pizza</p>
              </a>
            </div>
            <div className="flex justify-center px-4">
              <a
                href="https://www.bakersdelight.com.au/collections/all-products"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#862633] text-white py-3 px-12 rounded-xl font-semibold text-sm hover:bg-[#6b1f29] transition-all duration-200 text-center"
              >
                Shop All
              </a>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <div className="bg-[#862633] text-white p-6 flex items-center gap-3">
            <HelpCircle size={18} />
            <h3 className="text-lg font-serif font-bold">Need Help?</h3>
          </div>

          <div className="p-6 flex gap-3">
            <a
              href="https://wa.me/919620921294"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border-2 border-[#e0d5ce] text-[#862633] py-3 px-3 rounded-xl font-semibold text-xs hover:border-[#862633] transition-all duration-200 flex flex-col items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Chat
            </a>
            <a
              href="tel:+919620921294"
              className="flex-1 border-2 border-[#e0d5ce] text-[#862633] py-3 px-3 rounded-xl font-semibold text-xs hover:border-[#862633] transition-all duration-200 flex flex-col items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call
            </a>
            <a
              href="mailto:sagar.p@proenx.com"
              className="flex-1 border-2 border-[#e0d5ce] text-[#862633] py-3 px-3 rounded-xl font-semibold text-xs hover:border-[#862633] transition-all duration-200 flex flex-col items-center justify-center gap-2"
            >
              <Mail size={20} />
              Email
            </a>
          </div>
        </div>

        {/* Connect with Us Section */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <div className="bg-[#862633] text-white p-6">
            <div className="flex items-center gap-3">
              <Globe size={20} />
              <h3 className="text-lg font-serif font-bold">Connect With Us</h3>
            </div>
          </div>

          <div className="p-8 flex justify-center gap-10">
            <a
              href="https://www.instagram.com/bakersdelight/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
              title="Instagram"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#e0d5ce] flex items-center justify-center text-[#862633] group-hover:border-[#862633] group-hover:bg-[#862633] group-hover:text-white transition-all duration-300">
                <Instagram size={22} />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#862633]">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/bakersdelight/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
              title="Facebook"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#e0d5ce] flex items-center justify-center text-[#862633] group-hover:border-[#862633] group-hover:bg-[#862633] group-hover:text-white transition-all duration-300">
                <Facebook size={22} />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#862633]">Facebook</span>
            </a>
            <a
              href="https://www.bakersdelight.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
              title="Website"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#e0d5ce] flex items-center justify-center text-[#862633] group-hover:border-[#862633] group-hover:bg-[#862633] group-hover:text-white transition-all duration-300">
                <Globe size={22} />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#862633]">Website</span>
            </a>
          </div>
        </div>

        {/* Store Details & Terms */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-[#e0d5ce]">
          <button
            onClick={() => setShowStoreDetails(!showStoreDetails)}
            className="w-full bg-[#862633] text-white p-6 flex items-center justify-between hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <h3 className="text-lg font-serif font-bold">Store Details & Terms</h3>
            </div>
            <ChevronDown size={20} className={`transition-transform duration-300 ${showStoreDetails ? 'rotate-180' : ''}`} />
          </button>

          {showStoreDetails && (
            <div className="p-6 space-y-4 border-t border-[#e0d5ce]">
              <div className="text-center space-y-3">
                <div>
                  <p className="font-semibold text-xs text-gray-800 font-sans mb-1">📍 Location</p>
                  <p className="text-xs text-gray-600 font-sans">123 Martin Place, Sydney CBD NSW 2000</p>
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-800 font-sans mb-1">⏰ Trading Hours</p>
                  <p className="text-xs text-gray-600 font-sans">Mon-Fri: 7:00 AM - 7:00 PM</p>
                  <p className="text-xs text-gray-600 font-sans">Sat-Sun: 8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-800 font-sans mb-1">📞 Contact</p>
                  <p className="text-xs text-gray-600 font-sans">1300 273 273</p>
                  <p className="text-xs text-gray-600 font-sans">info@bakerdelight.com.au</p>
                </div>
              </div>

              <div className="border-t border-[#e0d5ce] pt-4 flex gap-2 justify-center">
                <a href="https://www.bakersdelight.com.au/pages/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#862633] hover:underline text-xs font-sans font-semibold">Terms & Conditions</a>
                <span className="text-gray-400">•</span>
                <a href="https://www.bakersdelight.com.au/pages/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#862633] hover:underline text-xs font-sans font-semibold">Privacy Policy</a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 py-3">
          <p className="text-xs text-gray-600 font-sans">Powered by <a href="https://www.rdep.io" target="_blank" rel="noopener noreferrer" className="hover:underline"><Image src="/images/rdep-logo.png" alt="RDEP" width={40} height={20} className="inline h-4 w-auto object-contain" /></a></p>
        </div>
      </div>

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-[#862633] text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold">Transaction History</h3>
              <button
                onClick={() => setShowTransactionHistory(false)}
                className="text-2xl hover:opacity-75 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-3">
              {transactionHistory.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => {
                    setCurrentReceiptId(transaction.id)
                    setShowTransactionHistory(false)
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${currentReceiptId === transaction.id
                    ? 'bg-[#fdfaf7] border-[#862633]'
                    : 'bg-white border-[#e0d5ce] hover:border-[#862633]'
                    }`}
                >
                  <p className="text-xs text-gray-500 font-sans mb-1">{transaction.date}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-base font-semibold text-[#862633] font-sans">{transaction.branch}</p>
                    <p className="text-sm font-serif font-bold text-[#862633]">${transaction.amount.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

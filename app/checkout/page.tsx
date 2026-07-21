'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Lock, CreditCard, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, cn, generateOrderNumber } from '@/lib/utils';
import { CRLogo } from '@/components/ui/Logo';
import { SHIPPING_METHODS, PAYMENT_METHODS } from '@/constants';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review' | 'success';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = getSubtotal();
  const tax = subtotal * 0.2; // 20% mock tax
  const shippingCost = 0; // Default standard
  const total = subtotal + tax + shippingCost;

  const handleNextStep = (next: CheckoutStep) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(next);
    if (next === 'success') {
      setOrderNumber(generateOrderNumber());
      clearCart();
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  const currentStepIdx = steps.findIndex(s => s.id === step);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cr-black flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-md w-full bg-[#111] p-10 text-center border border-white/10"
        >
          <div className="w-16 h-16 bg-cr-gold rounded-full flex items-center justify-center mx-auto mb-6 text-cr-black">
            <Check size={32} />
          </div>
          <h1 className="font-serif text-3xl font-light text-white mb-2">Order Confirmed</h1>
          <p className="text-white/60 text-sm mb-8">Thank you for your purchase. Your order number is <strong className="text-white">{orderNumber}</strong></p>
          <div className="space-y-4">
            <Link href="/dashboard/orders" className="block w-full bg-white text-cr-black py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-cr-gold transition-colors">
              View Order Details
            </Link>
            <Link href="/shop" className="block w-full border border-white/20 text-white py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-white/10 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cr-black flex flex-col">
      {/* Checkout Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] py-6 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <CRLogo variant="full" size="sm" className="text-white" href="/" />
        <div className="flex items-center gap-2 text-white/50 text-[10px] tracking-[0.2em] uppercase">
          <Lock size={12} /> Secure Checkout
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 px-4 sm:px-8 py-10 lg:py-16">
        
        {/* Left Column - Forms */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col order-2 lg:order-1">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10 -z-10" />
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-cr-black px-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors",
                  i < currentStepIdx ? "bg-cr-gold text-cr-black" : i === currentStepIdx ? "border-2 border-cr-gold text-cr-gold bg-cr-black" : "bg-white/10 text-white/40"
                )}>
                  {i < currentStepIdx ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn(
                  "text-[9px] tracking-[0.2em] uppercase",
                  i <= currentStepIdx ? "text-white" : "text-white/40"
                )}>{s.label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <h2 className="font-serif text-3xl font-light text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wide text-white/60 uppercase">First Name</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="Sophia" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wide text-white/60 uppercase">Last Name</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="Laurent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-wide text-white/60 uppercase">Email Address</label>
                  <input type="email" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="sophia.laurent@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-wide text-white/60 uppercase">Address Line 1</label>
                  <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="15 Mayfair Gardens" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wide text-white/60 uppercase">City</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="London" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wide text-white/60 uppercase">Postal Code</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" defaultValue="W1K 5AR" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-wide text-white/60 uppercase">Country</label>
                  <select className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors appearance-none">
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button onClick={() => handleNextStep('delivery')} className="w-full bg-white text-cr-black py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-cr-gold transition-colors">
                    Continue to Delivery
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'delivery' && (
              <motion.div key="delivery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setStep('shipping')} className="text-white/50 hover:text-white"><ChevronLeft size={20} /></button>
                  <h2 className="font-serif text-3xl font-light text-white">Delivery Method</h2>
                </div>
                <div className="space-y-4">
                  {SHIPPING_METHODS.map((method, idx) => (
                    <label key={method.id} className="flex items-start gap-4 p-5 border border-white/10 bg-[#111] cursor-pointer hover:border-white/30 transition-colors">
                      <input type="radio" name="shipping" defaultChecked={idx === 0} className="mt-1 w-4 h-4 accent-cr-gold" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium text-sm">{method.name}</span>
                          <span className="text-cr-gold text-sm">{method.free ? 'Complimentary' : formatPrice(method.price)}</span>
                        </div>
                        <p className="text-white/50 text-xs">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="pt-6">
                  <button onClick={() => handleNextStep('payment')} className="w-full bg-white text-cr-black py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-cr-gold transition-colors">
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setStep('delivery')} className="text-white/50 hover:text-white"><ChevronLeft size={20} /></button>
                  <h2 className="font-serif text-3xl font-light text-white">Payment</h2>
                </div>
                <div className="space-y-4">
                  <label className="block p-5 border border-cr-gold bg-[#111] cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-cr-gold" />
                      <span className="text-white font-medium text-sm flex items-center gap-2"><CreditCard size={16} /> Credit / Debit Card</span>
                    </div>
                    <div className="space-y-4 pl-7">
                      <input type="text" placeholder="Card Number" className="w-full bg-cr-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="w-full bg-cr-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" />
                        <input type="text" placeholder="CVC" className="w-full bg-cr-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" />
                      </div>
                      <input type="text" placeholder="Name on Card" className="w-full bg-cr-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cr-gold transition-colors" />
                    </div>
                  </label>
                  {PAYMENT_METHODS.filter(m => m.id !== 'card').map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-5 border border-white/10 bg-[#111] cursor-pointer hover:border-white/30 transition-colors">
                      <input type="radio" name="payment" className="w-4 h-4 accent-cr-gold" />
                      <span className="text-white font-medium text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-6">
                  <button onClick={() => handleNextStep('review')} className="w-full bg-white text-cr-black py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-cr-gold transition-colors">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setStep('payment')} className="text-white/50 hover:text-white"><ChevronLeft size={20} /></button>
                  <h2 className="font-serif text-3xl font-light text-white">Review Order</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#111] p-6 border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white text-[11px] tracking-[0.2em] uppercase">Shipping To</h3>
                      <button onClick={() => setStep('shipping')} className="text-cr-gold text-[10px] uppercase hover:underline">Edit</button>
                    </div>
                    <div className="text-white/60 text-sm leading-relaxed">
                      Sophia Laurent<br />
                      15 Mayfair Gardens<br />
                      London, W1K 5AR<br />
                      United Kingdom
                    </div>
                  </div>
                  <div className="bg-[#111] p-6 border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white text-[11px] tracking-[0.2em] uppercase">Payment</h3>
                      <button onClick={() => setStep('payment')} className="text-cr-gold text-[10px] uppercase hover:underline">Edit</button>
                    </div>
                    <div className="text-white/60 text-sm leading-relaxed">
                      Visa ending in 4242<br />
                      Billing address same as shipping
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button onClick={() => handleNextStep('success')} className="w-full bg-cr-gold text-cr-black py-4 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
                    <Lock size={14} /> Place Order
                  </button>
                  <p className="text-center text-white/30 text-[10px] mt-4 tracking-wide">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 mb-8 lg:mb-0">
          <div className="bg-[#111] border border-white/10 p-6 lg:p-8 sticky top-28">
            <h3 className="text-white text-[11px] tracking-[0.3em] uppercase mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-white/5 shrink-0 border border-white/10">
                    <Image src={item.image} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-cr-black text-white text-[10px] flex items-center justify-center rounded-full border border-white/20">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-white text-xs font-medium truncate">{item.product.name}</h4>
                    <p className="text-white/50 text-[10px] mt-1">{item.color} â₹¢ {item.size}</p>
                    <p className="text-white text-xs mt-2">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 py-6 space-y-3">
              <div className="flex justify-between text-white/60 text-xs">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-xs">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-xs">
                <span>Estimated Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between text-white text-lg font-light mb-6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <div className="flex items-center gap-3 text-white/40 text-[10px] bg-white/5 p-4 border border-white/5">
                <ShieldCheck size={16} className="text-cr-gold shrink-0" />
                <p>Your payment information is encrypted and securely processed.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


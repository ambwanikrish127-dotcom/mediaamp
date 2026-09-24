import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FoodService } from '../services/api';
import { IFoodItem, ISelectedSnack } from '../types';
import {
  Popcorn,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const SnacksPage: React.FC = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    // Check if user came with valid seat selection
    const savedDraft = sessionStorage.getItem('cinebook_booking_draft');
    if (!savedDraft) {
      navigate('/movies');
      return;
    }
    const parsed = JSON.parse(savedDraft);
    setDraft(parsed);

    FoodService.getFoodItems()
      .then(res => {
        if (res.success) {
          setFoodItems(res.foodItems);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const categories = ['All', 'Combos', 'Popcorn', 'Beverages', 'Snacks'];

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const filteredItems = selectedCategory === 'All'
    ? foodItems
    : foodItems.filter(f => f.category === selectedCategory);

  // Calculate snack amount
  const snacksTotal = Object.entries(quantities).reduce((sum, [id, qty]) => {
    if (qty <= 0) return sum;
    const item = foodItems.find(f => f._id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  // Proceed to Checkout
  const handleProceedToCheckout = (skipSnacks = false) => {
    const selectedSnacks: { foodItemId: string; name: string; price: number; quantity: number }[] = [];

    if (!skipSnacks) {
      Object.entries(quantities).forEach(([id, qty]) => {
        if (qty > 0) {
          const item = foodItems.find(f => f._id === id);
          if (item) {
            selectedSnacks.push({
              foodItemId: item._id,
              name: item.name,
              price: item.price,
              quantity: qty
            });
          }
        }
      });
    }

    const updatedDraft = {
      ...draft,
      snacks: selectedSnacks,
      snackAmount: skipSnacks ? 0 : snacksTotal
    };

    sessionStorage.setItem('cinebook_booking_draft', JSON.stringify(updatedDraft));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading gourmet cinema concessions and combos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-32">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pre-Order Concessions (Optional)</span>
              </div>
              <h1 className="text-xl font-black text-white">
                Add Snacks & Beverages?
              </h1>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={() => handleProceedToCheckout(true)}
            className="self-end sm:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700"
          >
            Skip to Checkout →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const qty = quantities[item._id] || 0;

            return (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {item.image}
                    </div>
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      ₹{item.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium">Quantity:</span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="w-6 h-6 rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Total Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">
                {totalItemsCount > 0 ? `${totalItemsCount} Snack item(s) selected` : 'No snacks added'}
              </span>
              <div className="text-lg font-black text-white">
                Snacks Total: <span className="text-amber-400 font-mono">₹{snacksTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleProceedToCheckout(true)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition"
            >
              Skip Snacks
            </button>

            <button
              onClick={() => handleProceedToCheckout(false)}
              className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-rose-600/30"
            >
              <span>{totalItemsCount > 0 ? 'Proceed to Order Summary' : 'Continue to Checkout'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Ticket } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Film, Calendar, Clock, Sparkles, Check, Trash2, CreditCard, Armchair } from "lucide-react";

const cities = ["New York City", "Los Angeles", "Chicago", "London"];
const theaters: Record<string, string[]> = {
  "New York City": ["AMC Lincoln Square 13 (IMAX)", "El Capitan Theatre NYC", "Regal Union Square"],
  "Los Angeles": ["TCL Chinese Theatre", "El Capitan Theatre Hollywood", "AMC Century City 15"],
  "Chicago": ["Regal City Centre", "AMC River East 21", "Showplace ICON Theatre"],
  "London": ["BFI IMAX Waterloo", "Odeon Luxe Leicester Square", "Picturehouse Central"]
};
const dates = ["Fri, July 24, 2026", "Sat, July 25, 2026", "Sun, July 26, 2026", "Mon, July 27, 2026"];
const showtimes = [
  { time: "11:30 AM", format: "Standard 2D", price: 14.50 },
  { time: "3:15 PM", format: "RealD 3D", price: 17.50 },
  { time: "7:00 PM", format: "IMAX 3D Laser", price: 21.00 },
  { time: "10:45 PM", format: "Dolby Cinema", price: 19.50 }
];

// 6x8 seat configuration
const SEAT_ROWS = ["A", "B", "C", "D", "E", "F"];
const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TicketBooking() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedTheater, setSelectedTheater] = useState(theaters[cities[0]][0]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[2]); // 7:00 PM default
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedTickets, setBookedTickets] = useState<Ticket[]>([]);

  // Checkout States
  const [checkoutStep, setCheckoutStep] = useState<"booking" | "payment" | "success">("booking");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  // Seed occupied seats randomly based on date & showtime selection
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  // Track theater changes to sync theater selector when city changes
  useEffect(() => {
    setSelectedTheater(theaters[selectedCity][0]);
  }, [selectedCity]);

  // Generate random occupied seats when movie slot changes
  useEffect(() => {
    const seed: string[] = [];
    SEAT_ROWS.forEach((row) => {
      SEAT_COLS.forEach((col) => {
        // 35% chance to be occupied
        if (Math.random() < 0.35) {
          seed.push(`${row}${col}`);
        }
      });
    });
    setOccupiedSeats(seed);
    setSelectedSeats([]); // Reset choices
  }, [selectedCity, selectedTheater, selectedDate, selectedShowtime]);

  // Load booked tickets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("spiderman_booked_tickets");
    if (saved) {
      try {
        setBookedTickets(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return;
    setCheckoutStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    // Create ticket object
    const newTicket: Ticket = {
      id: "TKT-" + Math.floor(Math.random() * 900000 + 100000),
      city: selectedCity,
      theater: selectedTheater,
      date: selectedDate,
      time: selectedShowtime.time,
      seats: selectedSeats,
      totalPrice: Number((selectedSeats.length * selectedShowtime.price).toFixed(2)),
      format: selectedShowtime.format,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SPIDEY-HULK-${Date.now()}`,
      bookedAt: new Date().toLocaleString()
    };

    const updated = [newTicket, ...bookedTickets];
    setBookedTickets(updated);
    localStorage.setItem("spiderman_booked_tickets", JSON.stringify(updated));

    setCheckoutStep("success");
    setSelectedSeats([]);
  };

  const handleDeleteTicket = (ticketId: string) => {
    const filtered = bookedTickets.filter((t) => t.id !== ticketId);
    setBookedTickets(filtered);
    localStorage.setItem("spiderman_booked_tickets", JSON.stringify(filtered));
  };

  return (
    <div id="ticket-booking-section" className="py-16 px-4 max-w-7xl mx-auto z-10 relative">
      <div className="text-center mb-10">
        <span className="px-3 py-1 text-xs font-mono uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded-full tracking-wider">
          Daily Bugle Ticketing Center
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-white mt-3 uppercase">
          Avengers Tickets Wallet
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-2 text-sm">
          Immersive cinema ticket booking interface. Select your seating chart and book your opening weekend premium experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Controls & Seating Map */}
        <div className="lg:col-span-8 space-y-6">
          
          {checkoutStep === "booking" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl space-y-6">
              
              {/* Form select triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-500 uppercase flex items-center space-x-1">
                    <MapPin className="w-3 h-3" /> <span>City Location</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-black/30 text-white font-mono text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/30"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-slate-950 text-white">{city}</option>
                    ))}
                  </select>
                </div>

                {/* Theater */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-500 uppercase flex items-center space-x-1">
                    <Film className="w-3 h-3" /> <span>Theatre</span>
                  </label>
                  <select
                    value={selectedTheater}
                    onChange={(e) => setSelectedTheater(e.target.value)}
                    className="w-full bg-black/30 text-white font-mono text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/30"
                  >
                    {theaters[selectedCity].map((th) => (
                      <option key={th} value={th} className="bg-slate-950 text-white">{th}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-500 uppercase flex items-center space-x-1">
                    <Calendar className="w-3 h-3" /> <span>Select Date</span>
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/30 text-white font-mono text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/30"
                  >
                    {dates.map((d) => (
                      <option key={d} value={d} className="bg-slate-950 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                {/* Showtime Slot */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-500 uppercase flex items-center space-x-1">
                    <Clock className="w-3 h-3" /> <span>Time Format</span>
                  </label>
                  <select
                    value={JSON.stringify(selectedShowtime)}
                    onChange={(e) => setSelectedShowtime(JSON.parse(e.target.value))}
                    className="w-full bg-black/30 text-white font-mono text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/30"
                  >
                    {showtimes.map((st) => (
                      <option key={st.time} value={JSON.stringify(st)} className="bg-slate-950 text-white">
                        {st.time} ({st.format})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Seating Map Container */}
              <div className="border-t border-white/10 pt-6 space-y-6">
                <div className="text-center">
                  <span className="text-xs font-mono text-zinc-500">SCREEN STAGE THIS WAY</span>
                  <div className="w-full h-1 bg-gradient-to-r from-red-500/80 via-yellow-400/80 to-emerald-500/80 rounded-full mt-1.5 shadow-[0_0_12px_rgba(239,68,68,0.3)]" />
                </div>

                {/* Seating Layout Grid */}
                <div className="flex flex-col items-center space-y-2 py-4">
                  {SEAT_ROWS.map((row) => (
                    <div key={row} className="flex items-center space-x-2 sm:space-x-3">
                      <span className="w-5 text-right font-mono text-zinc-600 text-xs font-bold mr-1">{row}</span>
                      
                      {SEAT_COLS.map((col) => {
                        const seatId = `${row}${col}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        let seatColor = "bg-white/5 hover:bg-white/15 text-zinc-400 border-white/10";
                        if (isOccupied) {
                          seatColor = "bg-black/40 border-transparent cursor-not-allowed opacity-30";
                        } else if (isSelected) {
                          seatColor = "bg-red-600/90 text-white border-white/20 shadow-[0_0_12px_rgba(239,68,68,0.5)]";
                        }

                        return (
                          <button
                            key={col}
                            onClick={() => handleSeatClick(seatId)}
                            disabled={isOccupied}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border text-[9px] font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${seatColor}`}
                            title={`Seat ${seatId}`}
                          >
                            <Armchair className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                      
                      <span className="w-5 text-left font-mono text-zinc-600 text-xs font-bold ml-1">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Seat Legends */}
                <div className="flex justify-center space-x-6 text-xs font-mono text-zinc-400">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-white/5 border border-white/10 rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-red-600 border border-white/20 rounded shadow-[0_0_4px_rgba(239,68,68,0.6)]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-black/40 border border-transparent rounded opacity-30" />
                    <span>Occupied</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {checkoutStep === "payment" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
              <h3 className="text-xl font-sans font-black tracking-tight text-white uppercase border-b border-white/10 pb-3 mb-4">
                Avenger-Protocol Booking Confirmation
              </h3>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-500 uppercase block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peter Parker"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-black/30 text-white p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-500 uppercase block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. webslinger@queens.org"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-black/30 text-white p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-2">
                  <h4 className="text-xs font-mono text-yellow-500 uppercase font-bold flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Free Immersive Ticket Check Out (No Real Cost)</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    This is an ultra-realistic simulator. Enter any card placeholder details to authorize and populate your digital ticket wallet.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs font-mono col-span-2 text-white focus:outline-none"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="CVV / EXP"
                      className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-white"
                      disabled
                      value="724 / 07-26"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("booking")}
                    className="px-4 py-2 bg-white/5 text-zinc-300 font-mono text-xs border border-white/10 rounded-xl cursor-pointer hover:bg-white/10"
                  >
                    Back to Seats
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600/85 hover:bg-emerald-700/85 text-white font-sans font-bold text-xs uppercase border border-white/20 rounded-xl shadow-lg cursor-pointer"
                  >
                    Confirm & Print Tickets
                  </button>
                </div>
              </form>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl shadow-2xl text-center space-y-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500">
                <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-sans font-black tracking-tight text-white uppercase">
                TICKETS BOOKED SUCCESSFULLY!
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Your authorization code is registered on the S.H.I.E.L.D. spatial ledger. Your ticket stub has been printed and stored below in your Ticket Wallet!
              </p>
              <button
                onClick={() => setCheckoutStep("booking")}
                className="px-6 py-2 bg-white/5 text-yellow-400 font-mono text-xs uppercase border border-yellow-500/40 rounded-xl cursor-pointer hover:bg-white/10"
              >
                Book More Seats
              </button>
            </div>
          )}

        </div>

        {/* Right Hand: Ticket Booking summary / Persistent Wallet */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active selection summary */}
          {checkoutStep === "booking" && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-lg font-sans font-black tracking-tight text-white uppercase border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Summary Stub</span>
                <span className="text-xs font-mono text-red-400">STREET LEVEL</span>
              </h3>

              <div className="space-y-2.5 text-xs font-mono text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">STATION:</span>
                  <span className="text-white font-bold">{selectedCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">THEATRE:</span>
                  <span className="text-white font-bold">{selectedTheater}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">DATE:</span>
                  <span className="text-white font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">SLOT TIME:</span>
                  <span className="text-white font-bold">{selectedShowtime.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">FORMAT:</span>
                  <span className="text-emerald-400 font-bold">{selectedShowtime.format}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-zinc-500">SEATS SELECTED:</span>
                  <span className="text-white font-bold max-w-44 text-right">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None Chosen"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                  <span className="text-zinc-400">TOTAL COST:</span>
                  <span className="text-yellow-400 font-black">
                    ${(selectedSeats.length * selectedShowtime.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 font-sans font-black text-center text-xs uppercase border border-white/10 rounded-xl cursor-pointer transition-all ${
                  selectedSeats.length > 0
                    ? "bg-red-600/80 hover:bg-red-700/80 text-white shadow-md"
                    : "bg-white/5 text-zinc-600 border-white/5 cursor-not-allowed"
                }`}
              >
                PROCEED TO BOOKING ({selectedSeats.length} SEATS)
              </button>
            </div>
          )}

          {/* Ticket Wallet list */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-lg font-sans font-black tracking-tight text-white uppercase border-b border-white/10 pb-2 flex items-center justify-between">
              <span>🎟️ Ticket Wallet</span>
              <span className="text-xs font-mono bg-emerald-600/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                {bookedTickets.length} SAVED
              </span>
            </h3>

            {bookedTickets.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/10 bg-black/10 rounded-xl p-4">
                <p className="text-xs font-mono text-zinc-500">
                  Your ticket wallet is empty. Make a selection on the seating chart to book a simulated Avengers-protocol pass!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {bookedTickets.map((ticket) => (
                  <div key={ticket.id} className="relative bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] font-mono space-y-2 group shadow-inner">
                    
                    {/* Trash delete */}
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="absolute right-2 top-2 text-zinc-500 hover:text-red-500 cursor-pointer"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex justify-between">
                      <span className="text-zinc-500">ID: {ticket.id}</span>
                      <span className="text-emerald-400 font-bold">{ticket.format}</span>
                    </div>
                    
                    <div>
                      <span className="text-zinc-500 block uppercase">Theatre:</span>
                      <span className="text-white font-bold">{ticket.theater} ({ticket.city})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-zinc-500 block uppercase">Date:</span>
                        <span className="text-white">{ticket.date}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase">Time:</span>
                        <span className="text-white">{ticket.time}</span>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <div>
                        <span className="text-zinc-500 block uppercase">Seats:</span>
                        <span className="text-white font-bold">{ticket.seats.join(", ")}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 block uppercase">Authorized Price:</span>
                        <span className="text-yellow-400 font-bold">${ticket.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* QR Code container */}
                    <div className="flex items-center space-x-3 bg-black/30 p-2 rounded-xl border border-white/10 mt-2">
                      <img
                        src={ticket.qrCode}
                        alt="Cinema ticket QR Code"
                        className="w-12 h-12 bg-white rounded flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">
                          S.H.I.E.L.D. Ledger Signature
                        </span>
                        <span className="text-[8px] text-zinc-400 block break-all font-mono leading-tight">
                          SPIDEY-HULK-STAMP-OK
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

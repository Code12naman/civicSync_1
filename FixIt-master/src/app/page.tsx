// Neatify-styled Landing Page (pixel-perfect)
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Navbar */}
      <header className="w-full border-b border-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center"> 
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow">
              <svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M12 2l4 4-4 4-4-4 4-4zm0 8l8 8H4l8-8z"/></svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">CivicSync</span>
          </div>
          <nav className="flex-1 hidden md:flex items-center justify-center gap-8 text-sm text-gray-700">
            <Link href="#services" className="hover:text-primary font-medium">How It Works</Link>
            <Link href="#about" className="hover:text-primary font-medium">Issues</Link>
            <Link href="#pricing" className="hover:text-primary font-medium">Dashboard</Link>
            <Link href="#testimonials" className="hover:text-primary font-medium">Authorities</Link>
            <Link href="#blog" className="hover:text-primary font-medium">Impact</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/login/citizen"
              className="inline-flex items-center rounded-lg bg-secondary text-secondary-foreground px-4 py-2 font-semibold shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Citizen
            </a>
            <a
              href="/login/admin"
              className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow hover:bg-[#28c466] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Report <span className="text-primary">Today.</span> Resolve Tomorrow.
            </h1>
            <p className="mt-5 text-gray-700 text-lg">CivicSync connects citizens and local authorities on a single transparent platform to report, track, and resolve civic issues in real time ensuring accountability and faster action for cleaner, safer cities.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="/citizen/dashboard/report" className="inline-flex items-center rounded-lg bg-primary text-white px-5 py-3 font-semibold shadow hover:bg-[#28c466] focus:outline-none focus:ring-2 focus:ring-primary">Report an Issue</a>
              <a href="#pricing" className="inline-flex items-center rounded-lg bg-secondary text-secondary-foreground px-5 py-3 font-semibold shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary">See How It Works</a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 text-yellow-500">★</div>
                <span className="text-sm text-gray-700">Used Across Multiple Cities</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow border border-border">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary"><path fill="currentColor" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6z"/></svg>
                <span className="text-sm font-medium">Faster Resolution Times</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-[#eaf7f1] p-4 md:p-6 shadow">
              <img src="/aaca8ac102255c3e3dae66d58fb09b84.jpg" alt="Professional cleaner holding tools" width={720} height={720} className="rounded-2xl object-cover" />
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {title:'Verified Issue Reporting',icon:'M12 2 17 7 12 12 7 7z'},
            {title:'Real-Time Status Tracking',icon:'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 .9-1.5-3.9-2.3V7z'},
            {title:'Authority Accountability',icon:'M5 4h14v4H5V4zm0 6h14v10H5V10z'},
            {title:'Cleaner & Safer Cities',icon:'M12 2C7 6 6 12 12 22c6-10 5-16 0-20z'},
          ].map((f,i)=> (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow border border-border">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary"><path d={f.icon} fill="currentColor"/></svg>
              <span className="font-semibold text-gray-900">{f.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow border border-border">
            <img
              src="/Bridging%20_The%20Talent%20Gap_%20Panel%20discussion%20IBcon%20-%20AutomatedBuildings_com.jpeg"
              alt="Construction team in modern facility"
              width={800}
              height={700}
              className="object-cover"
            />
          </div>
          <div>
            <p className="uppercase tracking-wider text-sm text-gray-500">Who We Are</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Building Transparent and <span className="text-primary">Accountable Cities</span> Through Technology</h2>
            <p className="mt-4 text-gray-700">CivicSync is a smart civic platform that enables citizens to report issues and track resolutions in real time, while helping authorities act faster through transparent, data-driven workflows.</p>
            <ul className="mt-6 space-y-3 text-gray-800">
              <li className="flex items-start gap-3"><span className="h-5 w-5 rounded bg-primary text-white inline-flex items-center justify-center">✓</span> Verified issue reporting with location and media</li>
              <li className="flex items-start gap-3"><span className="h-5 w-5 rounded bg-primary text-white inline-flex items-center justify-center">✓</span> Real-time status tracking for transparency</li>
              <li className="flex items-start gap-3"><span className="h-5 w-5 rounded bg-primary text-white inline-flex items-center justify-center">✓</span> Faster resolution through authority dashboards</li>
            </ul>
            <div className="mt-7 flex gap-3">
              <a href="/citizen/dashboard/report" className="inline-flex items-center rounded-lg bg-secondary text-secondary-foreground px-5 py-2 font-semibold shadow hover:brightness-105">Report an Issue</a>
              <a href="#about" className="inline-flex items-center rounded-lg bg-primary text-white px-5 py-2 font-semibold shadow hover:bg-[#28c466]">How It Works</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {num:'2+ Years ',label:'Pilot Usage'},
            {num:'20K+',label:'Issues Reported'},
            {num:'95% ',label:'Verified Reports'},
            {num:'100+ ',label:'Cities Impacted'},
          ].map((s,i)=> (
            <div key={i} className="rounded-2xl bg-white p-6 text-center shadow border border-border">
              <div className="text-2xl font-extrabold text-primary">{s.num}</div>
              <div className="mt-1 text-gray-800 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">City Issues, Solved Smarter</h3>
            <a href="#services" className="hidden md:inline-flex items-center rounded-lg bg-secondary text-secondary-foreground px-4 py-2 font-semibold shadow hover:brightness-105">Get Started  →</a>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {title:'Pothole & Road Damage',img:'/Large%20pothole%20on%20a%20road%20with%20crumbling%20asphalt%20and%20dirt_%20Road%20damage%20stock%20images.jpeg'},
              {title:'Garbage & Sanitation',img:'/Recycle%20problem%20Stock%20Illustration.jpeg'},
              {title:'Streetlight & Utilities',img:'/Sem%C3%A1foros%20nas%20imagens%20de%20ilustra%C3%A7%C3%A3o%20de%20rua%20_%20imagem%20Premium%20gerada%20com%20IA.jpeg'},
            ].map((card,i)=> (
              <a key={i} href="#services" className="group relative rounded-2xl overflow-hidden shadow border border-border">
                <Image src={card.img} alt={card.title} width={800} height={600} className="h-64 w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-white font-semibold text-lg drop-shadow">{card.title}</span>
                  <span className="hidden group-hover:inline-flex px-3 py-1 rounded-lg bg-white text-gray-900 text-sm font-semibold shadow">View</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="text-3xl font-extrabold text-gray-900 text-center">What Citizens Say About FixIt</h3>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {name:'Priya Sharma',quote:'I reported a pothole near my house and it was verified within hours. The tracking feature kept me updated throughout!',img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'},
            {name:'Rajesh Kumar',quote:'FixIt makes reporting garbage issues simple and transparent. Finally, a platform where our voices are heard.',img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'},
            {name:'Ananya Iyer',quote:'AI verification helped us prioritize genuine complaints faster. This is exactly what our city needed for accountability.',img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'},
          ].map((t,i)=> (
            <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow flex flex-col">
              <div className="flex items-center gap-3">
                <Image src={t.img} alt={t.name} width={44} height={44} className="rounded-full object-cover"/>
                <div className="font-semibold">{t.name}</div>
              </div>
              <p className="mt-4 text-gray-700">{t.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#134e4a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M12 2l4 4-4 4-4-4 4-4zm0 8l8 8H4l8-8z"/></svg>
              </div>
              <span className="text-xl font-extrabold">FixIt</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">Report. Verify. Resolve. Making cities smarter through citizen action.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Report Civic Issues</li>
              <li>AI Issue Verification</li>
              <li>Issue Tracking & Resolution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>About FixIt</li>
              <li>How It Works</li>
              <li>Impact & Analytics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>support@fixit.app</li>
              <li>Smart City Dashboard</li>
              <li>Municipality Collaboration</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-gray-300">© {new Date().getFullYear()} FixIt. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}

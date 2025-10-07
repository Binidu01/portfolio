// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

type Skill = { name: string; level: number; category: string; icon: string };
type Experience = { year: string; role: string; company: string; description: string; logo?: string };
type ContactForm = { name: string; email: string; subject: string; message: string };

/** Reusable reveal hook (works for sections) */
const useReveal = (threshold = 0.12) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setVisible(true),
        { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/** Circular progress SVG used in Skills */
const CircularProgress: React.FC<{ size?: number; stroke?: number; value: number; label?: string }> = ({
                                                                                                         size = 84,
                                                                                                         stroke = 8,
                                                                                                         value,
                                                                                                         label,
                                                                                                       }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} className="block">
          <defs>
            <linearGradient id="g1" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <circle r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="transparent" />
            <circle
                r={radius}
                stroke="url(#g1)"
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90)"
            />
          </g>
        </svg>
        <div className="text-sm text-gray-300 font-semibold">{label}</div>
      </div>
  );
};

export default function HomePage(): JSX.Element {
  const [section, setSection] = useState<"home" | "work" | "skills" | "experience" | "contact">("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // contact
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // reveals
  const heroReveal = useReveal(0.2);
  const workReveal = useReveal(0.08);
  const skillsReveal = useReveal(0.08);
  const expReveal = useReveal(0.08);
  const contactReveal = useReveal(0.08);

  // sample data
  const projects: Project[] = [
    {
      id: 1,
      title: "NeoBank Platform",
      description: "Digital banking with real-time analytics, polished UX and multi-tenant architecture.",
      tech: ["React", "Node.js", "Postgres"],
      image: "https://images.unsplash.com/photo-1556529328-4f1b9a8c0a3a?w=1400&q=80&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Quantum AI Assistant",
      description: "NLP assistant with predictive workflows for enterprise users.",
      tech: ["Python", "TensorFlow", "FastAPI"],
      image: "https://images.unsplash.com/photo-1526378723911-9ca4a6bfa14f?w=1400&q=80&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "MetaVerse Experience",
      description: "Immersive 3D environment with WebGL rendering and multiplayer sync.",
      tech: ["Three.js", "WebRTC"],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80&auto=format&fit=crop",
    },
  ];

  const skills: Skill[] = [
    { name: "React / Next", level: 96, category: "frontend", icon: "⚛️" },
    { name: "TypeScript", level: 94, category: "frontend", icon: "📘" },
    { name: "Node.js", level: 92, category: "backend", icon: "🟢" },
    { name: "Cloud (AWS)", level: 88, category: "cloud", icon: "☁️" },
  ];

  const experiences: Experience[] = [
    {
      year: "2022 - Present",
      role: "Lead Full Stack Architect",
      company: "TechVision Inc.",
      description: "Designing distributed, resilient platforms and mentoring engineering teams.",
      logo: "🚀",
    },
    {
      year: "2020 - 2022",
      role: "Senior Frontend Engineer",
      company: "Digital Dynamics",
      description: "Built design systems, optimized runtime performance and accessibility.",
      logo: "💻",
    },
  ];

  // mouse / cursor background
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
        setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // refined particle canvas with connecting subtle lines (lightweight)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const points: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const count = Math.max(40, Math.min(90, Math.floor((w * h) / 200000)));
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.6 + 0.15,
      });
    }

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // dark vignette
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(6,7,19,0.2)");
      g.addColorStop(1, "rgba(7,6,20,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // draw points
      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // connect close points softly
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(99,102,241,${(140 - dist) / 700})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      // draw points
      points.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(99,102,241, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    try {
      await new Promise((r) => setTimeout(r, 900));
      console.log("Send contact", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const anim = (v: boolean, name = "") => (v ? `transition-opacity duration-700 opacity-100 ${name}` : "opacity-0");

  /** tilt preview card used in hero (subtle tilt with mouse pos) */
  const TiltPreview: React.FC<{ image?: string; title?: string; subtitle?: string }> = ({ image, title, subtitle }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rx: py * -6, ry: px * 8, s: 1.02 });
      };
      const onLeave = () => setTilt({ rx: 0, ry: 0, s: 1 });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, []);
    return (
        <div
            ref={ref}
            className="relative w-full max-w-md rounded-2xl overflow-hidden gradient-border p-1"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
              transition: "transform 180ms ease-out",
            }}
        >
          <div className="glass-morphism p-6 rounded-xl h-full flex flex-col">
            <div className="relative rounded-lg overflow-hidden flex-1">
              <img src={image} alt={title} className="w-full h-56 object-cover skeleton-loader" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <div className="text-sm text-gray-300">Featured</div>
                  <div className="text-lg font-bold text-white">{title}</div>
                  {subtitle && <div className="text-sm text-gray-300 mt-1">{subtitle}</div>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-300">React · Node · Cloud</div>
              <div className="text-xs text-gray-400">Live demo</div>
            </div>
          </div>
        </div>
    );
  };

  const Navigation = (
      <nav className="fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-sm glass-morphism/20 rounded-b-2xl">
          <div className="flex items-center gap-4">
            <div className="text-xl font-black text-gradient">LASINDU</div>
            <div className="text-xs text-gray-400 hidden sm:block">Architecture • Web • Cloud</div>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {(["home", "work", "skills", "experience", "contact"] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => setSection(s)}
                    className={`capitalize font-medium ${
                        section === s ? "text-gradient text-shadow-glow" : "text-gray-300 hover:text-white"
                    }`}
                >
                  {s}
                </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSection("contact")} className="px-4 py-2 rounded-full premium-gradient text-black font-semibold shadow-lg">
              Hire Me
            </button>
            <button className="md:hidden p-2" onClick={() => setMenuOpen((v) => !v)}>
              <div className="w-6 h-6 space-y-1">
                <span className="block h-0.5 bg-white" />
                <span className="block h-0.5 bg-white" />
                <span className="block h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </div>

        {/* mobile */}
        <div className={`md:hidden overflow-hidden transition-all ${menuOpen ? "max-h-80" : "max-h-0"}`}>
          <div className="px-6 pb-4 flex flex-col gap-2">
            {(["home", "work", "skills", "experience", "contact"] as const).map((s) => (
                <button key={s} onClick={() => { setSection(s); setMenuOpen(false); }} className="py-3 text-left">
                  {s}
                </button>
            ))}
          </div>
        </div>
      </nav>
  );

  return (
      <div className="min-h-screen relative text-white bg-slate-900 overflow-x-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        {/* subtle mouse radial behind content */}
        <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(99,102,241,0.06) 0%, transparent 40%)`,
            }}
        />

        {Navigation}

        <main className="relative z-10">
          {/* HERO */}
          {section === "home" && (
              <section className="min-h-screen grid grid-cols-1 lg:grid-cols-12 items-center gap-8 px-6 pt-28" ref={heroReveal.ref as any}>
                <div className={`lg:col-span-7 ${anim(heroReveal.visible || section === "home", "scale-in")}`}>
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 mb-6">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <small className="text-sm text-gray-300">Available for strategic projects</small>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                      Crafting digital products with <span className="text-gradient">precision</span> & <span className="text-gradient">elegance</span>.
                    </h1>

                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      I&apos;m Lasindu — architecting scalable web platforms, polished front-ends, and resilient cloud systems for premium brands.
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                      <button onClick={() => setSection("work")} className="px-6 py-3 rounded-2xl premium-gradient text-black font-semibold shadow-xl btn-magnetic">
                        View Work
                      </button>
                      <a href="#" className="px-6 py-3 rounded-2xl border border-white/10 text-gray-200">Download CV</a>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                      <div className="text-center">
                        <div className="text-2xl font-black text-gradient">50+</div>
                        <div className="text-sm text-gray-400">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-gradient">5+</div>
                        <div className="text-sm text-gray-400">Years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-gradient">100%</div>
                        <div className="text-sm text-gray-400">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${anim(heroReveal.visible || section === "home")}`}>
                  <TiltPreview
                      image={projects[0].image}
                      title={projects[0].title}
                      subtitle={"Fintech · Dashboard · Realtime"}
                  />
                </div>
              </section>
          )}

          {/* WORK */}
          {section === "work" && (
              <section className="py-20 px-6" ref={workReveal.ref as any}>
                <div className={`max-w-7xl mx-auto ${anim(workReveal.visible || section === "work")}`}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-4xl font-extrabold mb-1">Featured Work</h2>
                      <p className="text-gray-400">Selected projects that combine design, performance, and reliability.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                    {projects.map((p) => (
                        <div key={p.id} className="relative rounded-2xl overflow-hidden transform transition hover:scale-102 card-hover">
                          <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                            <div className="text-xs text-gray-300 mb-1">Project</div>
                            <div className="text-xl font-bold">{p.title}</div>
                            <p className="text-sm text-gray-300 mt-2">{p.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex gap-2 flex-wrap">
                                {p.tech.map((t) => (
                                    <span key={t} className="text-xs bg-white/6 px-2 py-1 rounded">{t}</span>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-2 rounded-lg bg-white/6 text-sm">View</button>
                                <button className="px-3 py-2 rounded-lg border border-white/10 text-sm">Code</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </section>
          )}

          {/* SKILLS */}
          {section === "skills" && (
              <section className="py-20 px-6" ref={skillsReveal.ref as any}>
                <div className={`max-w-6xl mx-auto ${anim(skillsReveal.visible || section === "skills")}`}>
                  <h2 className="text-4xl font-extrabold mb-2">Tech Stack</h2>
                  <p className="text-gray-400 mb-8">Tools and frameworks I use frequently — presented with clarity.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((s) => (
                        <div key={s.name} className="p-6 rounded-2xl glass-morphism border border-white/8 flex flex-col items-center gap-4">
                          <CircularProgress size={96} value={s.level} label={`${s.level}%`} />
                          <div className="text-lg font-bold text-white">{s.name}</div>
                          <div className="text-sm text-gray-400">{s.category}</div>
                        </div>
                    ))}
                  </div>
                </div>
              </section>
          )}

          {/* EXPERIENCE */}
          {section === "experience" && (
              <section className="py-20 px-6" ref={expReveal.ref as any}>
                <div className={`max-w-5xl mx-auto ${anim(expReveal.visible || section === "experience")}`}>
                  <h2 className="text-4xl font-extrabold mb-2">Journey</h2>
                  <p className="text-gray-400 mb-8">Professional highlights & impact-driven roles.</p>

                  <div className="relative">
                    <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-white/6 hidden sm:block" />
                    <div className="space-y-8">
                      {experiences.map((ex, idx) => (
                          <div key={ex.role} className="sm:pl-12 sm:relative">
                            <div className="absolute left-0 top-2 sm:left-3 sm:top-4 w-10 h-10 rounded-full premium-gradient flex items-center justify-center text-black font-bold shadow-md">
                              {ex.logo}
                            </div>
                            <div className="bg-white/3 glass-morphism p-6 rounded-2xl border border-white/8">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-lg font-bold">{ex.role}</div>
                                  <div className="text-sm text-indigo-300">{ex.company}</div>
                                </div>
                                <div className="text-xs text-gray-300">{ex.year}</div>
                              </div>
                              <p className="text-gray-300 mt-3">{ex.description}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
          )}

          {/* CONTACT */}
          {section === "contact" && (
              <section className="py-20 px-6" ref={contactReveal.ref as any}>
                <div className={`max-w-6xl mx-auto ${anim(contactReveal.visible || section === "contact")}`}>
                  <h2 className="text-4xl font-extrabold mb-2">Let&apos;s Collaborate</h2>
                  <p className="text-gray-400 mb-8">I work with teams and founders to design and build premium digital products.</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-morphism border border-white/8">
                      {status === "success" && <div className="mb-4 p-3 bg-green-600/20 rounded">Message sent ✅</div>}
                      {status === "error" && <div className="mb-4 p-3 bg-red-600/20 rounded">Something went wrong ❌</div>}

                      <div className="grid gap-4 sm:grid-cols-2 mb-4">
                        <input name="name" placeholder="Name" required value={form.name} onChange={handleChange} className="p-3 bg-white/5 rounded" />
                        <input name="email" placeholder="Email" required value={form.email} onChange={handleChange} className="p-3 bg-white/5 rounded" />
                      </div>

                      <select name="subject" required value={form.subject} onChange={handleChange} className="w-full p-3 mb-4 bg-white/5 rounded">
                        <option value="">Select subject</option>
                        <option value="project">Project</option>
                        <option value="hire">Hire</option>
                        <option value="consult">Consultation</option>
                      </select>

                      <textarea name="message" rows={6} required value={form.message} onChange={handleChange} className="w-full p-3 mb-4 bg-white/5 rounded" placeholder="Tell me about the project..." />

                      <button type="submit" disabled={loading} className="w-full py-3 rounded-xl premium-gradient text-black font-semibold">
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </form>

                    <aside className="space-y-6">
                      <div className="p-6 rounded-2xl glass-morphism border border-white/8">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-400">Email</div>
                            <a href="mailto:hello@lasindu.dev" className="text-lg font-semibold">hello@lasindu.dev</a>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-400">Location</div>
                            <div className="font-semibold">Colombo, Sri Lanka</div>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-white/6 pt-4">
                          <div className="text-sm text-gray-400 mb-2">Availability</div>
                          <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">Open for projects</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl flex gap-3">
                        {["Twitter", "GitHub", "LinkedIn"].map((s) => (
                            <a key={s} href="#" className="flex-1 py-2 rounded-lg border border-white/6 text-center text-sm">
                              {s}
                            </a>
                        ))}
                      </div>
                    </aside>
                  </div>
                </div>
              </section>
          )}
        </main>

        <footer className="py-8 text-center border-t border-white/6 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-lg font-bold">LASINDU</div>
            <div className="text-sm text-gray-400">Crafting premium digital experiences with Bini.js</div>
            <div className="text-xs text-gray-500 mt-3">© {new Date().getFullYear()} Lasindu. All rights reserved.</div>
          </div>
        </footer>
      </div>
  );
}

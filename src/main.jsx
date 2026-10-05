import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Apple, ArrowDownRight, ArrowUpRight, Bell, Brain, CalendarDays, Camera,
  Check, ChevronDown, ChevronRight, CircleHelp, ClipboardList, CloudUpload, Download,
  Droplets, FileHeart, FileText, Flame, HeartPulse, Home, Leaf, LockKeyhole, Menu,
  MessageCircle, MoreHorizontal, Pill, Plus, Search, Send, Settings2, ShieldCheck,
  Sparkles, Target, TimerReset, TrendingUp, UploadCloud, UserRound, Utensils, Wind,
  X, Zap
} from 'lucide-react';
import './styles.css';
import { askAI, buildPersonalPlan } from './services/ai.js';

const nav = [
  { label: 'Overview', icon: Home },
  { label: 'Health Vault', icon: FileHeart },
  { label: 'Nutrition', icon: Utensils },
  { label: 'Medications', icon: Pill },
  { label: 'Move', icon: Wind },
  { label: 'AI Coach', icon: Brain, tag: 'BETA' },
];

const defaultMeds = [
  { name: 'Vitamin D3', dose: '1000 IU', time: '08:00 AM', status: 'taken' },
  { name: 'Omega-3', dose: '1 capsule', time: '01:00 PM', status: 'upcoming' },
  { name: 'Magnesium', dose: '200 mg', time: '09:30 PM', status: 'upcoming' },
];

const records = [
  { title: 'Comprehensive Blood Panel', meta: 'Sep 28, 2026 • 14 pages', type: 'PDF', tone: 'mint' },
  { title: 'Nutrition Consultation', meta: 'Sep 22, 2026 • 6 pages', type: 'PDF', tone: 'lavender' },
  { title: 'Annual Health Check', meta: 'Aug 14, 2026 • 9 pages', type: 'PDF', tone: 'peach' },
  { title: 'Prescription Summary', meta: 'Sep 10, 2026 • 2 pages', type: 'PDF', tone: 'sky' },
];

const meals = [
  { slot: 'Breakfast', title: 'Greek yogurt • berries • almonds', protein: 32, kcal: 430 },
  { slot: 'Lunch', title: 'Paneer quinoa bowl • greens', protein: 41, kcal: 620 },
  { slot: 'Snack', title: 'Protein shake • banana', protein: 27, kcal: 290 },
  { slot: 'Dinner', title: 'Dal • roti • mixed vegetables', protein: 29, kcal: 480 },
];

const weeklyProtein = [108, 121, 134, 117, 142, 127, 129];

function App() {
  const [active, setActive] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [meds, setMeds] = useState(defaultMeds);
  const [protein, setProtein] = useState(129);
  const [water, setWater] = useState(1.8);
  const [query, setQuery] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: 'Good morning. I’ve reviewed your recent logs and prepared a gentle plan for today. Ask me about meals, movement, medications, or your stored health records.' }
  ]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__vitaToast);
    window.__vitaToast = window.setTimeout(() => setToast(''), 2400);
  };

  const markMed = (index) => {
    setMeds(current => current.map((m, i) => i === index ? { ...m, status: 'taken' } : m));
    notify('Medication logged • adherence updated');
  };

  const addProtein = (value) => {
    setProtein(v => Math.min(220, v + value));
    notify(`Added ${value}g protein to today`);
  };

  const addWater = () => {
    setWater(v => Math.min(3.5, +(v + 0.25).toFixed(2)));
    notify('Hydration updated • +250 ml');
  };

  const submitAI = async (preset = query) => {
    const prompt = String(preset || '').trim();
    if (!prompt) return;
    setAiMessages(m => [...m, { role: 'user', text: prompt }]);
    setQuery('');
    const response = await askAI(prompt, { protein, water, meds });
    setAiMessages(m => [...m, { role: 'ai', text: response }]);
  };

  const personalizedPlan = useMemo(() => buildPersonalPlan({ protein, water, meds }), [protein, water, meds]);

  useEffect(() => {
    try {
      localStorage.setItem('vitahealth-progress', JSON.stringify({ protein, water, meds }));
    } catch {}
  }, [protein, water, meds]);

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebarTop">
          <div className="brand">
            <div className="brandMark"><HeartPulse size={19} strokeWidth={2.4} /></div>
            <div>
              <strong>VitaHealth</strong>
              <span>Personal wellness OS</span>
            </div>
          </div>
          <button className="mobileClose" onClick={() => setMobileOpen(false)}><X size={18}/></button>

          <div className="workspaceSwitch">
            <div className="workspaceIcon"><UserRound size={16}/></div>
            <div><span>Profile</span><strong>Dhruv’s space</strong></div>
            <ChevronDown size={15}/>
          </div>

          <nav className="navGroup">
            {nav.map(({ label, icon: Icon, tag }) => (
              <button
                key={label}
                className={`navItem ${active === label ? 'active' : ''}`}
                onClick={() => { setActive(label); setMobileOpen(false); }}
              >
                <span className="navIcon"><Icon size={17}/></span>
                <span>{label}</span>
                {tag && <em>{tag}</em>}
              </button>
            ))}
          </nav>

          <div className="sidebarSectionLabel">INSIGHTS</div>
          <button className="navItem mutedNav" onClick={() => notify('Trend report is opening')}>
            <span className="navIcon"><TrendingUp size={17}/></span><span>My trends</span>
          </button>
          <button className="navItem mutedNav" onClick={() => notify('Goals panel is opening')}>
            <span className="navIcon"><Target size={17}/></span><span>Goals</span>
          </button>
        </div>

        <div className="sidebarBottom">
          <div className="privacyCard">
            <div className="privacyIcon"><LockKeyhole size={15}/></div>
            <div><strong>Privacy first</strong><span>Encrypted & in your control</span></div>
            <ShieldCheck size={15} />
          </div>
          <div className="profileRow">
            <div className="avatar">DA</div>
            <div><strong>Dhruv</strong><span>Wellness profile</span></div>
            <MoreHorizontal size={17}/>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="titleBlock">
            <button className="mobileMenu" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
            <div>
              <div className="dateLine"><span className="liveDot"></span>THURSDAY • 02 OCT 2026</div>
              <h1>{active === 'Overview' ? 'Your health, in one calm view.' : active}</h1>
            </div>
          </div>
          <div className="topbarActions">
            <button className="roundBtn" title="Search"><Search size={18}/></button>
            <button className="roundBtn" title="Notifications" onClick={() => notify('You have 2 health reminders')}><Bell size={18}/><span className="notifDot"></span></button>
            <button className="aiButton" onClick={() => setActive('AI Coach')}><Sparkles size={15}/> Ask Vita <span>AI</span></button>
          </div>
        </header>

        <div className="page">
          {active === 'Overview' && <Overview notify={notify} protein={protein} water={water} meds={meds} addProtein={addProtein} addWater={addWater} markMed={markMed} plan={personalizedPlan} setActive={setActive} />}
          {active === 'Health Vault' && <Vault notify={notify} />}
          {active === 'Nutrition' && <Nutrition protein={protein} addProtein={addProtein} notify={notify} />}
          {active === 'Medications' && <Medications meds={meds} markMed={markMed} notify={notify} />}
          {active === 'Move' && <Move notify={notify} />}
          {active === 'AI Coach' && <AICoach messages={aiMessages} query={query} setQuery={setQuery} submitAI={submitAI} plan={personalizedPlan} notify={notify} />}
        </div>
      </main>

      {toast && <div className="toast"><Check size={15}/>{toast}</div>}
    </div>
  );
}

function Overview({ notify, protein, water, meds, addProtein, addWater, markMed, plan, setActive }) {
  const adherence = Math.round((meds.filter(m => m.status === 'taken').length / meds.length) * 100);
  const score = Math.min(100, 68 + Math.round(protein / 12) + Math.round(water * 3) + (adherence > 30 ? 7 : 0));

  return <div className="stack">
    <section className="heroPanel">
      <div className="heroCopy">
        <div className="aiPill"><Sparkles size={13}/> DAILY INTELLIGENCE</div>
        <h2>Small actions.<br/><span>Big compounding wins.</span></h2>
        <p>Your personal health cockpit turns records, routines, nutrition and movement into one clear next step.</p>
        <div className="heroActions">
          <button className="primaryBtn" onClick={() => setActive('AI Coach')}>See today’s plan <ArrowUpRight size={15}/></button>
          <button className="secondaryBtn" onClick={() => notify('Your health scan has been queued')}>Run health scan <Zap size={15}/></button>
        </div>
        <div className="heroMeta"><span><Check size={12}/> 4 habits on track</span><span><Activity size={12}/> 6-day consistency streak</span></div>
      </div>
      <div className="heroVisual">
        <div className="glow glowA"></div><div className="glow glowB"></div><div className="heroOrb">
          <div className="orbLabel">WELLNESS<br/>SCORE</div>
          <div className="orbScore">{score}<small>/100</small></div>
          <div className="orbDelta"><TrendingUp size={12}/> +8 this week</div>
        </div>
        <div className="floatingStat statOne"><div className="tinyIcon mint"><Flame size={14}/></div><div><span>Protein</span><strong>{protein}g</strong></div></div>
        <div className="floatingStat statTwo"><div className="tinyIcon blue"><Droplets size={14}/></div><div><span>Hydration</span><strong>{water.toFixed(1)}L</strong></div></div>
        <div className="floatingStat statThree"><div className="tinyIcon lavender"><Brain size={14}/></div><div><span>AI readiness</span><strong>92%</strong></div></div>
      </div>
    </section>

    <section className="kpiRow">
      <KPI icon={Flame} label="Protein today" value={`${protein}g`} sub="target 150g" progress={Math.min(100, protein/1.5)} />
      <KPI icon={Pill} label="Medication" value={`${meds.filter(m => m.status === 'taken').length}/${meds.length}`} sub={`${adherence}% adherence`} progress={adherence} />
      <KPI icon={Wind} label="Movement" value="42 min" sub="goal 60 min" progress={70} />
      <KPI icon={Droplets} label="Hydration" value={`${water.toFixed(1)}L`} sub="goal 2.5L" progress={Math.min(100, water/2.5*100)} />
    </section>

    <div className="sectionIntro">
      <div><span className="micro">TODAY • PERSONALIZED</span><h3>Your health cockpit</h3></div>
      <button className="linkBtn" onClick={() => notify('Daily overview refreshed')}>Refresh intelligence <ArrowUpRight size={14}/></button>
    </div>

    <section className="contentGrid">
      <Card title="Your next medication" icon={Pill} action="Manage" onAction={() => setActive('Medications')}>
        <div className="nextMed">
          <div className="medTime">01<span>PM</span></div>
          <div className="nextMedText"><strong>Omega-3</strong><span>1 capsule • after lunch</span><small>in 3h 52m</small></div>
          <button className="checkBtn" onClick={() => markMed(1)} title="Mark taken"><Check size={17}/></button>
        </div>
        <div className="miniTimeline"><span className="done"></span><i></i><span></span><i></i><span></span></div>
        <div className="tinyNote">Gentle reminder will nudge you when it’s time.</div>
      </Card>

      <Card title="Protein progress" icon={Utensils} action="Log meal" onAction={() => setActive('Nutrition')}>
        <div className="progressHeadline"><div><strong>{protein}g</strong><span> / 150g</span></div><span className="percentBadge">{Math.round(protein/150*100)}%</span></div>
        <div className="bigProgress"><i style={{ width: `${Math.min(100, protein/1.5)}%` }}></i></div>
        <div className="mealMiniList">
          {meals.slice(0, 3).map((m) => <div key={m.slot}><span>{m.slot}</span><strong>{m.protein}g</strong></div>)}
        </div>
        <div className="quickAdds"><button onClick={() => addProtein(20)}>+20g</button><button onClick={() => addProtein(30)}>+30g</button><button onClick={() => addProtein(40)}>+40g</button></div>
      </Card>

      <Card title="AI wellness insight" icon={Brain} action="Ask Vita" onAction={() => setActive('AI Coach')} dark>
        <div className="aiInsightCard">
          <div className="insightTop"><div className="aiSpark"><Sparkles size={16}/></div><span>PERSONALIZED FROM YOUR LOGS</span></div>
          <h4>{plan.headline}</h4>
          <p>{plan.copy}</p>
          <button className="softBtn" onClick={() => notify('Suggestion added to today’s plan')}>Apply suggestion <ArrowUpRight size={14}/></button>
        </div>
      </Card>
    </section>

    <section className="twoColumn">
      <Card title="Health records" icon={FileHeart} action="Open vault" onAction={() => setActive('Health Vault')}>
        <div className="recordList compact">
          {records.slice(0, 3).map(r => <RecordRow key={r.title} record={r} />)}
        </div>
      </Card>
      <Card title="7-day protein rhythm" icon={TrendingUp} action="Deep dive" onAction={() => setActive('Nutrition')}>
        <MiniChart />
        <div className="chartLegend"><span><i className="legendDot"></i> Daily grams</span><span>Target 150g</span></div>
      </Card>
    </section>

    <section className="bottomStrip">
      <div className="stripIcon"><Sparkles size={18}/></div>
      <div><strong>Today’s intelligent nudge</strong><span>{plan.nudge}</span></div>
      <button onClick={() => setActive('AI Coach')}>Talk to Vita <ArrowUpRight size={14}/></button>
    </section>

    <Disclaimer />
  </div>;
}

function KPI({ icon: Icon, label, value, sub, progress }) {
  return <div className="kpiCard"><div className="kpiIcon"><Icon size={17}/></div><div className="kpiText"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><div className="kpiMeter"><i style={{ height: `${Math.min(100, progress)}%` }}></i></div></div>;
}

function Card({ title, icon: Icon, action, onAction, children, dark = false }) {
  return <section className={`card ${dark ? 'darkCard' : ''}`}>
    <div className="cardHead"><div><span className="cardIcon"><Icon size={16}/></span><h4>{title}</h4></div><button onClick={onAction}>{action}<ChevronRight size={13}/></button></div>
    {children}
  </section>;
}

function RecordRow({ record }) {
  return <div className="recordRow"><div className={`recordIcon ${record.tone}`}><FileText size={16}/></div><div><strong>{record.title}</strong><span>{record.meta}</span></div><em>{record.type}</em><ChevronRight size={15}/></div>;
}

function MiniChart() {
  const max = 155;
  const pts = weeklyProtein.map((v, i) => `${i * 50 + 6},${76 - (v/max)*58}`).join(' ');
  return <div className="miniChart"><svg viewBox="0 0 356 90" preserveAspectRatio="none" aria-label="Protein trend"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c8ef83" stopOpacity="0.28"/><stop offset="100%" stopColor="#c8ef83" stopOpacity="0"/></linearGradient></defs><path d={`M 6 76 L ${weeklyProtein.map((v,i)=>`${i*50+6} ${76-(v/max)*58}`).join(' L ')} L 306 76 Z`} fill="url(#areaFill)"/><polyline points={pts} fill="none" stroke="#176b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="0" y1="20" x2="356" y2="20" stroke="#eef2ef"/><line x1="0" y1="48" x2="356" y2="48" stroke="#eef2ef"/><line x1="0" y1="76" x2="356" y2="76" stroke="#eef2ef"/></svg><div className="chartLabels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>;
}

function Vault({ notify }) {
  return <div className="stack">
    <div className="moduleHero"><div><span className="micro">HEALTH VAULT</span><h2>Every report. One beautiful home.</h2><p>Organize blood work, prescriptions, scans and notes in a private health timeline.</p></div><div className="heroBadge"><ShieldCheck size={19}/><span>Private & encrypted</span></div></div>
    <section className="vaultActions"><button className="uploadHero" onClick={() => notify('Secure upload ready')}><UploadCloud size={20}/><strong>Drop a health document</strong><span>PDF, JPG, PNG • up to 20 MB</span><b>Choose files</b></button><div className="vaultStat"><div className="vaultStatIcon"><FileHeart size={18}/></div><span>Stored records</span><strong>24</strong><small>Across 7 categories</small></div><div className="vaultStat"><div className="vaultStatIcon sky"><ClipboardList size={18}/></div><span>Recent check-ins</span><strong>8</strong><small>Last 90 days</small></div></section>
    <div className="sectionIntro"><div><span className="micro">YOUR RECORDS</span><h3>Latest documents</h3></div><button className="linkBtn" onClick={() => notify('Filters opened')}><Settings2 size={14}/> Filters</button></div>
    <div className="recordList full">{records.map(r => <RecordRow key={r.title} record={r} />)}</div>
    <div className="privacyBanner"><LockKeyhole size={18}/><div><strong>Your records belong to you.</strong><span>AI can only use files you explicitly connect to a conversation or plan.</span></div><button onClick={() => notify('Privacy controls opened')}>Review controls</button></div>
    <Disclaimer />
  </div>;
}

function Nutrition({ protein, addProtein, notify }) {
  return <div className="stack">
    <div className="moduleHero nutritionHero"><div><span className="micro">NUTRITION INTELLIGENCE</span><h2>Eat for the goal, not the guess.</h2><p>Log what you eat, watch your protein rhythm and let the planner adjust the rest.</p></div><div className="nutritionDial"><div><strong>{protein}</strong><span>g protein</span></div></div></div>
    <div className="kpiRow"><KPI icon={Flame} label="Protein" value={`${protein}g`} sub="target 150g" progress={protein/1.5}/><KPI icon={Apple} label="Energy" value="1,820" sub="of 2,200 kcal" progress={83}/><KPI icon={Droplets} label="Hydration" value="1.8L" sub="goal 2.5L" progress={72}/><KPI icon={Leaf} label="Plant foods" value="5" sub="servings today" progress={71}/></div>
    <section className="contentGrid twoCards"><Card title="Today’s plate" icon={Utensils} action="Generate with AI" onAction={() => notify('AI meal plan generated')}><div className="mealRows">{meals.map(m => <div className="mealRow" key={m.slot}><div className="mealBadge">{m.slot[0]}</div><div><span>{m.slot}</span><strong>{m.title}</strong><small>{m.kcal} kcal • {m.protein}g protein</small></div><ChevronRight size={15}/></div>)}</div><div className="quickAdds wide"><button onClick={() => addProtein(20)}>Log 20g protein</button><button onClick={() => addProtein(30)}>Log 30g protein</button><button onClick={() => notify('Food scanner opened')}><Camera size={14}/> Scan food</button></div></Card><Card title="AI nutrition note" icon={Brain} action="Ask Vita"><div className="nutritionNote"><div className="sparkCircle"><Sparkles size={17}/></div><div><strong>Front-load 20–30g at breakfast.</strong><p>Your recent logs suggest you reach your target more consistently on days when breakfast contributes a stronger protein base.</p><span>Pattern confidence • 0.86</span></div></div><button className="outlineWide" onClick={() => notify('Recommendation saved')}>Save recommendation</button></Card></section>
    <Disclaimer />
  </div>;
}

function Medications({ meds, markMed, notify }) {
  return <div className="stack">
    <div className="moduleHero medicationHero"><div><span className="micro">MEDICATIONS</span><h2>Quiet reminders. Clear adherence.</h2><p>Keep your daily schedule visible without turning your day into a checklist.</p></div><div className="medRing"><Pill size={22}/><strong>{Math.round(meds.filter(m => m.status === 'taken').length / meds.length * 100)}%</strong><span>today</span></div></div>
    <div className="sectionIntro"><div><span className="micro">TODAY</span><h3>Medication timeline</h3></div><button className="primaryBtn small" onClick={() => notify('Add medication form opened')}><Plus size={14}/> Add medication</button></div>
    <section className="medicationPanel">{meds.map((m, i) => <div className={`medRow ${m.status}`} key={m.name}><div className="medTimeBlock"><strong>{m.time.split(' ')[0]}</strong><span>{m.time.split(' ')[1]}</span></div><div className="statusLine"><span className="statusDot"></span><i></i></div><div className="medInfo"><strong>{m.name}</strong><span>{m.dose}</span><small>{m.status === 'taken' ? 'Logged today' : 'Scheduled'} </small></div><div className="medAction">{m.status === 'taken' ? <span className="takenBadge"><Check size={13}/> Taken</span> : <button className="outlineBtn" onClick={() => markMed(i)}>Mark taken</button>}</div></div>)}</section>
    <div className="safetyStrip"><CircleHelp size={16}/><span>Keep prescription details aligned with your clinician’s instructions. VitaHealth reminders do not change doses.</span></div>
    <Disclaimer />
  </div>;
}

function Move({ notify }) {
  return <div className="stack">
    <div className="moveHero"><div><span className="aiPill">AI MOVEMENT PLAN</span><h2>12 minutes to feel more open.</h2><p>Mobility, balance and down-regulating breath work for a calm evening reset.</p><div className="heroActions"><button className="primaryBtn" onClick={() => notify('12-minute session started')}>Start session <ArrowUpRight size={15}/></button><button className="secondaryBtn dark" onClick={() => notify('Session saved')}>Save session</button></div></div><div className="poseCircle"><Wind size={62}/><span>Beginner</span></div></div>
    <div className="kpiRow"><KPI icon={Wind} label="Movement" value="42 min" sub="goal 60 min" progress={70}/><KPI icon={Activity} label="Steps" value="7,840" sub="goal 8,000" progress={98}/><KPI icon={HeartPulse} label="Mindful" value="14 min" sub="today" progress={70}/><KPI icon={TimerReset} label="Streak" value="6 days" sub="consistency" progress={86}/></div>
    <section className="contentGrid twoCards"><Card title="Your movement menu" icon={Wind} action="See library"><div className="sessionList">{[['Morning mobility','08 min','Easy'],['Desk reset','05 min','Easy'],['Evening reset','12 min','Easy'],['Breath + balance','09 min','Gentle']].map(([n,d,l]) => <div key={n}><div className="sessionThumb"><Wind size={16}/></div><div><strong>{n}</strong><span>{d} • {l}</span></div><button onClick={() => notify(`${n} opened`)}><ArrowUpRight size={15}/></button></div>)}</div></Card><Card title="Personalization signal" icon={Brain} action="Why this plan"><div className="signalCard"><div className="signalScore">92%</div><div><strong>Good match for your recent routine</strong><p>Plan adapted for your logged movement volume and evening preference.</p></div></div><div className="signalBars"><span style={{width:'92%'}}></span><span style={{width:'78%'}}></span><span style={{width:'71%'}}></span></div><div className="signalLegend"><span>mobility</span><span>balance</span><span>breathwork</span></div></Card></section>
    <Disclaimer />
  </div>;
}

function AICoach({ messages, query, setQuery, submitAI, plan, notify }) {
  const quickPrompts = ['How do I reach 150g protein today?', 'Summarize my health records', 'Give me a 15-minute yoga flow', 'Explain my wellness trend'];
  return <div className="stack aiPage">
    <div className="aiCommand"><div className="aiHeader"><div className="aiAvatar"><Brain size={21}/></div><div><span className="micro">VITA AI • WELLNESS COPILOT</span><h2>Ask anything about your plan.</h2></div><div className="aiStatus"><span></span> Online</div></div><p>Use AI to organize your information, surface patterns and build lifestyle suggestions. Outputs are informational and are not medical diagnoses.</p>
      <div className="chatWindow">{messages.map((m, i) => <div className={`chatBubble ${m.role}`} key={i}><div className="bubbleAvatar">{m.role === 'ai' ? <Sparkles size={13}/> : 'D'}</div><div><span className="bubbleRole">{m.role === 'ai' ? 'VITA AI' : 'YOU'}</span><p>{m.text}</p></div></div>)}</div>
      <div className="promptChips">{quickPrompts.map(p => <button key={p} onClick={() => submitAI(p)}>{p}</button>)}</div>
      <div className="composer"><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') submitAI(); }} placeholder="Ask about meals, trends, movement, or records…"/><button onClick={() => submitAI()}><Send size={16}/></button></div>
    </div>
    <section className="aiInsightGrid"><Card title="Today’s AI plan" icon={Sparkles} action="Refresh" onAction={() => notify('Plan refreshed')}><div className="planSteps">{plan.steps.map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong><ChevronRight size={14}/></div>)}</div></Card><Card title="How Vita personalizes" icon={Settings2} action="Learn more"><div className="personalizeList">{[['Records','Trends from connected health documents'],['Nutrition','Meal + protein consistency'],['Habits','Medication + movement rhythm'],['Context','Your preferences and goals']].map(([a,b]) => <div key={a}><div className="miniCheck"><Check size={12}/></div><div><strong>{a}</strong><span>{b}</span></div></div>)}</div></Card></section>
    <Disclaimer />
  </div>;
}

function Disclaimer() {
  return <footer className="disclaimer"><ShieldCheck size={14}/><span>VitaHealth is a wellness platform. AI suggestions are informational and should not replace professional medical advice, diagnosis, or treatment.</span></footer>;
}

createRoot(document.getElementById('root')).render(<App/>);

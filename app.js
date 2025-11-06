<script>
// Simple year footnote
window.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('yr');if(y) y.textContent=new Date().getFullYear();});

// Local storage helpers
const DB={
  get users(){return JSON.parse(localStorage.getItem('users')||'[]')},
  set users(v){localStorage.setItem('users',JSON.stringify(v))},
  get session(){return JSON.parse(localStorage.getItem('session')||'null')},
  set session(v){localStorage.setItem('session',JSON.stringify(v))},
  get access(){return JSON.parse(localStorage.getItem('access')||'{}')},
  set access(v){localStorage.setItem('access',JSON.stringify(v))},
  saveScore(testId,score,detail){const key='scores:'+ (DB.session?.email||'guest');const old=JSON.parse(localStorage.getItem(key)||'[]');old.push({id:testId,score,when:Date.now(),detail});localStorage.setItem(key,JSON.stringify(old));},
  getScores(){const key='scores:'+ (DB.session?.email||'guest');return JSON.parse(localStorage.getItem(key)||'[]');}
};

// Auth UI wiring (login.html)
(function(){
  const f=document.getElementById('loginForm');
  const s=document.getElementById('signupForm');
  const sc=document.getElementById('signupCard');
  const goto=document.getElementById('gotoSignup');
  if(goto&&sc){goto.addEventListener('click',e=>{e.preventDefault();sc.classList.remove('hidden');});}
  if(f){f.addEventListener('submit',e=>{e.preventDefault();const email=loginEmail.value.trim().toLowerCase();const pass=loginPass.value;const u=DB.users.find(x=>x.email===email&&x.pass===pass);if(!u){alert('Invalid credentials');return;}DB.session={email:u.email,name:u.name};location.href='dashboard.html';});}
  if(s){s.addEventListener('submit',e=>{e.preventDefault();const name=suName.value.trim();const email=suEmail.value.trim().toLowerCase();const pass=suPass.value;const users=DB.users;if(users.some(x=>x.email===email)){alert('Email already registered');return;}users.push({name,email,pass});DB.users=users;DB.session={email,name};location.href='dashboard.html';});}
})();

// Navbar Login/Logout buttons
(function(){
 const btn=document.getElementById('navAuthBtn');
 const logout=document.getElementById('logoutBtn');
 if(btn){btn.textContent = DB.session? 'Dashboard' : 'Login'; btn.href = DB.session? 'dashboard.html' : 'login.html';}
 if(logout){logout.addEventListener('click',()=>{DB.session=null;location.href='index.html';});}
})();

// Dashboard rendering
(function(){
  const nm=document.getElementById('userName');
  const st=document.getElementById('accessStatus');
  const note=document.getElementById('accessNote');
  const ul=document.getElementById('scoreList');
  if(nm){nm.textContent=DB.session?.name||'Student';}
  if(st){const acc=DB.access[DB.session?.email||'']||{plans:[]};const has=acc.plans?.includes('foundation')||acc.plans?.includes('inter')||acc.plans?.includes('final');st.textContent=has? 'Lifetime (Active)' : 'Free'; if(has&&note) note.textContent='You own lifetime access. Start tests from the Tests page.'}
  if(ul){const scores=DB.getScores();ul.innerHTML = scores.length? scores.map(s=>`<li><strong>${s.id}</strong> — ${s.score}% on ${new Date(s.when).toLocaleString()}</li>`).join('') : '<li class="muted">No attempts yet.</li>';}
})();

// Tests page: tabs + list + runner
(function(){
  const list=document.getElementById('testList');
  const runner=document.getElementById('testRunner');
  const qBox=document.getElementById('qBox');
  const resultBox=document.getElementById('resultBox');
  const submit=document.getElementById('submitTest');
  const reset=document.getElementById('resetTest');
  const tabs=document.querySelectorAll('.tab');
  if(!list) return;
  let currentTest=null;

  function renderCards(level){
    const bank=(window.QUESTION_BANK||{})[level]||[];
    list.innerHTML = bank.map((t,i)=>`
      <div class="card">
        <h3>${t.title}</h3>
        <p class="muted">${t.questions.length} Questions • ${t.negative? 'Negative marking on' : 'No negative'}</p>
        <button class="btn" data-i="${i}" data-level="${level}">Start</button>
      </div>`).join('');
    list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>start(level,parseInt(b.dataset.i))));
  }

  function start(level,idx){
    // access check
    const email=DB.session?.email||'';
    const acc=DB.access[email]||{plans:[]};
    const openDemo = level==='foundation';
    const allowed = openDemo || acc.plans.includes(level) || acc.plans.includes('inter') && (level==='inter') || acc.plans.includes('final') && (level==='final');
    if(!allowed){alert('Please purchase the plan to unlock this level.');location.href='pricing.html';return;}

    currentTest = (window.QUESTION_BANK[level]||[])[idx];
    if(!currentTest) return;
    runner.classList.remove('hidden');
    document.getElementById('testTitle').textContent=currentTest.title;
    document.getElementById('testInfo').textContent=`${currentTest.questions.length} Questions • 1 mark each`;
    qBox.innerHTML = currentTest.questions.map((q,qi)=>{
      const opts=q.options.map((op,oi)=>`<label><input type="radio" name="q${qi}" value="${oi}"> ${op}</label>`).join('');
      return `<div class="test-q"><div><strong>Q${qi+1}.</strong> ${q.text}</div><div class="opts">${opts}</div></div>`;
    }).join('');
    resultBox.classList.add('hidden');
  }

  function evaluate(){
    if(!currentTest) return;
    let correct=0; const det=[];
    currentTest.questions.forEach((q,qi)=>{
      const sel=[...document.querySelectorAll(`input[name=q${qi}]`)].find(r=>r.checked);
      const ans=sel? parseInt(sel.value) : -1;
      const ok=ans===q.answer;
      if(ok) correct++;
      det.push({q:qi+1, your:ans, correct:q.answer});
    });
    const pct = Math.round((correct/currentTest.questions.length)*100);
    DB.saveScore(currentTest.title,pct,det);
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `<div class="card"><h3>Score: ${pct}%</h3><p>${correct} / ${currentTest.questions.length} correct.</p><details><summary>Review answers</summary><ol>` + det.map(d=>`<li>Q${d.q}: You → ${d.your+1||'-'} | Correct → ${d.correct+1}</li>`).join('') + `</ol></details></div>`;
    alert('Result saved to your dashboard.');
  }

  submit?.addEventListener('click',evaluate);
  reset?.addEventListener('click',()=>{document.querySelectorAll('#qBox input[type=radio]').forEach(r=>r.checked=false);resultBox.classList.add('hidden');});

  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');renderCards(t.dataset.tab);}));
  renderCards('foundation');
})();

// Pricing: Razorpay checkout (front-end demo)
(function(){
  const buttons=document.querySelectorAll('.payBtn');
  if(!buttons.length) return;
  const PRICES={ foundation:1500, inter:3337, final:2574 };
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    if(!DB.session){alert('Please login or create an account first.');location.href='login.html';return;}
    const plan=btn.dataset.plan; const amount=PRICES[plan]*100; // paise
    const rzp=new Razorpay({
      key: 'rzp_test_xxxxxxxxxxxxx', // TODO: replace with your Razorpay key
      amount, currency:'INR', name:'CA Mock Test Series', description:`${plan} – lifetime`,
      handler:function (resp){
        // Mark plan as purchased (lifetime)
        const email=DB.session.email; const acc=DB.access; if(!acc[email]) acc[email]={plans:[]};
        if(!acc[email].plans.includes(plan)) acc[email].plans.push(plan);
        DB.access=acc;
        alert('Payment successful! Lifetime access unlocked for: '+plan.toUpperCase());
        location.href='dashboard.html';
      },
      prefill:{name:DB.session.name,email:DB.session.email},
      theme:{color:'#004aad'}
    });
    rzp.open();
  }));
})();

// Contact form (demo only)
(function(){
  const f=document.getElementById('contactForm');
  if(!f) return; f.addEventListener('submit',e=>{e.preventDefault(); alert('Thanks! We will reply on email.'); f.reset();});
})();
</script>
